import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../css/Header.css";
import { AuthContext } from "../contexts/AuthContext";

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const currentUser = user?.data?.user || user?.user || user;
  const isAdmin = currentUser?.role === "Admin";

  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/Login");
  };
  return (
    <div className="navbar">
      <div className="navbar-brand">
        <NavLink to="/">Task Management</NavLink>
      </div>
      <div className="navbar-links">
        <NavLink className="nav-link" to="/home">
          Home
        </NavLink>
        {isAdmin && (
          <>
            <NavLink className="nav-link" to="/users">
              Users
            </NavLink>
          </>
        )}
        <NavLink className="nav-link" to="/tasks">
          Tasks
        </NavLink>
        <NavLink className="nav-link" to="/login" onClick={handleLogout}>
          Logout
        </NavLink>
      </div>
    </div>
  );
};

export default NavBar;
