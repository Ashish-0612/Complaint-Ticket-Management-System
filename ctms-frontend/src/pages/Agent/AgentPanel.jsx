import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import {
  LayoutDashboard,
  Ticket,
  CheckCircle,
  Clock,
  AlertCircle,
  LogOut,
  Bell,
  TrendingUp,
  UserCog,
  Activity,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const AgentPanel = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await API.get("/tickets");
        const myTickets = res.data.data;
        setTickets(myTickets);
        setStats({
          total: myTickets.length,
          open: myTickets.filter((t) => t.status === "open").length,
          inProgress: myTickets.filter((t) => t.status === "in-progress")
            .length,
          resolved: myTickets.filter((t) => t.status === "resolved").length,
        });
      } catch {
        console.log("Failed to load");
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
      alert("Failed to update!");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-700";
      case "in-progress":
        return "bg-yellow-100 text-yellow-700";
      case "resolved":
        return "bg-green-100 text-green-700";
      case "closed":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-700";
      case "high":
        return "bg-orange-100 text-orange-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Pie chart data
  const pieData = [
    { name: "In Progress", value: stats.inProgress, color: "#f59e0b" },
    { name: "Pending", value: stats.open, color: "#f97316" },
    { name: "Resolved", value: stats.resolved, color: "#22c55e" },
  ].filter((d) => d.value > 0);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: Ticket, label: "Assigned Complaints" },
    { icon: CheckCircle, label: "All Complaints" },
    { icon: Activity, label: "My Activity" },
    { icon: UserCog, label: "Profile" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ========== SIDEBAR ========== */}
      <aside className="w-56 bg-gray-900 flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Ticket size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">
                Complaint
              </p>
              <p className="text-gray-400 text-xs mt-0.5">Management System</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider px-2 mb-3">
            Main Menu
          </p>
          <ul className="space-y-0.5">
            {navItems.map((item, i) => (
              <li key={i}>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    item.active
                      ? "bg-green-600 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <item.icon size={17} />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t border-gray-800">
          <div className="flex items-center gap-2.5 px-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-xs font-medium truncate">
                {user?.name}
              </p>
              <p className="text-gray-500 text-xs">Agent</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-400 hover:bg-red-600 hover:text-white text-sm transition-all cursor-pointer"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* ========== MAIN ========== */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Agent Dashboard</h1>
            <p className="text-gray-500 text-sm">
              Welcome back, {user?.name}! 👋
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer">
              <Bell size={18} />
              {stats.open > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            <div className="flex items-center gap-2 border border-gray-200 px-3 py-1.5 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {user?.name}
              </span>
              <span className="text-xs text-gray-400">▾</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Assigned to Me",
                value: stats.total,
                icon: Ticket,
                color: "bg-blue-50",
                iconColor: "text-blue-600",
                sub: "Total complaints",
              },
              {
                label: "In Progress",
                value: stats.inProgress,
                icon: Clock,
                color: "bg-yellow-50",
                iconColor: "text-yellow-600",
                sub: "Total complaints",
              },
              {
                label: "Resolved",
                value: stats.resolved,
                icon: CheckCircle,
                color: "bg-green-50",
                iconColor: "text-green-600",
                sub: "Total complaints",
              },
              {
                label: "Pending",
                value: stats.open,
                icon: AlertCircle,
                color: "bg-orange-50",
                iconColor: "text-orange-600",
                sub: "Total complaints",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
              >
                <div
                  className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}
                >
                  <stat.icon size={20} className={stat.iconColor} />
                </div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-gray-700 text-sm font-medium mt-1">
                  {stat.label}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Tickets Table + Pie Chart */}
          <div className="grid grid-cols-3 gap-4">
            {/* Assigned Tickets Table */}
            <div className="col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-800">
                    My Assigned Complaints
                  </h3>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {tickets.length} complaints assigned
                  </p>
                </div>
                <button
                  onClick={() => navigate("/agent")}
                  className="text-green-600 text-xs font-medium hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-5 gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="col-span-1">ID</div>
                <div className="col-span-2">Title</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1">Priority</div>
              </div>

              {loading && (
                <div className="text-center py-10">
                  <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-gray-500 text-sm">Loading...</p>
                </div>
              )}

              {!loading && tickets.length === 0 && (
                <div className="text-center py-10">
                  <Ticket size={36} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    No tickets assigned yet!
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Admin will assign tickets soon.
                  </p>
                </div>
              )}

              {!loading &&
                tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="grid grid-cols-5 gap-3 px-5 py-3.5 border-b border-gray-50 hover:bg-gray-50 transition-all items-center cursor-pointer group"
                  >
                    <div className="col-span-1 text-xs text-gray-400 font-mono">
                      #{ticket.id}
                    </div>
                    <div
                      className="col-span-2"
                      onClick={() => navigate(`/tickets/${ticket.id}`)}
                    >
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-green-600 transition-colors truncate">
                        {ticket.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {ticket.creator?.name} ·{" "}
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="col-span-1">
                      <select
                        value={ticket.status}
                        onChange={(e) =>
                          handleStatusChange(ticket.id, e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                        className={`text-xs px-2 py-1 rounded-lg font-medium border-0 outline-none cursor-pointer ${getStatusBadge(ticket.status)}`}
                      >
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    <div className="col-span-1">
                      <span
                        className={`text-xs px-2 py-1 rounded-lg font-medium ${getPriorityBadge(ticket.priority)}`}
                      >
                        {ticket.priority}
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            {/* Right Side — Pie Chart + Activity */}
            <div className="flex flex-col gap-4">
              {/* Pie Chart */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 text-sm mb-4">
                  Status Distribution
                </h3>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend iconType="circle" iconSize={8} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm">No data yet!</p>
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 text-sm">
                    Recent Activity
                  </h3>
                  <button className="text-green-600 text-xs font-medium hover:underline cursor-pointer">
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {tickets.slice(0, 4).map((ticket) => (
                    <div key={ticket.id} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <TrendingUp size={13} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-700 font-medium">
                          Ticket #{ticket.id} — {ticket.status}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(ticket.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {tickets.length === 0 && (
                    <p className="text-gray-400 text-xs text-center py-4">
                      No recent activity
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentPanel;
