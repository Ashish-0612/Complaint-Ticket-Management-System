import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import {
  Ticket,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  FileText,
  Bell,
  User,
  Mail,
  Lock,
  CheckCircle,
  AlertCircle,
  Settings,
  BarChart3,
  UserCog,
  Edit3,
  Key,
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, login } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  const [nameForm, setNameForm] = useState({ name: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [nameLoading, setNameLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [nameSuccess, setNameSuccess] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/profile");
        setProfile(res.data.data);
        setNameForm({ name: res.data.data.name });
      } catch {
        console.log("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleNameUpdate = async (e) => {
    e.preventDefault();
    setNameLoading(true);
    setNameError("");
    setNameSuccess("");
    try {
      const res = await API.put("/auth/profile", nameForm);
      setProfile({ ...profile, name: res.data.data.name });
      // Update context
      login(res.data.data, localStorage.getItem("token"));
      setNameSuccess("Profile updated successfully!");
      setTimeout(() => setNameSuccess(""), 3000);
    } catch (err) {
      setNameError(err.response?.data?.message || "Failed to update!");
    } finally {
      setNameLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return setPasswordError("New passwords do not match!");
    }
    if (passwordForm.newPassword.length < 6) {
      return setPasswordError("Password must be at least 6 characters!");
    }

    setPasswordLoading(true);
    try {
      await API.put("/auth/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordSuccess("Password changed successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setPasswordSuccess(""), 3000);
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Failed to change password!",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getSidebarColor = () => {
    if (user?.role === "agent") return "bg-green-600";
    if (user?.role === "admin") return "bg-blue-600";
    return "bg-blue-600";
  };

  const getNavItems = () => {
    if (user?.role === "admin")
      return [
        { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
        { icon: Ticket, label: "Complaints", path: "/admin" },
        { icon: BarChart3, label: "Reports", path: "/admin" },
        { icon: UserCog, label: "Profile", path: "/profile", active: true },
        { icon: Settings, label: "Settings", path: "/settings" },
      ];
    if (user?.role === "agent")
      return [
        { icon: LayoutDashboard, label: "Dashboard", path: "/agent" },
        { icon: Ticket, label: "Assigned", path: "/agent" },
        { icon: UserCog, label: "Profile", path: "/profile", active: true },
      ];
    return [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
      { icon: Ticket, label: "My Complaints", path: "/dashboard" },
      { icon: PlusCircle, label: "New Complaint", path: "/create-ticket" },
      { icon: UserCog, label: "Profile", path: "/profile", active: true },
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ========== SIDEBAR ========== */}
      <aside className="w-56 bg-gray-900 flex flex-col flex-shrink-0">
        <div className="px-5 py-5 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 ${getSidebarColor()} rounded-lg flex items-center justify-center flex-shrink-0`}
            >
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

        <nav className="flex-1 px-3 py-4">
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider px-2 mb-3">
            Main Menu
          </p>
          <ul className="space-y-0.5">
            {getNavItems().map((item, i) => (
              <li key={i}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    item.active
                      ? `${getSidebarColor()} text-white`
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
            <div
              className={`w-8 h-8 rounded-full ${getSidebarColor()} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-xs font-medium truncate">
                {user?.name}
              </p>
              <p className="text-gray-500 text-xs capitalize">{user?.role}</p>
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
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-gray-800">My Profile</h1>
            <p className="text-gray-500 text-sm">
              Manage your account settings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer">
              <Bell size={18} />
            </button>
            <div className="flex items-center gap-2 border border-gray-200 px-3 py-1.5 rounded-lg">
              <div
                className={`w-6 h-6 rounded-full ${getSidebarColor()} flex items-center justify-center text-white text-xs font-bold`}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {user?.name}
              </span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            {/* Profile Header Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-5">
              <div className="flex items-center gap-5">
                <div
                  className={`w-20 h-20 rounded-2xl ${getSidebarColor()} flex items-center justify-center text-white text-3xl font-bold flex-shrink-0`}
                >
                  {profile?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {profile?.name}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">{profile?.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        profile?.role === "admin"
                          ? "bg-red-100 text-red-700"
                          : profile?.role === "agent"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {profile?.role}
                    </span>
                    <span className="text-xs text-gray-400">
                      Member since{" "}
                      {new Date(profile?.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-5">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Edit3 size={15} />
                Edit Profile
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "password"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Key size={15} />
                Change Password
              </button>
            </div>

            {/* Edit Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
                  <Edit3 size={18} className="text-blue-600" />
                  Edit Profile
                </h3>

                {nameSuccess && (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl mb-4 text-sm">
                    <CheckCircle size={15} />
                    {nameSuccess}
                  </div>
                )}

                {nameError && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
                    <AlertCircle size={15} />
                    {nameError}
                  </div>
                )}

                <form onSubmit={handleNameUpdate} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        value={nameForm.name}
                        onChange={(e) => setNameForm({ name: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="email"
                        value={profile?.email || ""}
                        disabled
                        className="w-full pl-11 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 text-sm outline-none cursor-not-allowed"
                      />
                    </div>
                    <p className="text-gray-400 text-xs mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Role
                    </label>
                    <div className="relative">
                      <FileText
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        value={profile?.role || ""}
                        disabled
                        className="w-full pl-11 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 text-sm outline-none cursor-not-allowed capitalize"
                      />
                    </div>
                    <p className="text-gray-400 text-xs mt-1">
                      Role cannot be changed
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={nameLoading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    {nameLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        Update Profile
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Change Password Tab */}
            {activeTab === "password" && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
                  <Key size={18} className="text-blue-600" />
                  Change Password
                </h3>

                {passwordSuccess && (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl mb-4 text-sm">
                    <CheckCircle size={15} />
                    {passwordSuccess}
                  </div>
                )}

                {passwordError && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
                    <AlertCircle size={15} />
                    {passwordError}
                  </div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            currentPassword: e.target.value,
                          })
                        }
                        placeholder="Enter current password"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        placeholder="Enter new password"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="Confirm new password"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    {passwordLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Changing...
                      </>
                    ) : (
                      <>
                        <Key size={16} />
                        Change Password
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
