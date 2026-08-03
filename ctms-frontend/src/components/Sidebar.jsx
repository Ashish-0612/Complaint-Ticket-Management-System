import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Route change hone par mobile drawer band ho jaye
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Role ke hisaab se menu items
  const getMenuItems = () => {
    if (user?.role === "admin") {
      return [
        { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
        { icon: Ticket, label: "All Tickets", path: "/admin" },
        { icon: Users, label: "Agents", path: "/admin" },
      ];
    }
    if (user?.role === "agent") {
      return [
        { icon: LayoutDashboard, label: "My Panel", path: "/agent" },
        { icon: Ticket, label: "Assigned Tickets", path: "/agent" },
      ];
    }
    return [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
      { icon: PlusCircle, label: "New Ticket", path: "/create-ticket" },
      { icon: Ticket, label: "My Tickets", path: "/dashboard" },
    ];
  };

  const menuItems = getMenuItems();

  const SidebarContent = (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white">
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-gray-700 p-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-400">CTMS</h1>
          <p className="mt-1 text-xs text-gray-400">Ticket Management</p>
        </div>
        {/* Close button - sirf mobile drawer me dikhega */}
        <button
          onClick={() => setIsOpen(false)}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white md:hidden"
          aria-label="Close menu"
        >
          <X size={22} />
        </button>
      </div>

      {/* User Info */}
      <div className="border-b border-gray-700 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 font-bold text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {user?.name}
            </p>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                user?.role === "admin"
                  ? "bg-red-500"
                  : user?.role === "agent"
                    ? "bg-green-500"
                    : "bg-blue-500"
              } text-white`}
            >
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={index}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-all min-h-[44px] ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <Icon size={20} className="shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-700 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full min-h-[44px] items-center gap-3 rounded-lg px-4 py-3 text-gray-400 transition-all hover:bg-red-600 hover:text-white"
        >
          <LogOut size={20} className="shrink-0" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar with hamburger - sirf mobile/tablet pe dikhega */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between bg-gray-900 px-4 text-white md:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-gray-800"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-lg font-bold text-blue-400">CTMS</h1>
        <div className="w-11" /> {/* spacing balance ke liye */}
      </div>

      {/* Desktop sidebar - hamesha visible, fixed, same as pehle */}
      <div className="fixed left-0 top-0 z-30 hidden h-screen md:block">
        {SidebarContent}
      </div>

      {/* Mobile drawer overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile drawer panel */}
      <div
        className={`fixed left-0 top-0 z-50 h-screen transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {SidebarContent}
      </div>
    </>
  );
};

export default Sidebar;
