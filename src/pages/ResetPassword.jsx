import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "../css/Password.css";
import { resetPassword } from "../services/axios";
import Button from "../components/Button";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setToken(params.get("token") || "");
  }, [location.search]);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const [values, setValues] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!values.password) {
      setError("Password is required");
      return;
    }

    if (values.password.length < 8) {
      setError("Password must contain at least 8 characters");
      return;
    }

    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const hasUppercase = /[A-Z]/.test(values.password);
    if (!hasUppercase) {
      setError("Password must contain at least one uppercase character");
      return;
    }

    const hasNumber = /\d/.test(values.password);
    if (!hasNumber) {
      setError("Password must contain at least 1 number");
      return;
    }

    try {
      await resetPassword(token, values.password);

      alert("Password changed successfully");

      navigate("/login");
    } catch (err) {
      setError(err.userMessage || "Unable to reset password");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Reset Password</h2>

        <form onSubmit={handleSubmit}>
          <label>New Password</label>

          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              value={values.password}
              onChange={(e) =>
                setValues({
                  ...values,
                  password: e.target.value,
                })
              }
            />

            <Button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </Button>
          </div>

          <label>Confirm Password</label>

          <div className="password-box">
            <input
              type={showConfirm ? "text" : "password"}
              value={values.confirmPassword}
              onChange={(e) =>
                setValues({
                  ...values,
                  confirmPassword: e.target.value,
                })
              }
            />

            <Button type="button" onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </Button>
          </div>

          {error && <p className="error">{error}</p>}

          <Button className="btn-primary">Reset Password</Button>
        </form>
      </div>
    </div>
  );
}
