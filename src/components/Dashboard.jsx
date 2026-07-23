import React from "react";
import NavBar from "./Navbar";

function Dashboard() {
  return (
    <>
      {/* <NavBar></NavBar> */}
      <div className="dashboard-card">
        <h3>Today's Tasks</h3>

        <div className="task completed">✔ Design Login Page</div>

        <div className="task">○ API Integration</div>

        <div className="task completed">✔ Authentication</div>

        <div className="task">○ Testing</div>

        <div className="progress">
          <div className="progress-header">
            <span>Progress</span>
            <span>75%</span>
          </div>

          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
