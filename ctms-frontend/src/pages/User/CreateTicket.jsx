import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const CreateTicket = () => {
  const navigate = useNavigate();

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

  // Fetch departments on load
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await API.get("/departments");
        setDepartments(res.data.data);
      } catch (err) {
        setError("Failed to load departments!");
      }
    };
    fetchDepartments();
  }, []);

  // Fetch categories when department changes
  useEffect(() => {
    if (!formData.departmentId) return;

    const fetchCategories = async () => {
      try {
        const res = await API.get(
          `/categories?departmentId=${formData.departmentId}`,
        );
        setCategories(res.data.data);
      } catch (err) {
        setError("Failed to load categories!");
      }
    };
    fetchCategories();
  }, [formData.departmentId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await API.post("/tickets", formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ticket!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">CTMS</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-gray-600 hover:text-blue-600"
        >
          ← Back to Dashboard
        </button>
      </nav>

      {/* Form */}
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Create New Ticket
          </h2>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border p-3 rounded outline-none focus:border-blue-500"
                placeholder="Brief description of issue"
                required
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border p-3 rounded outline-none focus:border-blue-500 h-32"
                placeholder="Detailed description of your issue"
                required
              />
            </div>

            {/* Priority */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full border p-3 rounded outline-none focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Department */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                Department
              </label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                className="w-full border p-3 rounded outline-none focus:border-blue-500"
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">
                Category
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full border p-3 rounded outline-none focus:border-blue-500"
              >
                <option value="">Select Category (Optional)</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Ticket"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex-1 bg-gray-200 text-gray-700 p-3 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
