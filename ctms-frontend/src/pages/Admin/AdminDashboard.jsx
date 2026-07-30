import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Tag,
  Ticket,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  });
  const [chartData, setChartData] = useState([]);

  // Dummy chart data — real data baad mein add karenge
  // const chartData = [
  //   { day: "Mon", Total: 4, Resolved: 2, Pending: 2 },
  //   { day: "Tue", Total: 6, Resolved: 3, Pending: 3 },
  //   { day: "Wed", Total: 5, Resolved: 4, Pending: 1 },
  //   { day: "Thu", Total: 8, Resolved: 5, Pending: 3 },
  //   { day: "Fri", Total: 7, Resolved: 4, Pending: 3 },
  //   { day: "Sat", Total: 3, Resolved: 2, Pending: 1 },
  //   { day: "Sun", Total: 5, Resolved: 3, Pending: 2 },
  // ];

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
        // Real chart data — last 7 days
        const last7Days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const today = new Date().getDay();

        // Last 7 days order banao
        const orderedDays = [];
        for (let i = 6; i >= 0; i--) {
          orderedDays.push(last7Days[(today - i + 7) % 7]);
        }

        // Tickets ko day wise group karo
        const chartResult = orderedDays.map((day) => {
          const dayTickets = allTickets.filter((t) => {
            const ticketDay = new Date(t.createdAt).toLocaleDateString(
              "en-US",
              { weekday: "short" },
            );
            return ticketDay === day;
          });

          return {
            day,
            Total: dayTickets.length,
            Resolved: dayTickets.filter((t) => t.status === "resolved").length,
            Pending: dayTickets.filter((t) => t.status === "open").length,
          };
        });

        setChartData(chartResult);
      } catch {
        console.log("Failed to load data");
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
        closed: updated.filter((t) => t.status === "closed").length,
      });
    } catch {
      alert("Failed to update!");
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
      alert("Failed to assign!");
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchSearch =
      t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.creator?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      open: "bg-blue-100 text-blue-700",
      "in-progress": "bg-yellow-100 text-yellow-700",
      resolved: "bg-green-100 text-green-700",
      closed: "bg-gray-100 text-gray-600",
    };
    return styles[status] || "bg-gray-100 text-gray-600";
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      critical: "bg-red-100 text-red-700",
      high: "bg-orange-100 text-orange-700",
      medium: "bg-yellow-100 text-yellow-700",
      low: "bg-green-100 text-green-700",
    };
    return styles[priority] || "bg-gray-100 text-gray-600";
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true, path: "/admin" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: UserCog, label: "Agent Performance", path: "/admin/agents/performance" },
    { icon: Tag, label: "Categories", path: "/admin/categories" },
    { icon: Tag, label: "Departments", path: "/admin/departments" },
    { icon: BarChart3, label: "Reports", path: "/admin" },
    { icon: Settings, label: "Settings", path: "/admin" },
    { icon: UserCog, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ========== SIDEBAR ========== */}
      <aside className="w-56 bg-gray-900 flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
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
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    item.active
                      ? "bg-blue-600 text-white"
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-xs font-medium truncate">
                {user?.name}
              </p>
              <p className="text-gray-500 text-xs truncate">Admin</p>
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
            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm">
              Welcome back, {user?.name}! 👋
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <Clock size={13} />
              {new Date().toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <Bell size={18} />
              {stats.open > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            <div className="flex items-center gap-2 border border-gray-200 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {user?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            {[
              {
                label: "Total Complaints",
                value: stats.total,
                icon: Ticket,
                color: "bg-blue-50",
                iconColor: "text-blue-600",
                trend: "+12%",
                up: true,
              },
              {
                label: "Resolved",
                value: stats.resolved,
                icon: CheckCircle,
                color: "bg-green-50",
                iconColor: "text-green-600",
                trend: "+18%",
                up: true,
              },
              {
                label: "Pending",
                value: stats.open,
                icon: AlertCircle,
                color: "bg-orange-50",
                iconColor: "text-orange-600",
                trend: "-7%",
                up: false,
              },
              {
                label: "In Progress",
                value: stats.inProgress,
                icon: Clock,
                color: "bg-purple-50",
                iconColor: "text-purple-600",
                trend: "+5%",
                up: true,
              },
              {
                label: "Total Agents",
                value: agents.length,
                icon: Users,
                color: "bg-pink-50",
                iconColor: "text-pink-600",
                trend: "+10%",
                up: true,
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}
                  >
                    <stat.icon size={20} className={stat.iconColor} />
                  </div>
                  <span
                    className={`text-xs font-semibold flex items-center gap-0.5 ${stat.up ? "text-green-600" : "text-red-500"}`}
                  >
                    {stat.up ? (
                      <TrendingUp size={12} />
                    ) : (
                      <TrendingDown size={12} />
                    )}
                    {stat.trend}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
                <p className="text-gray-400 text-xs mt-0.5">from last week</p>
              </div>
            ))}
          </div>

          {/* Chart + Recent Tickets */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Line Chart */}
            <div className="col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-gray-800">Complaints Overview</h3>
                <div className="text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg">
                  This Week ▾
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Total"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Resolved"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Pending"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Complaints */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 text-sm">
                  Recent Complaints
                </h3>
                <button className="text-blue-600 text-xs font-medium hover:underline">
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {tickets.slice(0, 5).map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">
                        #{ticket.id} {ticket.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {ticket.creator?.name}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ml-2 flex-shrink-0 ${getStatusBadge(ticket.status)}`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* All Tickets Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-800">All Complaints</h3>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {filteredTickets.length} complaints found
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-4 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-400 w-48"
                    />
                  </div>
                  <div className="relative">
                    <Filter
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="pl-8 pr-4 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-400 bg-white cursor-pointer appearance-none"
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

            {/* Table Header */}
            <div className="grid grid-cols-7 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="col-span-1">ID</div>
              <div className="col-span-2">Title</div>
              <div className="col-span-1">User</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Priority</div>
              <div className="col-span-1">Actions</div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-500 text-sm">Loading...</p>
              </div>
            )}

            {/* Empty */}
            {!loading && filteredTickets.length === 0 && (
              <div className="text-center py-12">
                <Ticket size={40} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No complaints found</p>
              </div>
            )}

            {/* Rows */}
            {!loading &&
              filteredTickets.map((ticket) => (
                <div
                  key={`${ticket.id}-${ticket.agentId}`}
                  className="grid grid-cols-7 gap-4 px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-all items-center"
                >
                  <div className="col-span-1 text-xs text-gray-400 font-mono">
                    #{ticket.id}
                  </div>
                  <div
                    className="col-span-2 cursor-pointer"
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                  >
                    <p className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors truncate">
                      {ticket.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {ticket.department?.name}
                    </p>
                  </div>
                  <div className="col-span-1">
                    <p className="text-xs text-gray-700 font-medium truncate">
                      {ticket.creator?.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="col-span-1">
                    <select
                      value={ticket.status}
                      onChange={(e) =>
                        handleStatusChange(ticket.id, e.target.value)
                      }
                      className={`text-xs px-2 py-1 rounded-lg font-medium border-0 outline-none cursor-pointer ${getStatusBadge(ticket.status)}`}
                      onClick={(e) => e.stopPropagation()}
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
                  <div className="col-span-1">
                    <select
                      value={ticket.agentId || ""}
                      onChange={(e) =>
                        handleAgentAssign(ticket.id, e.target.value)
                      }
                      className="text-xs border border-gray-200 px-2 py-1 rounded-lg outline-none focus:border-blue-400 bg-white cursor-pointer w-full"
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
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
