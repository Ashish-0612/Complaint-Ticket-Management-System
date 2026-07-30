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
  Settings,
  LogOut,
  TrendingUp,
  Bell,
  Search,
  Filter,
  Clock,
} from "lucide-react";

const AgentPerformance = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const res = await API.get("/users/agents/performance");
        setPerformance(res.data.data);
      } catch (err) {
        console.error("Failed to load agent performance", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filteredAgents = performance.filter((agent) => {
    const term = searchQuery.toLowerCase();
    return (
      agent.name.toLowerCase().includes(term) ||
      agent.email.toLowerCase().includes(term)
    );
  });

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: UserCog, label: "Agent Performance", path: "/admin/agents/performance", active: true },
    { icon: Tag, label: "Categories", path: "/admin/categories" },
    { icon: Tag, label: "Departments", path: "/admin/departments" },
    { icon: Ticket, label: "Complaints", path: "/admin" },
    { icon: BarChart3, label: "Reports", path: "/admin" },
    { icon: Settings, label: "Settings", path: "/admin" },
    { icon: UserCog, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="w-56 bg-gray-900 flex flex-col flex-shrink-0">
        <div className="px-5 py-5 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Ticket size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">Complaint</p>
              <p className="text-gray-400 text-xs mt-0.5">Management System</p>
            </div>
          </div>
        </div>

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

        <div className="px-3 py-4 border-t border-gray-800">
          <div className="flex items-center gap-2.5 px-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-xs font-medium truncate">{user?.name}</p>
              <p className="text-gray-500 text-xs">Admin</p>
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

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Agent Performance</h1>
            <p className="text-gray-500 text-sm">Track ticket metrics for all active agents.</p>
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
            </button>
            <div className="flex items-center gap-2 border border-gray-200 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700">{user?.name}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Agent Performance Summary</h2>
                  <p className="text-sm text-gray-500 mt-1">Overview of agents, assigned tickets, and resolution percentage.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search agents..."
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {[
                { label: "Total Agents", value: performance.length, color: "bg-blue-50", icon: Users },
                { label: "Average Resolution", value: performance.length ? `${Math.round(performance.reduce((acc, agent) => acc + agent.resolutionRate, 0) / performance.length)}%` : "0%", color: "bg-green-50", icon: TrendingUp },
                { label: "Total Assigned", value: performance.reduce((acc, agent) => acc + agent.totalAssigned, 0), color: "bg-purple-50", icon: Ticket },
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-2xl ${stat.color}`}>
                      <stat.icon size={18} className="text-blue-600" />
                    </span>
                    <span className="text-xs font-semibold text-gray-500">{stat.label}</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-gray-800">Agent Breakdown</h3>
                <p className="text-sm text-gray-500">Each agent's ticket status and resolution rate.</p>
              </div>
              <div className="text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Filter size={14} />
                Live update
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading agent performance...</div>
            ) : filteredAgents.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No agents found.</div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {filteredAgents.map((agent) => (
                  <div key={agent.id} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div>
                        <p className="text-lg font-semibold text-gray-800">{agent.name}</p>
                        <p className="text-sm text-gray-500">{agent.email}</p>
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">{agent.resolutionRate}%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white rounded-2xl p-4 border border-gray-100">
                        <p className="text-xs text-gray-500 uppercase tracking-[.2em]">Assigned</p>
                        <p className="text-2xl font-bold text-gray-800">{agent.totalAssigned}</p>
                      </div>
                      <div className="bg-white rounded-2xl p-4 border border-gray-100">
                        <p className="text-xs text-gray-500 uppercase tracking-[.2em]">Resolved</p>
                        <p className="text-2xl font-bold text-gray-800">{agent.resolved}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-2xl p-4 border border-gray-100">
                        <p className="text-xs text-gray-500 uppercase tracking-[.2em]">In Progress</p>
                        <p className="text-lg font-bold text-gray-800">{agent.inProgress}</p>
                      </div>
                      <div className="bg-white rounded-2xl p-4 border border-gray-100">
                        <p className="text-xs text-gray-500 uppercase tracking-[.2em]">Pending</p>
                        <p className="text-lg font-bold text-gray-800">{agent.pending}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-xs text-gray-500 mb-2">Resolution progress</div>
                      <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-500"
                          style={{ width: `${agent.resolutionRate}%` }}
                        />
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

export default AgentPerformance;
