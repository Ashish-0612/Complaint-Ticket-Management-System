import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  User,
  CheckCircle,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword)
      return setError("Passwords do not match!");
    if (formData.password.length < 6)
      return setError("Password must be at least 6 characters!");
    setLoading(true);
    try {
      await API.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="text-gray-800 text-xl font-bold mb-2">
            Account Created!
          </h2>
          <p className="text-gray-500 text-sm">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden w-full max-w-4xl flex">
        {/* ===== LEFT — Illustration ===== */}
        <div
          className="hidden md:flex w-2/5 flex-col justify-between p-10"
          style={{
            background: "linear-gradient(145deg, #e8f0fe 0%, #dbeafe 100%)",
          }}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">C</span>
              </div>
              <span className="text-blue-900 font-bold text-lg">CTMS</span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-3">Join Us</h2>
            <p className="text-blue-700 text-sm leading-relaxed mb-8">
              Create an account to manage and track your complaints easily.
            </p>

            {/* SVG Illustration */}
            <svg
              viewBox="0 0 300 280"
              className="w-full max-w-xs mx-auto"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background blob */}
              <ellipse
                cx="150"
                cy="240"
                rx="120"
                ry="30"
                fill="#bfdbfe"
                opacity="0.5"
              />
              <path
                d="M60 200 Q80 100 150 80 Q220 60 240 180 Q260 240 150 260 Q60 270 60 200Z"
                fill="#dbeafe"
                opacity="0.6"
              />

              {/* Clipboard */}
              <rect
                x="95"
                y="60"
                width="120"
                height="160"
                rx="8"
                fill="#1e3a8a"
              />
              <rect
                x="130"
                y="50"
                width="50"
                height="20"
                rx="6"
                fill="#1e3a8a"
              />
              <rect
                x="140"
                y="45"
                width="30"
                height="12"
                rx="6"
                fill="#94a3b8"
              />
              <rect
                x="105"
                y="80"
                width="100"
                height="130"
                rx="4"
                fill="white"
              />

              {/* Clipboard content */}
              <text
                x="120"
                y="105"
                fontSize="11"
                fontWeight="bold"
                fill="#1e3a8a"
              >
                COMPLAINT
              </text>

              {/* Checkboxes */}
              {[120, 140, 160, 180].map((y, i) => (
                <g key={i}>
                  <rect
                    x="112"
                    y={y}
                    width="10"
                    height="10"
                    rx="2"
                    fill="#dbeafe"
                    stroke="#3b82f6"
                    strokeWidth="1"
                  />
                  <path
                    d={`M113 ${y + 5} L115 ${y + 7} L120 ${y + 2}`}
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <rect
                    x="128"
                    y={y + 2}
                    width="55"
                    height="5"
                    rx="2"
                    fill="#e2e8f0"
                  />
                  {i < 3 && (
                    <rect
                      x="128"
                      y={y + 2}
                      width={[45, 55, 35][i]}
                      height="5"
                      rx="2"
                      fill="#bfdbfe"
                    />
                  )}
                </g>
              ))}

              {/* Big checkmark circle */}
              <circle cx="190" cy="195" r="22" fill="#2563eb" />
              <path
                d="M180 195 L187 202 L202 186"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Person */}
              {/* Head */}
              <circle cx="75" cy="130" r="16" fill="#fbbf24" />
              {/* Body */}
              <rect
                x="60"
                y="146"
                width="30"
                height="55"
                rx="8"
                fill="#2563eb"
              />
              {/* Legs */}
              <rect
                x="63"
                y="196"
                width="10"
                height="35"
                rx="5"
                fill="#1e293b"
              />
              <rect
                x="77"
                y="196"
                width="10"
                height="35"
                rx="5"
                fill="#1e293b"
              />
              {/* Shoes */}
              <ellipse cx="68" cy="231" rx="8" ry="5" fill="#0f172a" />
              <ellipse cx="82" cy="231" rx="8" ry="5" fill="#0f172a" />
              {/* Arm pointing */}
              <path
                d="M90 160 Q110 150 125 155"
                stroke="#2563eb"
                strokeWidth="10"
                strokeLinecap="round"
              />

              {/* Leaves */}
              <ellipse
                cx="245"
                cy="220"
                rx="12"
                ry="25"
                fill="#86efac"
                transform="rotate(-20 245 220)"
              />
              <ellipse
                cx="235"
                cy="215"
                rx="10"
                ry="20"
                fill="#4ade80"
                transform="rotate(10 235 215)"
              />
              <ellipse
                cx="255"
                cy="210"
                rx="8"
                ry="18"
                fill="#86efac"
                transform="rotate(-35 255 210)"
              />
            </svg>
          </div>

          <p className="text-blue-600 text-xs">© 2026 CTMS · Ashish Yadav</p>
        </div>

        {/* ===== RIGHT — Form ===== */}
        <div className="w-full md:w-3/5 flex flex-col justify-center p-10">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Create Your Account
            </h1>
            <p className="text-gray-500 text-sm">Sign up to get started</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
              <AlertCircle size={15} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  className={`w-full pl-11 pr-11 py-3 bg-gray-50 border rounded-xl text-gray-900 text-sm placeholder-gray-400 outline-none focus:ring-2 transition-all ${
                    formData.confirmPassword &&
                    formData.password !== formData.confirmPassword
                      ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                      : formData.confirmPassword &&
                          formData.password === formData.confirmPassword
                        ? "border-green-300 focus:border-green-400 focus:ring-green-50"
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-50 focus:bg-white"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {formData.confirmPassword && (
                  <div className="absolute right-10 top-1/2 -translate-y-1/2">
                    {formData.password === formData.confirmPassword ? (
                      <CheckCircle size={15} className="text-green-500" />
                    ) : (
                      <AlertCircle size={15} className="text-red-400" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1.5">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all cursor-pointer"
              >
                <option value="user">User — Raise support tickets</option>
                <option value="agent">Agent — Handle assigned tickets</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2 shadow-lg shadow-blue-100"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-5">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
