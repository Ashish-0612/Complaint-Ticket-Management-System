import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import Pagination from "../../components/Pagination";
import NotificationBell from "../../components/NotificationBell";
import {
  LayoutDashboard,
  Ticket,
  CheckCircle,
  Clock,
  AlertCircle,
  LogOut,
  TrendingUp,
  UserCog,
  Activity,
  Search,
  Filter,
  Menu,
  X,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const AgentPanel = ({ view = "dashboard" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await API.get("/tickets", { params: { limit: 1000 } });
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

  const handlePriorityChange = async (ticketId, newPriority) => {
    try {
      await API.put(`/tickets/${ticketId}`, { priority: newPriority });
      setTickets((currentTickets) =>
        currentTickets.map((ticket) =>
          ticket.id === ticketId
            ? { ...ticket, priority: newPriority }
            : ticket,
        ),
      );
    } catch {
      alert("Failed to update priority!");
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const searchValue = searchQuery.toLowerCase().trim();
    const matchesSearch =
      ticket.title?.toLowerCase().includes(searchValue) ||
      ticket.description?.toLowerCase().includes(searchValue) ||
      ticket.creator?.name?.toLowerCase().includes(searchValue);
    const matchesStatus =
      filterStatus === "all" || ticket.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || ticket.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });
  const ticketsPerPage = 5;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredTickets.length / ticketsPerPage),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedTickets = filteredTickets.slice(
    (safeCurrentPage - 1) * ticketsPerPage,
    safeCurrentPage * ticketsPerPage,
  );

  const hasActiveFilters =
    searchQuery.trim() || filterStatus !== "all" || filterPriority !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setFilterStatus("all");
    setFilterPriority("all");
    setCurrentPage(1);
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
      case "reopened":
        return "bg-orange-100 text-orange-700";
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

  const pieData = [
    { name: "In Progress", value: stats.inProgress, color: "#f59e0b" },
    { name: "Pending", value: stats.open, color: "#f97316" },
    { name: "Resolved", value: stats.resolved, color: "#22c55e" },
  ].filter((d) => d.value > 0);

  const pageTitle =
    view === "assigned"
      ? "Assigned Complaints"
      : view === "all"
        ? "All Complaints"
        : "Agent Dashboard";
  const pageSubtitle =
    view === "assigned"
      ? "Tickets currently assigned to you"
      : view === "all"
        ? "Review your complete complaint queue"
        : `Welcome back, ${user?.name}!`;

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true, path: "/agent" },
    { icon: Ticket, label: "Assigned Complaints", path: "/agent/assigned" },
    { icon: CheckCircle, label: "All Complaints", path: "/agent/all" },
    { icon: Activity, label: "My Activity", path: "/agent/activity" },
    { icon: UserCog, label: "Profile", path: "/profile" },
  ];

  const SidebarInner = (
    <>
      <div className="px-5 py-5 border-b border-gray-800 flex items-center justify-between">
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
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider px-2 mb-3">
          Main Menu
        </p>
        <ul className="space-y-0.5">
          {navItems.map((item, i) => (
            <li key={i}>
              <button
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer min-h-[44px] ${
                  item.path === location.pathname ||
                  (item.path === "/agent" && location.pathname === "/agent")
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
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-400 hover:bg-red-600 hover:text-white text-sm transition-all cursor-pointer min-h-[44px]"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-gray-900 flex items-center justify-between px-4">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-white hover:bg-gray-800"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <p className="text-white font-bold text-sm">Agent Panel</p>
        <div className="w-11" />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 bg-gray-900 flex-col flex-shrink-0">
        {SidebarInner}
      </aside>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <aside
        className={`md:hidden fixed top-0 left-0 z-50 h-screen w-64 bg-gray-900 flex flex-col transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {SidebarInner}
      </aside>

      {/* ========== MAIN ========== */}
      <div className="flex-1 flex flex-col overflow-hidden pt-14 md:pt-0">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
              {pageTitle}
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm truncate">
              {pageSubtitle}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <NotificationBell tickets={tickets} />
            <div className="flex items-center gap-2 border border-gray-200 px-2 sm:px-3 py-1.5 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline text-sm font-medium text-gray-700">
                {user?.name}
              </span>
              <span className="hidden sm:inline text-xs text-gray-400">▾</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
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
                className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm"
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}
                >
                  <stat.icon size={18} className={stat.iconColor} />
                </div>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">
                  {stat.value}
                </p>
                <p className="text-gray-700 text-sm font-medium mt-1">
                  {stat.label}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Tickets Table + Pie Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Assigned Tickets Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="font-bold text-gray-800">
                    {view === "all"
                      ? "All Complaints"
                      : "My Assigned Complaints"}
                  </h3>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {filteredTickets.length} of {tickets.length} complaints in
                    queue
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative flex-1 sm:flex-none min-w-[110px]">
                    <Search
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="filter-control pl-8 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-green-400 w-full sm:w-32"
                    />
                  </div>
                  <div className="relative flex-1 sm:flex-none min-w-[110px]">
                    <Filter
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <select
                      value={filterStatus}
                      onChange={(e) => {
                        setFilterStatus(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="filter-control pl-8 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-green-400 bg-white cursor-pointer w-full"
                    >
                      <option value="all">All Status</option>
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                      <option value="reopened">Reopened</option>
                    </select>
                  </div>
                  <select
                    value={filterPriority}
                    onChange={(e) => {
                      setFilterPriority(e.target.value);
                      setCurrentPage(1);
                    }}
                    aria-label="Filter assigned complaints by priority"
                    className="filter-control px-3 py-1.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-green-400 bg-white cursor-pointer flex-1 sm:flex-none min-w-[100px]"
                  >
                    <option value="all">All Priority</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="filter-action px-3 py-1.5 text-xs font-medium text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-700 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-[560px]">
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

                  {!loading && filteredTickets.length === 0 && (
                    <div className="text-center py-10">
                      <Ticket
                        size={36}
                        className="text-gray-200 mx-auto mb-3"
                      />
                      <p className="text-gray-500 text-sm">
                        {tickets.length === 0
                          ? "No tickets assigned yet!"
                          : "No tickets match these filters."}
                      </p>
                      {tickets.length === 0 && (
                        <p className="text-gray-400 text-xs mt-1">
                          Admin will assign tickets soon.
                        </p>
                      )}
                    </div>
                  )}

                  {!loading &&
                    paginatedTickets.map((ticket) => (
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
                          <select
                            value={ticket.priority}
                            onChange={(e) =>
                              handlePriorityChange(ticket.id, e.target.value)
                            }
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Change priority for complaint ${ticket.id}`}
                            className={`text-xs px-2 py-1 rounded-lg font-medium border-0 outline-none cursor-pointer ${getPriorityBadge(ticket.priority)}`}
                          >
                            <option value="critical">Critical</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                          </select>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <Pagination
                currentPage={safeCurrentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>

            {/* Right Side — Pie Chart + Activity */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm">
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

              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm flex-1">
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
