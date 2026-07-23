import { useNavigate } from "react-router-dom";
import "../css/Home.css";
import { FaTasks, FaUsers, FaChartLine, FaCalendarAlt } from "react-icons/fa";

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">🚀 Organize • Prioritize • Achieve</span>

          <h1>
            Manage Your Work
            <span> Smarter.</span>
          </h1>

          <p>
            TaskFlow helps individuals and teams organize work, track progress,
            collaborate seamlessly, and complete projects on time.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary">Get Started</button>

            <button
              className="btn-secondary"
              onClick={() => {
                navigate("login");
              }}
            >
              Login
            </button>
          </div>

          <div className="hero-stats">
            <div>
              <h2>12K+</h2>
              <span>Users</span>
            </div>

            <div>
              <h2>250K+</h2>
              <span>Tasks</span>
            </div>

            <div>
              <h2>98%</h2>
              <span>Success</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-header">
            <h3>Today's Tasks</h3>

            <span className="status">Active</span>
          </div>

          <div className="task completed">✔ Authentication Module</div>

          <div className="task">○ Graph Dashboard UI</div>

          <div className="task completed">✔ Login Page</div>

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

          <div className="analytics">
            <div className="card">
              <FaTasks />
              <h4>24</h4>
              <p>Pending</p>
            </div>

            <div className="card">
              <FaUsers />
              <h4>8</h4>
              <p>Members</p>
            </div>

            <div className="card">
              <FaChartLine />
              <h4>92%</h4>
              <p>Efficiency</p>
            </div>

            <div className="card">
              <FaCalendarAlt />
              <h4>12</h4>
              <p>Meetings</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// import React from "react";
// import {
//   FaTasks,
//   FaCalendarAlt,
//   FaChartBar,
//   FaUsers,
//   FaBell,
//   FaShieldAlt,
// } from "react-icons/fa";

// function home() {
//   return <div>home</div>;
// }

// export default home;
