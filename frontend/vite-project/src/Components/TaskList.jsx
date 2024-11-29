import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./TaskList.module.css";

axios.defaults.withCredentials = true;

const TaskList = () => {
  const [tasks, setTasks] = useState(null);
  const [payload, setPayload] = useState({}); 

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await axios.get("/api/task/user", { withCredentials: true });
        if (res.data.status) {
          setTasks(res.data.tasks);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchTasks();
  }, []);

  function onChangeHandler(e, taskId) {
    const { value } = e.target;
    setPayload({ taskId, newStatus: value }); 
  }

  async function onSave() {
    if (!payload.taskId || !payload.newStatus) {
      return;
    }
    try {
      const res = await axios.put(
        `/api/task/update-status/${payload.taskId}`, 
        { status: payload.newStatus }, 
        { withCredentials: true }
      );
      if (res.data.status) {

        setTasks((prev) =>
          prev.map((task) =>
            task._id === payload.taskId ? { ...task, Status: payload.newStatus } : task
          )
        );
        
        setPayload({}); 
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={styles.container}>
      <h2>My Tasks</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Task</th>
            <th>Current Status</th> 
            <th>Update Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks ?
            tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.Task}</td>
                <td>{task.Status}</td>
                <td>
                  <select
                    value={payload.taskId === task._id ? payload.newStatus : task.status}
                    onChange={(e) => onChangeHandler(e, task._id)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td>
                  <button
                    className={styles.saveButton}
                    onClick={onSave}
                    disabled={payload.taskId !== task._id} 
                  >
                    Save
                  </button>
                </td>
              </tr>
            )):<tr>No tasks available</tr>}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
