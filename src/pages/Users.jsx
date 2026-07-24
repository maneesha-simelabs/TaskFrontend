import { useState } from "react";
import "../css/Users.css";
import { useEffect } from "react";
import { getUsers } from "../services/axios";

export default function Users({}) {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const controller = new AbortController();
    const fetchUsers = async () => {
      try {
        const results = await getUsers(controller.signal);
        setUsers(results);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);
  return (
    <section className="users-section">
      <h2>Team Members</h2>

      <div className="users-grid">
        {users?.map((user) => (
          <article className="user-card" key={user._id}>
            {/* <img
              src={user.avatar || "https://via.placeholder.com/120"}
              alt={user.name}
              className="user-avatar"
            /> */}

            <h3>{user.name}</h3>

            <p>{user.email}</p>

            <span
              className={`role ${user.role === "Admin" ? "admin" : "user"}`}
            >
              {user.role}
            </span>

            <button className="view-btn">View Profile</button>
          </article>
        ))}
      </div>
    </section>
  );
}
