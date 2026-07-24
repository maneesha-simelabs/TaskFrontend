import { useState } from "react";
import useAuth from "../hooks/useAuth";
import "../css/Login.css";
import { useNavigate, Navigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState(""); //"admin@taskflow.com"
  const [password, setPassword] = useState(""); //Admin1234
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem("rememberMe") === "true";
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!validate()) return;

      const result = await login({ email, password, rememberMe });

      if (result?.success === false) {
        throw new Error(result?.message || "Login failed");
      }

      navigate("/");
    } catch (e) {
      console.log(e.userMessage || e.message);
      setErrors({ submit: e.userMessage || e.message || "Login failed" });
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/forgotPassword");
  };
  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="login-page">
      <div className="left-panel">
        <h1>TaskFlow</h1>

        <p className="subtitle">
          Organize your work. Track your progress. Achieve more every day.
        </p>

        <div className="dashboard-card">
          <h3>Today's Progress</h3>

          <div className="task completed">✔ Authentication Module</div>

          <div className="task completed">✔ Dashboard UI</div>

          <div className="task">○ API Integration</div>

          <div className="task">○ Unit Testing</div>

          <div className="progress">
            <div className="progress-text">
              <span>Project Progress</span>
              <span>74%</span>
            </div>

            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="right-panel">
        <form className="login-card" onSubmit={handleSubmit}>
          <h2>Welcome Back 👋</h2>

          <p>Sign in to continue managing your tasks.</p>

          <div className="input-group">
            <label>Email Address</label>

            <input
              className={errors.email ? "error-input" : ""}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                validate();
                setEmail(e.target.value);
              }}
            />

            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="input-group password-box login">
            <label>Password</label>

            <input
              className={errors.password ? "error-input" : ""}
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validate();
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="options">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>

            <button type="button" onClick={handleClick}>
              Forgot Password?
            </button>
          </div>
          {errors.submit && <p className="error">{errors.submit}</p>}
          <button type="submit" className="login-btn">
            Login
          </button>

          {/* <button type="button" className="google-btn">
            Continue with Google
          </button> */}

          {/* <p className="signup">
            Don't have an account?
            <a href="#">Create Account</a>
          </p> */}
        </form>
      </div>
    </div>
  );
}

export default Login;
