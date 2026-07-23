import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  Bell,
  CheckCircle,
  Clock,
  AlertCircle,
  LogOut,
  Search,
  FileText,
  Activity,
} from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredTickets = tickets.filter((t) =>
    t.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: Ticket, label: "My Complaints" },
    { icon: PlusCircle, label: "New Complaint" },
    { icon: Activity, label: "Announcements" },
    { icon: FileText, label: "Profile" },
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
                  onClick={() => {
                    if (item.label === "New Complaint")
                      navigate("/create-ticket");
                    else if (item.label === "My Complaints")
                      navigate("/dashboard");
                    else if (item.label === "Dashboard") navigate("/dashboard");
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    item.active
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <item.icon size={17} />
                  {item.label}
                  {item.label === "My Complaints" && stats.total > 0 && (
                    <span className="ml-auto bg-gray-700 text-gray-300 text-xs px-1.5 py-0.5 rounded-full">
                      {stats.total}
                    </span>
                  )}
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
              <p className="text-gray-500 text-xs">User</p>
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
            <h1 className="text-xl font-bold text-gray-800">User Dashboard</h1>
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
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "My Complaints",
                value: stats.total,
                icon: Ticket,
                color: "bg-blue-50",
                iconColor: "text-blue-600",
                sub: "Total",
              },
              {
                label: "Pending",
                value: stats.open,
                icon: AlertCircle,
                color: "bg-orange-50",
                iconColor: "text-orange-600",
                sub: "Complaints",
              },
              {
                label: "In Progress",
                value: stats.inProgress,
                icon: Clock,
                color: "bg-yellow-50",
                iconColor: "text-yellow-600",
                sub: "Complaints",
              },
              {
                label: "Resolved",
                value: stats.resolved,
                icon: CheckCircle,
                color: "bg-green-50",
                iconColor: "text-green-600",
                sub: "Complaints",
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

          {/* My Complaints + Quick Actions */}
          <div className="grid grid-cols-3 gap-4">
            {/* My Complaints Table */}
            <div className="col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-800">My Complaints</h3>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {filteredTickets.length} complaints found
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-400 w-36"
                    />
                  </div>
                  <button
                    onClick={() => navigate("/create-ticket")}
                    className="text-blue-600 text-xs font-medium hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-5 gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="col-span-1">ID</div>
                <div className="col-span-2">Title</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1">Date</div>
              </div>

              {loading && (
                <div className="text-center py-10">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-gray-500 text-sm">Loading...</p>
                </div>
              )}

              {!loading && filteredTickets.length === 0 && (
                <div className="text-center py-10">
                  <Ticket size={36} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm font-medium">
                    No complaints yet!
                  </p>
                  <p className="text-gray-400 text-xs mt-1 mb-4">
                    Create your first complaint
                  </p>
                  <button
                    onClick={() => navigate("/create-ticket")}
                    className="bg-blue-600 text-white text-xs px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    + New Complaint
                  </button>
                </div>
              )}

              {!loading &&
                filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                    className="grid grid-cols-5 gap-3 px-5 py-3.5 border-b border-gray-50 hover:bg-gray-50 transition-all items-center cursor-pointer group"
                  >
                    <div className="col-span-1 text-xs text-gray-400 font-mono">
                      #{ticket.id}
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                        {ticket.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {ticket.department?.name}
                      </p>
                    </div>
                    <div className="col-span-1">
                      <span
                        className={`text-xs px-2 py-1 rounded-lg font-medium ${getStatusBadge(ticket.status)}`}
                      >
                        {ticket.status}
                      </span>
                    </div>
                    <div className="col-span-1 text-xs text-gray-400">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
            </div>

            {/* Right Side */}
            <div className="flex flex-col gap-4">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 text-sm mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/create-ticket")}
                    className="w-full flex items-center gap-3 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <PlusCircle size={16} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold">
                      + New Complaint
                    </span>
                  </button>

                  <button
                    onClick={() => navigate("/dashboard")}
                    className="w-full flex items-center gap-3 p-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl transition-all cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FileText size={16} className="text-gray-600" />
                    </div>
                    <span className="text-sm font-semibold">
                      Track Complaint
                    </span>
                  </button>
                </div>
              </div>

              {/* Announcements */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 text-sm">
                    Announcements
                  </h3>
                  <button className="text-blue-600 text-xs font-medium hover:underline cursor-pointer">
                    View All
                  </button>
                </div>

                {/* Announcement items */}
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-blue-800 text-xs font-semibold">
                      System Update
                    </p>
                    <p className="text-blue-600 text-xs mt-1">
                      System will be under maintenance on weekends from 12:00 AM
                      to 4:00 AM.
                    </p>
                    <p className="text-blue-400 text-xs mt-2">Today</p>
                  </div>

                  <div className="p-3 bg-green-50 rounded-xl border border-green-100">
                    <p className="text-green-800 text-xs font-semibold">
                      New Feature
                    </p>
                    <p className="text-green-600 text-xs mt-1">
                      You can now attach files to your complaints for faster
                      resolution.
                    </p>
                    <p className="text-green-400 text-xs mt-2">Yesterday</p>
                  </div>

                  <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <p className="text-orange-800 text-xs font-semibold">
                      Reminder
                    </p>
                    <p className="text-orange-600 text-xs mt-1">
                      Please provide feedback after your complaint is resolved.
                    </p>
                    <p className="text-orange-400 text-xs mt-2">2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
