import React, { useContext } from "react";
import { Link, NavLink } from "react-router";
import "../css/Header.css";
import { AuthContext } from "../contexts/AuthContext";

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const currentUser = user?.data?.user || user?.user || user;
  const isAdmin = currentUser?.role === "Admin";

  const handleLogout = () => {
    logout();
  };
  return (
    <div className="navbar">
      <div className="navbar-brand">
        <NavLink to="/">Task Management</NavLink>
      </div>
      <div className="navbar-links">
        <NavLink className="nav-link" to="/">
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
        <NavLink className="nav-link" to="/Login" onClick={handleLogout}>
          Logout
        </NavLink>
      </div>
    </div>
  );
};

export default NavBar;
