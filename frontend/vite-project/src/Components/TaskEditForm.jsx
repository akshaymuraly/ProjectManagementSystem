import React, { useEffect, useState } from "react";
import styles from "./TaskEditForm.module.css";
import axios from "axios";
axios.defaults.withCredentials=true

const TaskEditForm = () => {

  const [tasks, setTasks] = useState([]);
  const [payload,setPayload]=useState({})
  const [taskId,setTaskId]=useState(null)
  const [status,setStatus]=useState({
    message:null,
    loading:false
  })
  useEffect(()=>{
    async function getAllTasks(){
        try{
            const res = await axios.get("/api/task/get-all-tasks",{withCredentials:true})
            if(res.data.status){
                setTasks(res.data.tasks)
                setTaskId(res.data.tasks[0]._id)
            }
        }catch(err){
            console.log(err)
        }
    }
    getAllTasks()
  },[])
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
   const handleSave = async() => {
    try{
        setStatus(prev=>({...prev,loading:true}))
        const res = await axios.put(`/api/task/edit-task/${taskId}`,payload,{withCredentials:true})
        if(res.data.status){
          setTasks(prev=>prev.map(item=>{
            if(item._id===taskId){
              return res.data.task
            }
            return item
          }
          ))
        }
      }catch(err){
        const{response}=err
        setStatus(prev=>({...prev,message:response.data.message}))
      }
      finally{
        setStatus(prev=>({...prev,loading:false}))
      }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Edit Task</h2>
      <div className={styles.formGroup}>
        <select name="TaskId" onChange={(e)=>{
                setTaskId(e.target.value)
              }}>
                {tasks.length>0?tasks.map((task, index) => (
                  <option key={index} value={task._id}>
                    {task.Task}
                  </option>)):<option>No tasks found</option>
                }
              </select>
        <label htmlFor="taskName" className={styles.label}>
          Task Name
        </label>
        <input
          type="text"
          id="taskName"
          name="Task"
          className={styles.input}
          onChange={handleChange}
        />
      </div>
      <div className={styles.buttonRow}>
        <button onClick={handleSave} disabled={status.loading}>Save</button>
      </div>
    </div>
  );
};

export default TaskEditForm;
