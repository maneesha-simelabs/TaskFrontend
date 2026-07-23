import { useState } from "react";
import useAuth from "../hooks/useAuth";
import "../css/Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@taskflow.com");
  const [password, setPassword] = useState("Admin1234");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password });
    navigate("/");
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
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="options">
            <label>
              <input type="checkbox" />
              Remember me
            </label>

            <a href="#">Forgot Password?</a>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          <button type="button" className="google-btn">
            Continue with Google
          </button>

          <p className="signup">
            Don't have an account?
            <a href="#">Create Account</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
