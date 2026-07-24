import { useState } from "react";
import "../css/Users.css";
import { useEffect } from "react";
import { getUsers } from "../services/axios";
import Card from "../components/Card";

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
        {users.map((user) => (
          <Card
            key={user._id}
            className="cd-card"
            title={user.name}
            actions={[
              <button key="view" className="view-btn">
                View Profile
              </button>,
            ]}
          >
            <p>{user.email}</p>
            <span
              className={`role-badge ${user.role === "Admin" ? "admin" : "user"}`}
            >
              {user.role}
            </span>
          </Card>
        ))}
      </div>
    </section>
  );
}

// {users?.map((user) => (
//   <article className="cd-card" key={user._id}>
//     {/* <img
//       src={user.avatar || "https://via.placeholder.com/120"}
//       alt={user.name}
//       className="user-avatar"
//     /> */}

//     <h3>{user.name}</h3>

//     <p>{user.email}</p>

//     <span
//       className={`role ${user.role === "Admin" ? "admin" : "user"}`}
//     >
//       {user.role}
//     </span>

//     <button className="view-btn">View Profile</button>
//   </article>
// ))}
