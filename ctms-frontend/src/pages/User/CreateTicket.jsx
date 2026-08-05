import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import NotificationBell from "../../components/NotificationBell";
import {
  Ticket,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  FileText,
  Activity,
  AlertCircle,
  CheckCircle,
  Paperclip,
  Trash2,
  Menu,
  X,
} from "lucide-react";

const CreateTicket = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    // Notification bell ke liye user ke tickets
    API.get("/tickets", { params: { limit: 1000 } })
      .then((res) => setTickets(res.data.data || []))
      .catch(() => setTickets([]));
  }, []);

  const [formData, setFormData] = useState({


    title: "",
    description: "",
    priority: "medium",
    departmentId: "",
    categoryId: "",
  });
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const attachmentInputRef = useRef(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await API.get("/departments");
        setDepartments(res.data.data);
      } catch {
        console.log("Failed");
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (!formData.departmentId) return;
    const fetchCategories = async () => {
      try {
        const res = await API.get(
          `/categories?departmentId=${formData.departmentId}`,
        );
        setCategories(res.data.data);
      } catch {
        console.log("Failed");
      }
    };
    fetchCategories();
  }, [formData.departmentId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleAttachmentChange = (e) => {
    const scrollPosition = Number(e.currentTarget.dataset.scrollPosition || 0);
    const selectedFile = e.target.files?.[0] || null;
    if (!selectedFile) {
      setAttachment(null);
      return;
    }

    const allowedExtensions = /\.(jpe?g|png|gif|pdf|docx?)$/i;
    if (!allowedExtensions.test(selectedFile.name)) {
      setAttachment(null);
      setError("Only JPG, PNG, GIF, PDF, DOC, and DOCX files are allowed.");
      e.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setAttachment(null);
      setError("Attachment size must be 5 MB or less.");
      e.target.value = "";
      return;
    }

    setAttachment(selectedFile);
    setError("");
    requestAnimationFrame(() => window.scrollTo(0, scrollPosition));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.title.trim().length < 5) {
      setError("Title must be at least 5 characters.");
      return;
    }
    if (formData.description.trim().length < 10) {
      setError("Description must be at least 10 characters.");
      return;
    }
    if (!formData.departmentId) {
      setError("Please select a department.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const ticketResponse = await API.post("/tickets", formData);
      const ticketId = ticketResponse.data.data.id;

      if (attachment) {
        const uploadData = new FormData();
        uploadData.append("file", attachment);
        await API.post(`/tickets/${ticketId}/attachments`, uploadData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      const validationErrors = err.response?.data?.errors
        ?.map((validationError) => validationError.message)
        .join(" ");
      setError(
        validationErrors ||
          err.response?.data?.message ||
          "Failed to create complaint or upload attachment!",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Ticket, label: "My Complaints", path: "/dashboard" },
    {
      icon: PlusCircle,
      label: "New Complaint",
      path: "/create-ticket",
      active: true,
    },
    { icon: Activity, label: "Announcements", path: "/dashboard" },
    { icon: FileText, label: "Profile", path: "/dashboard" },
  ];

  const priorities = [
    {
      value: "low",
      label: "Low",
      color: "border-green-300 bg-green-50 text-green-700",
    },
    {
      value: "medium",
      label: "Medium",
      color: "border-yellow-300 bg-yellow-50 text-yellow-700",
    },
    {
      value: "high",
      label: "High",
      color: "border-orange-300 bg-orange-50 text-orange-700",
    },
    {
      value: "critical",
      label: "Critical",
      color: "border-red-300 bg-red-50 text-red-700",
    },
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="text-gray-800 text-xl font-bold mb-2">
            Complaint Submitted!
          </h2>
          <p className="text-gray-500 text-sm">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ========== MOBILE TOP BAR ========== */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-gray-900 flex items-center justify-between px-4">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-white hover:bg-gray-800"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <p className="text-white font-bold text-sm">New Complaint</p>
        <div className="w-11" />
      </div>

      {/* ========== MOBILE DRAWER ========== */}
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
        <div className="px-5 py-5 border-b border-gray-800 flex items-center justify-between">
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
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-400 hover:bg-red-600 hover:text-white text-sm transition-all cursor-pointer min-h-[44px]"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* ========== SIDEBAR ========== */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-20 h-screen w-56 bg-gray-900 flex-col">


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

        <nav className="flex-1 px-3 py-4">
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
      <div className="min-w-0 min-h-0 h-screen flex-1 flex flex-col overflow-hidden md:ml-56">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 flex items-center justify-between gap-4 flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-gray-800">New Complaint</h1>
            <p className="text-gray-500 text-sm">
              Fill in the details to submit your complaint
            </p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell tickets={tickets} />
            <div className="flex items-center gap-2 border border-gray-200 px-3 py-1.5 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline text-sm font-medium text-gray-700">
                {user?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="min-w-0 min-h-0 flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6">
          <div className="max-w-3xl mx-auto">
            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm">
                <AlertCircle size={15} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 pb-2">
              {/* Title */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">
                  Basic Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Complaint Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Brief description of your issue"
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Detailed description of your complaint..."
                      required
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Priority */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">Priority Level</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {priorities.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, priority: p.value })
                      }
                      className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer ${
                        formData.priority === p.value
                          ? p.color + " border-2"
                          : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Department + Category */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">
                  Department & Category
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="departmentId"
                      value={formData.departmentId}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all cursor-pointer"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Category{" "}
                      <span className="text-gray-400 font-normal">
                        (Optional)
                      </span>
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all cursor-pointer"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Attachment */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-2">Attachment</h3>
                <p className="text-gray-500 text-xs mb-4">
                  Optional. Images and documents up to 5 MB.
                </p>
                <label className="relative flex min-w-0 items-center gap-3 border-2 border-dashed border-gray-200 rounded-xl px-4 py-4 text-sm text-gray-600 hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer transition-colors">
                  <Paperclip size={18} className="text-blue-600" />
                  <span className="truncate">
                    {attachment ? attachment.name : "Choose a file"}
                  </span>
                  <input
                    ref={attachmentInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                    onClick={(event) => {
                      event.currentTarget.dataset.scrollPosition = window.scrollY;
                    }}
                    onChange={handleAttachmentChange}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                </label>
                {attachment && (
                  <button
                    type="button"
                    onClick={() => {
                      setAttachment(null);
                      if (attachmentInputRef.current) {
                        attachmentInputRef.current.value = "";
                      }
                    }}
                    className="mt-3 flex items-center gap-2 text-sm text-red-500 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 size={15} />
                    Remove selected file
                  </button>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-100 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <PlusCircle size={16} />
                      Submit Complaint
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
