import { useState } from "react";
import { Link } from "react-router-dom";
// import "./auth.css";
import { forgotPassword } from "../services/axios";
import "../css/Password.css";
import Button from "../components/Button";
import Input from "../components/Input";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    try {
      const response = await forgotPassword(email);
      setMessage(response.message || "Password reset link sent successfully.");
      setEmail("");
    } catch (err) {
      setError(err.userMessage || "Unable to send reset link.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Forgot Password</h2>

        <p className="subtitle">Enter your registered email address.</p>

        <form onSubmit={handleSubmit}>
          {/* <label>Email</label> */}

          <Input
            label="Email"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}

          <Button className="btn-primary">Send Reset Link</Button>
        </form>

        <Link to="/login" className="back-link">
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}
