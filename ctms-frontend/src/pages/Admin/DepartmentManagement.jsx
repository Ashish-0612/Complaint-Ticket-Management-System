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
  Bell,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";

const DepartmentManagement = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await API.get("/departments");

      console.log("Departments API Response:", res);
      console.log("Departments Data:", res.data);

      setDepartments(res.data.data);
    } catch (err) {
      console.log("Department Error:", err);
      console.log("Response:", err.response);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError("");
    setSuccess("");

    try {
      if (editingDept) {
        // Update
        await API.put(`/departments/${editingDept.id}`, formData);
        setSuccess("Department updated successfully!");
      } else {
        // Create
        await API.post("/departments", formData);
        setSuccess("Department created successfully!");
      }
      fetchDepartments();
      setFormData({ name: "", description: "" });
      setShowAddForm(false);
      setEditingDept(null);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed!");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (dept) => {
    setEditingDept(dept);
    setFormData({ name: dept.name, description: dept.description || "" });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?"))
      return;
    try {
      await API.delete(`/departments/${id}`);
      setSuccess("Department deleted!");
      fetchDepartments();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete!");
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: UserCog, label: "Agent Performance", path: "/admin/agents/performance" },
    {
      icon: Tag,
      label: "Departments",
      path: "/admin/departments",
      active: true,
    },
    { icon: Ticket, label: "Complaints", path: "/admin" },
    { icon: BarChart3, label: "Reports", path: "/admin" },
    { icon: Settings, label: "Settings", path: "/admin" },
    { icon: UserCog, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-56 bg-gray-900 flex flex-col flex-shrink-0">
        <div className="px-5 py-5 border-b border-gray-800">
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
              <p className="text-white text-xs font-medium truncate">
                {user?.name}
              </p>
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

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Department Management
            </h1>
            <p className="text-gray-500 text-sm">Manage all departments</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowAddForm(true);
                setEditingDept(null);
                setFormData({ name: "", description: "" });
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all"
            >
              <Plus size={16} />
              Add Department
            </button>
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer">
              <Bell size={18} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Success/Error */}
          {success && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl mb-4 text-sm">
              <CheckCircle size={15} />
              {success}
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">
                  {editingDept ? "Edit Department" : "Add New Department"}
                </h3>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingDept(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Department Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    style={{
                      color: "black",
                      backgroundColor: "white",
                    }}
                    className="w-full border border-gray-300 p-3 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Brief description of this department"
                    rows={3}
                    className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    {submitLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : editingDept ? (
                      "Update Department"
                    ) : (
                      "Add Department"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingDept(null);
                    }}
                    className="px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all cursor-pointer text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Departments Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">All Departments</h3>
              <p className="text-gray-500 text-xs mt-0.5">
                {departments.length} departments
              </p>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="col-span-1">ID</div>
              <div className="col-span-2">Department</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Actions</div>
            </div>

            {loading && (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-500 text-sm">Loading...</p>
              </div>
            )}

            {!loading && departments.length === 0 && (
              <div className="text-center py-12">
                <Tag size={40} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No departments found</p>
              </div>
            )}

            {!loading &&
              departments.map((dept) => (
                <div
                  key={dept.id}
                  className="grid grid-cols-5 gap-4 px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-all items-center"
                >
                  <div className="col-span-1 text-xs text-gray-400 font-mono">
                    #{dept.id}
                  </div>

                  <div className="col-span-2">
                    <p className="text-sm font-semibold text-gray-800">
                      {dept.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {dept.description || "No description"}
                    </p>
                  </div>

                  <div className="col-span-1">
                    <span
                      className={`text-xs px-2 py-1 rounded-lg font-medium ${
                        dept.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {dept.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="col-span-1 flex gap-2">
                    <button
                      onClick={() => handleEdit(dept)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-all"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(dept.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-all"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentManagement;
