import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import {
  Ticket,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  TrendingUp,
  Bell,
  Search,
  Filter,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  Settings,
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
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
          closed: allTickets.filter((t) => t.status === "closed").length,
        });
      } catch {
        setError("Failed to load data!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
        closed: updated.filter((t) => t.status === "closed").length,
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
      setTickets(res.data.data);
    } catch {
      alert("Failed to assign agent!");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchSearch =
      ticket.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.creator?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus =
      filterStatus === "all" || ticket.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "in-progress":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "resolved":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "closed":
        return "bg-gray-100 text-gray-600 border border-gray-200";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return "bg-red-50 text-red-700 border border-red-200";
      case "high":
        return "bg-orange-50 text-orange-700 border border-orange-200";
      case "medium":
        return "bg-yellow-50 text-yellow-700 border border-yellow-200";
      case "low":
        return "bg-green-50 text-green-700 border border-green-200";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPriorityDot = (priority) => {
    switch (priority) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ========== SIDEBAR ========== */}
      <aside className="w-64 bg-gray-900 flex flex-col fixed h-full z-20">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <Ticket size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">
                CTMS
              </h1>
              <p className="text-gray-500 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="px-4 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3 bg-gray-800 rounded-xl p-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-sm font-medium truncate">
                {user?.name}
              </p>
              <p className="text-gray-400 text-xs truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider px-3 mb-3">
            Main Menu
          </p>

          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium">
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            onClick={() => navigate("/create-ticket")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white text-sm font-medium transition-all"
          >
            <PlusCircle size={18} />
            Create Ticket
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white text-sm font-medium transition-all">
            <Users size={18} />
            Agents
            <span className="ml-auto bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full">
              {agents.length}
            </span>
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white text-sm font-medium transition-all">
            <TrendingUp size={18} />
            Analytics
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white text-sm font-medium transition-all">
            <Settings size={18} />
            Settings
          </button>
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-red-600 hover:text-white text-sm font-medium transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <div className="ml-64 flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Dashboard Overview
            </h1>
            <p className="text-gray-500 text-sm">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <Bell size={20} />
              {stats.open > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600 font-medium">Online</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Ticket size={22} className="text-blue-600" />
                </div>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
                  Total
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              <p className="text-gray-500 text-sm mt-1">All Tickets</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center">
                  <AlertCircle size={22} className="text-orange-600" />
                </div>
                <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full font-medium">
                  Action Needed
                </span>
              </div>
              <p className="text-3xl font-bold text-orange-600">{stats.open}</p>
              <p className="text-gray-500 text-sm mt-1">Open Tickets</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center">
                  <Clock size={22} className="text-amber-600" />
                </div>
                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full font-medium">
                  In Progress
                </span>
              </div>
              <p className="text-3xl font-bold text-amber-600">
                {stats.inProgress}
              </p>
              <p className="text-gray-500 text-sm mt-1">Being Handled</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <CheckCircle size={22} className="text-emerald-600" />
                </div>
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-medium">
                  Done
                </span>
              </div>
              <p className="text-3xl font-bold text-emerald-600">
                {stats.resolved}
              </p>
              <p className="text-gray-500 text-sm mt-1">Resolved</p>
            </div>
          </div>

          {/* Tickets Section */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    All Tickets
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {filteredTickets.length} tickets found
                  </p>
                </div>

                {/* Search + Filter */}
                <div className="flex gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search tickets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                    />
                  </div>
                  <div className="relative">
                    <Filter
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 appearance-none bg-white cursor-pointer"
                    >
                      <option value="all">All Status</option>
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="text-center py-16">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading tickets...</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 m-6 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            {/* Empty */}
            {!loading && filteredTickets.length === 0 && (
              <div className="text-center py-16">
                <Ticket size={48} className="text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No tickets found!</p>
                <p className="text-gray-400 text-sm mt-1">
                  Try changing your search or filter
                </p>
              </div>
            )}

            {/* Tickets List */}
            {!loading && filteredTickets.length > 0 && (
              <div className="divide-y divide-gray-50">
                {filteredTickets.map((ticket) => (
                  <div
                    key={`${ticket.id}-${ticket.agentId}`}
                    className="p-5 hover:bg-gray-50 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Left — Ticket Info */}
                      <div
                        className="flex-1 cursor-pointer min-w-0"
                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className={`w-2 h-2 rounded-full flex-shrink-0 ${getPriorityDot(ticket.priority)}`}
                          ></div>
                          <span className="text-xs text-gray-400 font-mono">
                            #{ticket.id}
                          </span>
                          <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                            {ticket.title}
                          </h3>
                          <ChevronRight
                            size={14}
                            className="text-gray-300 group-hover:text-blue-400 flex-shrink-0 ml-auto"
                          />
                        </div>

                        <p className="text-gray-500 text-sm mb-3 ml-4 line-clamp-1">
                          {ticket.description}
                        </p>

                        <div className="flex gap-2 flex-wrap ml-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}
                          >
                            {ticket.status}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}
                          >
                            {ticket.priority}
                          </span>
                          {ticket.department && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs bg-purple-50 text-purple-700 border border-purple-200">
                              {ticket.department.name}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-3 ml-4 text-xs text-gray-400">
                          <span>👤 {ticket.creator?.name}</span>
                          <span>·</span>
                          <span>
                            📅 {new Date(ticket.createdAt).toLocaleDateString()}
                          </span>
                          {ticket.agent && (
                            <>
                              <span>·</span>
                              <span>🔧 {ticket.agent.name}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Right — Actions */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <select
                          value={ticket.status}
                          onChange={(e) =>
                            handleStatusChange(ticket.id, e.target.value)
                          }
                          className="border border-gray-200 px-3 py-1.5 rounded-lg text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 w-32 bg-white cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="open">Open</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>

                        <select
                          value={ticket.agentId || ""}
                          onChange={(e) =>
                            handleAgentAssign(ticket.id, e.target.value)
                          }
                          className="border border-gray-200 px-3 py-1.5 rounded-lg text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 w-32 bg-white cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
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
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
