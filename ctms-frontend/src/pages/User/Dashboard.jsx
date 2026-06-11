import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch tickets on page load
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await API.get("/tickets");
        setTickets(res.data.data);
      } catch  {
        setError("Failed to load tickets!");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Status color helper
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

  // Priority color helper
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
        <h1 className="text-xl font-bold text-blue-600">CTMS</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Welcome, {user?.name}!</span>
          <button
            onClick={() => navigate("/create-ticket")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + New Ticket
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Tickets</h2>

        {/* Loading */}
        {loading && (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading tickets...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded mb-4">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && tickets.length === 0 && (
          <div className="bg-white p-10 rounded-lg shadow text-center">
            <p className="text-gray-500 text-lg">No tickets found!</p>
            <button
              onClick={() => navigate("/create-ticket")}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Create Your First Ticket
            </button>
          </div>
        )}

        {/* Tickets list */}
        {!loading && tickets.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => navigate(`/tickets/${ticket.id}`)}
                className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 cursor-pointer hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      #{ticket.id} — {ticket.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {ticket.description?.substring(0, 100)}...
                    </p>
                    <div className="flex gap-2 mt-3">
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
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                    {ticket.department && (
                      <p className="text-xs text-gray-500 mt-1">
                        {ticket.department.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
