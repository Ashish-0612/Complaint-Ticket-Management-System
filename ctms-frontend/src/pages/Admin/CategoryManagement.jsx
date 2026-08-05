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
  Menu,
} from "lucide-react";

const CategoryManagement = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [formData, setFormData] = useState({ name: "", departmentId: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [filterDept, setFilterDept] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catsRes, deptsRes] = await Promise.all([
        API.get("/categories"),
        API.get("/departments"),
      ]);
      setCategories(catsRes.data.data);
      setDepartments(deptsRes.data.data);
    } catch {
      console.log("Failed to load");
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
      if (editingCat) {
        await API.put(`/categories/${editingCat.id}`, formData);
        setSuccess("Category updated successfully!");
      } else {
        await API.post("/categories", formData);
        setSuccess("Category created successfully!");
      }
      fetchData();
      setFormData({ name: "", departmentId: "" });
      setShowAddForm(false);
      setEditingCat(null);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed!");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setEditingCat(cat);
    setFormData({ name: cat.name, departmentId: cat.departmentId });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      await API.delete(`/categories/${id}`);
      setSuccess("Category deleted!");
      fetchData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete!");
    }
  };

  const filteredCategories = categories.filter(
    (cat) => filterDept === "all" || cat.departmentId === parseInt(filterDept),
  );

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Users, label: "Users", path: "/admin/users" },
    {
      icon: UserCog,
      label: "Agent Performance",
      path: "/admin/agents/performance",
    },
    { icon: Tag, label: "Departments", path: "/admin/departments" },
    { icon: Tag, label: "Categories", path: "/admin/categories", active: true },
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
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-gray-900 flex items-center justify-between px-4">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-white hover:bg-gray-800"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <p className="text-white font-bold text-sm">Categories</p>
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
              Category Management
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm truncate">
              Manage all categories
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                setShowAddForm(true);
                setEditingCat(null);
                setFormData({ name: "", departmentId: "" });
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all min-h-[44px]"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Add Category</span>
            </button>
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer">
              <Bell size={18} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
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

          {showAddForm && (
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">
                  {editingCat ? "Edit Category" : "Add New Category"}
                </h3>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingCat(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) =>
                      setFormData({ ...formData, departmentId: e.target.value })
                    }
                    style={{ color: "#111827", backgroundColor: "#fff" }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm cursor-pointer min-h-[44px]"
                  >
                    {submitLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : editingCat ? (
                      "Update Category"
                    ) : (
                      "Add Category"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingCat(null);
                    }}
                    className="px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all cursor-pointer text-sm min-h-[44px]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
            <label className="text-sm font-medium text-gray-700">
              Filter by Department:
            </label>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 bg-white cursor-pointer w-full sm:w-auto"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">All Categories</h3>
              <p className="text-gray-500 text-xs mt-0.5">
                {filteredCategories.length} categories
              </p>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="grid grid-cols-5 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="col-span-1">ID</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-1">Department</div>
                  <div className="col-span-1">Actions</div>
                </div>

                {loading && (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-gray-500 text-sm">Loading...</p>
                  </div>
                )}

                {!loading && filteredCategories.length === 0 && (
                  <div className="text-center py-12">
                    <Tag size={40} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No categories found</p>
                  </div>
                )}

                {!loading &&
                  filteredCategories.map((cat) => (
                    <div
                      key={cat.id}
                      className="grid grid-cols-5 gap-4 px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-all items-center"
                    >
                      <div className="col-span-1 text-xs text-gray-400 font-mono">
                        #{cat.id}
                      </div>

                      <div className="col-span-2">
                        <p className="text-sm font-semibold text-gray-800">
                          {cat.name}
                        </p>
                      </div>

                      <div className="col-span-1">
                        <span className="text-xs px-2 py-1 rounded-lg bg-purple-100 text-purple-700 font-medium">
                          {departments.find((d) => d.id === cat.departmentId)
                            ?.name || "Unknown"}
                        </span>
                      </div>

                      <div className="col-span-1 flex gap-2">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-all"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
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
      </div>
    </div>
  );
};

export default CategoryManagement;
