import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-blue-600 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mb-4">
            Welcome, <strong>{user?.name}</strong>!
          </p>
          <p className="text-gray-600 mb-6">
            Role:{" "}
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded">
              {user?.role}
            </span>
          </p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
