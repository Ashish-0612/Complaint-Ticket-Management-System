import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import {
  Ticket,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  Activity,
  Bell,
  AlertCircle,
  Clock,
  User,
  Calendar,
  Tag,
  MessageSquare,
  Send,
  ArrowLeft,
  Paperclip,
  Trash2,
  UserCog,
  BarChart3,
  Settings,
  RotateCcw,
} from "lucide-react";

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [activityLogs, setActivityLogs] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [attachmentLoading, setAttachmentLoading] = useState(false);
  const [attachmentError, setAttachmentError] = useState("");
  const [reopenLoading, setReopenLoading] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await API.get(`/tickets/${id}`);
        setTicket(res.data.data);
      } catch {
        setError("Failed to load ticket!");
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await API.get(`/tickets/${id}/comments`);
        setComments(res.data.data);
      } catch {
        setComments([]);
      }
    };
    fetchComments();
  }, [id]);

  useEffect(() => {
    const fetchActivityLogs = async () => {
      try {
        const res = await API.get(`/tickets/${id}/comments/logs`);
        setActivityLogs(res.data.data);
      } catch {
        setActivityLogs([]);
      }
    };
    fetchActivityLogs();
  }, [id]);

  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        const res = await API.get(`/tickets/${id}/attachments`);
        setAttachments(res.data.data);
      } catch {
        setAttachments([]);
      }
    };
    fetchAttachments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setCommentLoading(true);
    try {
      const res = await API.post(`/tickets/${id}/comments`, {
        comment: newComment,
      });

      // Author manually add karo — refresh ki zaroorat nahi!
      const commentWithUser = {
        ...res.data.data,
        author: {
          id: user.id,
          name: user.name,
          role: user.role,
        },
      };

      setComments([...comments, commentWithUser]);
      setNewComment("");

      // Activity log bhi refresh karo
      const logsRes = await API.get(`/tickets/${id}/comments/logs`);
      setActivityLogs(logsRes.data.data);
    } catch {
      alert("Failed to add comment!");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await API.delete(`/tickets/${id}/comments/${commentId}`);
      setComments((currentComments) =>
        currentComments.filter((comment) => comment.id !== commentId),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete comment.");
    }
  };

  const handleAttachmentUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    if (selectedFile.size > 5 * 1024 * 1024) {
      setAttachmentError("File size must be 5 MB or less.");
      return;
    }

    setAttachmentLoading(true);
    setAttachmentError("");
    try {
      const uploadData = new FormData();
      uploadData.append("file", selectedFile);
      const res = await API.post(`/tickets/${id}/attachments`, uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAttachments((currentAttachments) => [
        { ...res.data.data, uploadedBy: user },
        ...currentAttachments,
      ]);
      setSelectedFile(null);
      e.target.reset();
    } catch (err) {
      setAttachmentError(
        err.response?.data?.message || "Failed to upload attachment.",
      );
    } finally {
      setAttachmentLoading(false);
    }
  };

  const handleAttachmentDelete = async (attachmentId) => {
    try {
      await API.delete(`/tickets/${id}/attachments/${attachmentId}`);
      setAttachments((currentAttachments) =>
        currentAttachments.filter((attachment) => attachment.id !== attachmentId),
      );
    } catch (err) {
      setAttachmentError(
        err.response?.data?.message || "Failed to delete attachment.",
      );
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleReopen = async () => {
    setReopenLoading(true);
    setError("");
    try {
      const res = await API.post(`/tickets/${id}/reopen`);
      setTicket((currentTicket) => ({
        ...currentTicket,
        ...res.data.data,
        status: "reopened",
      }));
      const logsRes = await API.get(`/tickets/${id}/comments/logs`);
      setActivityLogs(logsRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reopen ticket.");
    } finally {
      setReopenLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      case "resolved":
        return "bg-green-100 text-green-700 border border-green-200";
      case "closed":
        return "bg-gray-100 text-gray-600 border border-gray-200";
      case "reopened":
        return "bg-orange-100 text-orange-700 border border-orange-200";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-700 border border-red-200";
      case "high":
        return "bg-orange-100 text-orange-700 border border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border border-green-200";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Role based sidebar
  const getSidebarColor = () => {
    if (user?.role === "agent") return "bg-green-600";
    return "bg-blue-600";
  };

  const getNavItems = () => {
    if (user?.role === "admin")
      return [
        { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
        { icon: Ticket, label: "Complaints", path: "/admin" },
        { icon: BarChart3, label: "Reports", path: "/admin" },
        { icon: Settings, label: "Settings", path: "/admin" },
      ];
    if (user?.role === "agent")
      return [
        { icon: LayoutDashboard, label: "Dashboard", path: "/agent" },
        { icon: Ticket, label: "Assigned Complaints", path: "/agent" },
        { icon: Activity, label: "My Activity", path: "/agent" },
      ];
    return [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
      { icon: Ticket, label: "My Complaints", path: "/dashboard" },
      { icon: PlusCircle, label: "New Complaint", path: "/create-ticket" },
    ];
  };

  const getBackPath = () => {
    if (user?.role === "admin") return "/admin";
    if (user?.role === "agent") return "/agent";
    return "/dashboard";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading complaint...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
          <p className="text-red-500 font-medium">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-blue-600 text-sm hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ========== SIDEBAR ========== */}
      <aside className="w-56 bg-gray-900 flex flex-col flex-shrink-0">
        {/* Logo */}
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

        {/* Nav */}
        <nav className="flex-1 px-3 py-4">
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider px-2 mb-3">
            Main Menu
          </p>
          <ul className="space-y-0.5">
            {getNavItems().map((item, i) => (
              <li key={i}>
                <button
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white text-sm font-medium transition-all cursor-pointer"
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
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(getBackPath())}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm cursor-pointer"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="h-5 w-px bg-gray-200"></div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Complaint Details
              </h1>
              <p className="text-gray-500 text-xs">#{ticket?.id}</p>
            </div>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-5">
            {/* Ticket Header Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex-1 pr-4">
                  {ticket?.title}
                </h2>
                <div className="flex gap-2 flex-shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket?.status)}`}
                  >
                    {ticket?.status}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(ticket?.priority)}`}
                  >
                    {ticket?.priority}
                  </span>
                  {(ticket?.status === "resolved" || ticket?.status === "closed") &&
                    (user?.role === "admin" ||
                      user?.role === "agent" ||
                      ticket?.creator?.id === user?.id) && (
                      <button
                        type="button"
                        onClick={handleReopen}
                        disabled={reopenLoading}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-orange-700 border border-orange-200 hover:bg-orange-50 disabled:opacity-50 cursor-pointer"
                      >
                        <RotateCcw size={12} />
                        {reopenLoading ? "Reopening..." : "Reopen Ticket"}
                      </button>
                    )}
                </div>
              </div>

              {/* Tags */}
              <div className="flex gap-2 mb-5">
                {ticket?.department && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-200">
                    <Tag size={11} />
                    {ticket.department.name}
                  </span>
                )}
                {ticket?.category && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-200">
                    <Tag size={11} />
                    {ticket.category.name}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-xl p-4 mb-5">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Description
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {ticket?.description}
                </p>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <User size={14} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Created By</p>
                    <p className="text-xs font-semibold text-gray-700">
                      {ticket?.creator?.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                    <UserCog size={14} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Assigned To</p>
                    <p className="text-xs font-semibold text-gray-700">
                      {ticket?.agent?.name || "Not assigned"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Calendar size={14} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Created</p>
                    <p className="text-xs font-semibold text-gray-700">
                      {new Date(ticket?.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                    <Clock size={14} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Last Updated</p>
                    <p className="text-xs font-semibold text-gray-700">
                      {new Date(ticket?.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Attachments Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center gap-2">
                <Paperclip size={18} className="text-gray-600" />
                <h3 className="font-bold text-gray-800">Attachments</h3>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium ml-1">
                  {attachments.length}
                </span>
              </div>

              <div className="p-5">
                <form
                  onSubmit={handleAttachmentUpload}
                  className="flex flex-col sm:flex-row gap-3 mb-5"
                >
                  <label className="flex-1 flex items-center gap-3 border-2 border-dashed border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer transition-colors">
                    <Paperclip size={18} className="text-blue-600 flex-shrink-0" />
                    <span className="truncate">
                      {selectedFile ? selectedFile.name : "Choose a file to attach"}
                    </span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                      onChange={(event) => {
                        setSelectedFile(event.target.files?.[0] || null);
                        setAttachmentError("");
                      }}
                      className="sr-only"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={!selectedFile || attachmentLoading}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50 cursor-pointer"
                  >
                    {attachmentLoading ? "Uploading..." : "Upload"}
                  </button>
                </form>
                <p className="text-xs text-gray-400 mb-4">
                  Images and documents up to 5 MB.
                </p>
                {attachmentError && (
                  <p className="text-sm text-red-500 mb-4">{attachmentError}</p>
                )}

                {attachments.length === 0 ? (
                  <div className="text-center py-6">
                    <Paperclip size={28} className="text-gray-200 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No attachments yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center gap-3 border border-gray-100 rounded-xl px-3 py-3"
                      >
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <Paperclip size={16} className="text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {attachment.originalName}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatFileSize(attachment.fileSize)} · {attachment.uploadedBy?.name || "Unknown"}
                          </p>
                        </div>
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 text-xs font-semibold hover:underline flex-shrink-0"
                        >
                          Open
                        </a>
                        {(user?.role === "admin" ||
                          attachment.uploadedBy?.id === user?.id) && (
                          <button
                            type="button"
                            onClick={() => handleAttachmentDelete(attachment.id)}
                            title="Delete attachment"
                            aria-label={`Delete ${attachment.originalName}`}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer flex-shrink-0"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center gap-2">
                <MessageSquare size={18} className="text-gray-600" />
                <h3 className="font-bold text-gray-800">Comments</h3>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium ml-1">
                  {comments.length}
                </span>
              </div>

              {/* Comments List */}
              <div className="p-5">
                {comments.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare
                      size={32}
                      className="text-gray-200 mx-auto mb-3"
                    />
                    <p className="text-gray-400 text-sm">No comments yet.</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Be the first to comment!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 mb-5">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {comment.author?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-semibold text-gray-800">
                                {comment.author?.name || "Unknown"}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">
                                  {new Date(
                                    comment.createdAt,
                                  ).toLocaleDateString()}
                                </span>
                                {user?.role === "admin" && (
                                  <button
                                    type="button"
                                    onClick={() => handleCommentDelete(comment.id)}
                                    title="Delete comment"
                                    aria-label="Delete comment"
                                    className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-700 text-sm">
                              {comment.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment */}
                <form
                  onSubmit={handleCommentSubmit}
                  className="flex gap-3 mt-4"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={commentLoading || !newComment.trim()}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 text-sm font-medium cursor-pointer"
                    >
                      {commentLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send size={15} />
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            {/* Activity Log Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center gap-2">
                <Activity size={18} className="text-gray-600" />
                <h3 className="font-bold text-gray-800">Activity Log</h3>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium ml-1">
                  {activityLogs.length}
                </span>
              </div>

              <div className="p-5">
                {activityLogs.length === 0 ? (
                  <div className="text-center py-6">
                    <Activity
                      size={28}
                      className="text-gray-200 mx-auto mb-2"
                    />
                    <p className="text-gray-400 text-sm">No activity yet!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activityLogs.map((log, index) => (
                      <div key={log.id} className="flex gap-3">
                        {/* Timeline line */}
                        <div className="flex flex-col items-center">
                          <div className="w-7 h-7 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center flex-shrink-0">
                            <Activity size={12} className="text-blue-600" />
                          </div>
                          {index < activityLogs.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-100 mt-1"></div>
                          )}
                        </div>
                        {/* Log content */}
                        <div className="flex-1 pb-3">
                          <p className="text-sm text-gray-700 font-medium">
                            {log.details}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(log.createdAt).toLocaleDateString()} —{" "}
                            {new Date(log.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
