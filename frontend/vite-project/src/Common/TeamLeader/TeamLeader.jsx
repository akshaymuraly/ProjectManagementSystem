import React, { useEffect, useState } from "react";
import styles from "./TeamLeader.module.css";
import axios from "axios";
axios.defaults.withCredentials = true;

const TeamLeader = () => {
  const [users, setUsers] = useState(null);
  const [payload, setPayload] = useState({});

  useEffect(() => {
    async function getAllUsers() {
      try {
        const res = await axios.get("/api/user/all-users", { withCredentials: true });
        if (res.data.status) {
          setUsers(res.data.users);
        }
      } catch (err) {
        console.log(err);
      }
    }
    getAllUsers();
  }, []);

  function onChangeHandler(e, userId) {
    const { value } = e.target;
    setPayload({ userId, newEmail: value }); 
  }

  async function onSave() {
    if (!payload.userId || !payload.newEmail) {
      return;
    }
    try {
      const res = await axios.put("/api/user/edit", payload, { withCredentials: true });
      if (res.data.status) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === payload.userId ? { ...user, Email: payload.newEmail } : user
          )
        );
        setPayload({}); 
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function onDelete(userId) {
    try {
      const res = await axios.delete("/api/user/delete", {
        data: { userId },
        withCredentials: true,
      });
      if (res.data.status) {
        setUsers((prev) => prev.filter((user) => user._id !== userId));
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={styles.container}>
      <h2>User Details</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((user) => (
              <tr key={user._id}>
                <td>
                  <input
                    type="text"
                    value={payload.userId === user._id ? payload.newEmail : user.Email}
                    onChange={(e) => onChangeHandler(e, user._id)}
                  />
                </td>
                <td>
                  <button
                    className={styles.editButton}
                    onClick={onSave}
                    disabled={payload.userId !== user._id}
                  >
                    Save
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => onDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamLeader;
