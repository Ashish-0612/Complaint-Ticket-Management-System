import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Dono ek saath fetch karo!
        const [ticketsRes, agentsRes] = await Promise.all([
          API.get("/tickets"),
          API.get("/users/agents"),
        ]);

        const allTickets = ticketsRes.data.data;
        setTickets(allTickets);
        setAgents(agentsRes.data.data);

        setStats({
          total: allTickets.length,
          open: allTickets.filter((t) => t.status === "open").length,
          inProgress: allTickets.filter((t) => t.status === "in-progress")
            .length,
          resolved: allTickets.filter((t) => t.status === "resolved").length,
        });
      } catch {
        setError("Failed to load data!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await API.put(`/tickets/${ticketId}`, { status: newStatus });

      const updated = tickets.map((t) =>
        t.id === ticketId ? { ...t, status: newStatus } : t,
      );
      setTickets(updated);

      setStats({
        total: updated.length,
        open: updated.filter((t) => t.status === "open").length,
        inProgress: updated.filter((t) => t.status === "in-progress").length,
        resolved: updated.filter((t) => t.status === "resolved").length,
      });
    } catch {
      alert("Failed to update status!");
    }
  };
const handleAgentAssign = async (ticketId, agentId) => {
  try {
    await API.put(`/tickets/${ticketId}`, {
      agentId: agentId === "" ? null : parseInt(agentId),
    });

    const res = await API.get("/tickets");
    const allTickets = res.data.data;
    setTickets(allTickets);

    setStats({
      total: allTickets.length,
      open: allTickets.filter((t) => t.status === "open").length,
      inProgress: allTickets.filter((t) => t.status === "in-progress").length,
      resolved: allTickets.filter((t) => t.status === "resolved").length,
    });
  } catch {
    alert("Failed to assign agent!");
  }
};

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-600";
      case "in-progress":
        return "bg-yellow-100 text-yellow-600";
      case "resolved":
        return "bg-green-100 text-green-600";
      case "closed":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-600";
      case "high":
        return "bg-orange-100 text-orange-600";
      case "medium":
        return "bg-yellow-100 text-yellow-600";
      case "low":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-red-600">CTMS Admin</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Welcome, {user?.name}!</span>
          <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
            {user?.role}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
            <p className="text-gray-500 mt-1">Total Tickets</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.open}</p>
            <p className="text-gray-500 mt-1">Open</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-3xl font-bold text-yellow-600">
              {stats.inProgress}
            </p>
            <p className="text-gray-500 mt-1">In Progress</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-3xl font-bold text-green-600">
              {stats.resolved}
            </p>
            <p className="text-gray-500 mt-1">Resolved</p>
          </div>
        </div>

        {/* All Tickets */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">All Tickets</h2>
          </div>

          {loading && (
            <div className="text-center py-10">
              <p className="text-gray-500">Loading tickets...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-600 p-4 m-4 rounded">
              {error}
            </div>
          )}

          {!loading && tickets.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No tickets found!</p>
            </div>
          )}

          {!loading && tickets.length > 0 && (
            <div className="divide-y divide-gray-100">
              {tickets.map((ticket) => (
                <div
                  key={`${ticket.id}-${ticket.agentId}`}
                  className="p-6 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    {/* Ticket Info */}
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => navigate(`/tickets/${ticket.id}`)}
                    >
                      <h3 className="font-semibold text-gray-800">
                        #{ticket.id} — {ticket.title}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        {ticket.description?.substring(0, 80)}...
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(ticket.status)}`}
                        >
                          {ticket.status}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(ticket.priority)}`}
                        >
                          {ticket.priority}
                        </span>
                        {ticket.department && (
                          <span className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-600">
                            {ticket.department.name}
                          </span>
                        )}
                      </div>
                      {ticket.creator && (
                        <p className="text-xs text-gray-400 mt-2">
                          By: {ticket.creator.name} —{" "}
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {/* Right side — dropdowns */}
                    <div className="ml-4 flex flex-col gap-3">
                      {/* Status Dropdown */}
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">
                          Status:
                        </label>
                        <select
                          value={ticket.status}
                          onChange={(e) =>
                            handleStatusChange(ticket.id, e.target.value)
                          }
                          className="border p-2 rounded text-sm outline-none focus:border-blue-500 w-36"
                        >
                          <option value="open">Open</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>

                      {/* Agent Assign Dropdown */}
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">
                          Assign Agent:
                        </label>
                        <select
                          value={ticket.agentId || ""}
                          onChange={(e) =>
                            handleAgentAssign(ticket.id, e.target.value)
                          }
                          className="border p-2 rounded text-sm outline-none focus:border-blue-500 w-36"
                        >
                          <option value="">Unassigned</option>
                          {agents.map((agent) => (
                            <option key={agent.id} value={agent.id}>
                              {agent.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
