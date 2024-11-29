import React, { useEffect, useState } from "react";
import styles from "./TaskPage.module.css";
import axios from "axios";
axios.defaults.withCredentials=true

const TasksPage = () => {
  const [tasks,setTasks]= useState(null)
  const[MemberId,setMemberId] = useState(null)

  async function addUser(taskId){
         try{
            const res = await axios.post(`/api/task/add-member/${taskId}`,MemberId,{withCredentials:true})
            if(res.data.status){
                const updatedTask = res.data.task;
                setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === updatedTask._id
                        ? { ...task, TeamMembers: updatedTask.TeamMembers }
                        : task
                )
            );
            }
        }catch(err){
            console.log(err)
        }
    }
    async function deleteMemberFromTask(taskId,memberId){
        try{
            const res = await axios.delete(`/api/task/remove-member/${taskId}/${memberId}`,{withCredentials:true})
            if(res.data.status){
                  const updatedTask = res.data.task;
              setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === taskId
                        ? { ...task, TeamMembers: updatedTask.TeamMembers }
                        : task
                )
            );
            }
        }catch(err){
            console.log(err)
        }
    }

    async function deleteProject(taskId){
        try{
            const res = await axios.delete(`/api/task/delete-task/${taskId}`,{withCredentials:true})
            if(res.data.status){
                setTasks(prev=>prev.filter(item=>item._id!==taskId))
            }
        }catch(err){
            console.log(err)
        }
    }

   useEffect(()=>{
        async function getAllProjects(){
        try{
            const res = await axios.get("/api/task/get-all-tasks",{withCredentials:true})
            if(res.data.status){
                setTasks(res.data.tasks)
            }
        }catch(err){
            console.log(err)
        }
    }
    getAllProjects()
    },[])

  return (
    <div className={styles.segment}>
      <h2>Tasks Overview</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Project</th>
            <th>Members</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks&&tasks.map((task) => (
            <tr key={task._id}>
              <td>{task.Task}</td>
              <td>{task.Project.ProjectName}</td>
              <td className={styles.scrollableCell}>
                {task.TeamMembers.length > 0 ? (
            task.TeamMembers.map((member) => (
              <div key={member._id} className={styles.memberRow}>
                {member.Email}
                <button onClick={()=>deleteMemberFromTask(task._id,member._id)}>
                  Delete
                </button>
              </div>
            ))
          ) : (
            <div>No Members Found</div>
          )}
                <div className={styles.dropdownRow}>
                  <select
                  name="MemberId"
                   onChange={(e)=>setMemberId({[e.target.name]:e.target.value})}
                  >
                    <option value="">Select User</option>
                    {task.Project&&task.Project.Members.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.Email}
                      </option>
                    ))}
                  </select>
                  <button onClick={()=>addUser(task._id)}>Add</button>
                </div>
              </td>
              <td>
                <button onClick={()=>deleteProject(task._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TasksPage;
