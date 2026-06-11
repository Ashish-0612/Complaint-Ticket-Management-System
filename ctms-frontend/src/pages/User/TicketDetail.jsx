import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  // Ticket fetch karo
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

  // Comments fetch karo
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

  // Comment submit karo
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
      const res = await API.post(`/tickets/${id}/comments`, {
        content: newComment,
      });
      setComments([...comments, res.data.data]);
      setNewComment("");
    } catch {
      alert("Failed to add comment!");
    } finally {
      setCommentLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-600";
      case "in-progress":
        return "bg-yellow-100 text-yellow-600";
      case "resolved":
        return "bg-green-100 text-green-600";
      case "closed":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-600";
      case "high":
        return "bg-orange-100 text-orange-600";
      case "medium":
        return "bg-yellow-100 text-yellow-600";
      case "low":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading ticket...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">CTMS</h1>
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-blue-600"
        >
          ← Back
        </button>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        {/* Ticket Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              #{ticket.id} — {ticket.title}
            </h2>
          </div>

          {/* Badges */}
          <div className="flex gap-2 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}
            >
              {ticket.status}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)}`}
            >
              {ticket.priority}
            </span>
            {ticket.department && (
              <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-600">
                {ticket.department.name}
              </span>
            )}
            {ticket.category && (
              <span className="px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-600">
                {ticket.category.name}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">Description:</h3>
            <p className="text-gray-600">{ticket.description}</p>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              <span className="font-medium">Created by:</span>{" "}
              {ticket.creator?.name}
            </div>
            <div>
              <span className="font-medium">Assigned to:</span>{" "}
              {ticket.agent?.name || "Not assigned yet"}
            </div>
            <div>
              <span className="font-medium">Created:</span>{" "}
              {new Date(ticket.createdAt).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Last updated:</span>{" "}
              {new Date(ticket.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Comments ({comments.length})
          </h3>

          {/* Comments List */}
          {comments.length === 0 ? (
            <p className="text-gray-400 text-sm mb-4">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <div className="space-y-4 mb-6">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border-l-4 border-blue-300 pl-4 py-2"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-700 text-sm">
                      {comment.user?.name || "Unknown"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{comment.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment Form */}
          <form onSubmit={handleCommentSubmit}>
            <div className="mb-3">
              <label className="block text-gray-700 mb-2 font-medium text-sm">
                Add Comment:
              </label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full border p-3 rounded outline-none focus:border-blue-500 h-24"
                placeholder="Write your comment here..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={commentLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {commentLoading ? "Posting..." : "Post Comment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
