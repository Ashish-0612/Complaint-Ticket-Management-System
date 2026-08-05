import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import {
  Ticket,
  LogOut,
  LayoutDashboard,
  Users,
  UserCog,
  Tag,
  BarChart3,
  Settings,
  Search,
  CheckCircle,
  XCircle,
  Menu,
  X,
} from "lucide-react";
import NotificationBell from "../../components/NotificationBell";



const UserManagement = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/users");
        setUsers(res.data.data);
      } catch {
        console.log("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
    API.get("/tickets", { params: { limit: 1000 } })
      .then((res) => setTickets(res.data.data || []))
      .catch(() => setTickets([]));
  }, []);



  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleRoleChange = (userId, newRole, userName) => {
    if (userId === user?.id) {
      alert("You cannot change your own role.");
      return;
    }

    setConfirmation({
      isOpen: true,
      title: "Confirm Role Change",
      message: `Are you sure you want to change the role for ${userName} to "${newRole}"?`,
      onConfirm: () => {
        executeRoleChange(userId, newRole);
        setConfirmation({ ...confirmation, isOpen: false });
      },
      onCancel: () => {
        // Just close the modal, no state change needed
        setConfirmation({ ...confirmation, isOpen: false });
      },
    });
  };

  const executeRoleChange = async (userId, newRole) => {
    try {
      await API.put(`/users/${userId}/role`, { role: newRole });
      setUsers((currentUsers) =>
        currentUsers.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      // Optionally, show a success toast/alert here
    } catch (err) {
      alert(err.response?.data?.message || "Failed to change role!");
      // Revert the visual change on failure
      setUsers([...users]);
    }
  };


  const handleStatusToggle = async (userId) => {
    try {
      await API.put(`/users/${userId}/status`);
      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, isActive: !u.isActive } : u,
        ),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to change status!");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = filterRole === "all" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700";
      case "agent":
        return "bg-green-100 text-green-700";
      case "user":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Users, label: "Users", path: "/admin/users", active: true },
    {
      icon: UserCog,
      label: "Agent Performance",
      path: "/admin/agents/performance",
    },
    { icon: Tag, label: "Categories", path: "/admin" },
    { icon: Ticket, label: "Complaints", path: "/admin" },
    { icon: BarChart3, label: "Reports", path: "/admin" },
    { icon: Settings, label: "Settings", path: "/admin" },
    { icon: UserCog, label: "Profile", path: "/profile" },
  ];

  const SidebarInner = (
    <>
      <div className="px-5 py-5 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
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
            <p className="text-white text-xs font-medium truncate">
              {user?.name}
            </p>
            <p className="text-gray-500 text-xs">Admin</p>
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
      {confirmation.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center border border-gray-200">
            <div className="w-14 h-14 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {confirmation.title}
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              {confirmation.message}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={confirmation.onCancel}
                className="w-full py-2.5 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmation.onConfirm}
                className="w-full py-2.5 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-gray-900 flex items-center justify-between px-4">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-white hover:bg-gray-800"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <p className="text-white font-bold text-sm">User Management</p>
        <div className="w-11" />
      </div>

      <aside className="hidden md:flex w-56 bg-gray-900 flex-col flex-shrink-0">
        {SidebarInner}
      </aside>

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

      <div className="flex-1 flex flex-col overflow-hidden pt-14 md:pt-0">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
              User Management
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm truncate">
              Manage all users and their roles
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <NotificationBell tickets={tickets} />
            <div className="flex items-center gap-2 border border-gray-200 px-2 sm:px-3 py-1.5 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline text-sm font-medium text-gray-700">
                {user?.name}
              </span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              {
                label: "Total Users",
                value: users.length,
                color: "bg-blue-50",
                textColor: "text-blue-600",
              },
              {
                label: "Active Users",
                value: users.filter((u) => u.isActive).length,
                color: "bg-green-50",
                textColor: "text-green-600",
              },
              {
                label: "Agents",
                value: users.filter((u) => u.role === "agent").length,
                color: "bg-purple-50",
                textColor: "text-purple-600",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm"
              >
                <p className={`text-2xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
                <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="font-bold text-gray-800">All Users</h3>
                <p className="text-gray-500 text-xs mt-0.5">
                  {filteredUsers.length} users found
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="relative flex-1 sm:flex-none min-w-[140px]">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-4 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-400 w-full sm:w-48"
                  />
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-400 bg-white cursor-pointer flex-1 sm:flex-none"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="agent">Agent</option>
                  <option value="user">User</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                <div className="grid grid-cols-6 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="col-span-1">ID</div>
                  <div className="col-span-2">User</div>
                  <div className="col-span-1">Role</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-1">Actions</div>
                </div>

                {loading && (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-gray-500 text-sm">Loading...</p>
                  </div>
                )}

                {!loading && filteredUsers.length === 0 && (
                  <div className="text-center py-12">
                    <Users size={40} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No users found</p>
                  </div>
                )}

                {!loading &&
                  filteredUsers.map((u) => (
                    <div
                      key={u.id}
                      className="grid grid-cols-6 gap-4 px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-all items-center"
                    >
                      <div className="col-span-1 text-xs text-gray-400 font-mono">
                        #{u.id}
                      </div>

                      <div className="col-span-2 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {u.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {u.email}
                          </p>
                        </div>
                      </div>

                      <div className="col-span-1">
                        <span
                          className={`text-xs px-2 py-1 rounded-lg font-medium ${getRoleBadge(u.role)}`}
                        >
                          {u.role}
                        </span>
                      </div>

                      <div className="col-span-1">
                        {u.isActive ? (
                          <span className="flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle size={13} />
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-red-500">
                            <XCircle size={13} />
                            Inactive
                          </span>
                        )}
                      </div>

                      <div className="col-span-1 flex flex-wrap gap-2">
                        {u.id !== user?.id && (
                          <select
                            value={u.role}
                            onChange={(e) =>
                              handleRoleChange(u.id, e.target.value, u.name)
                            }
                            className="text-xs border border-gray-200 px-2 py-1 rounded-lg outline-none focus:border-blue-400 bg-white cursor-pointer"
                          >
                            <option value="user">User</option>
                            <option value="agent">Agent</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}

                        {u.id !== user?.id && (
                          <button
                            onClick={() => handleStatusToggle(u.id)}
                            className={`text-xs px-2 py-1 rounded-lg font-medium cursor-pointer transition-all ${
                              u.isActive
                                ? "bg-red-50 text-red-600 hover:bg-red-100"
                                : "bg-green-50 text-green-600 hover:bg-green-100"
                            }`}
                          >
                            {u.isActive ? "Deactivate" : "Activate"}
                          </button>
                        )}

                        {u.id === user?.id && (
                          <span className="text-xs text-gray-400">You</span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
