import React, { useEffect, useState } from "react";
import styles from "../Common/ProjectManager.module.css"
import { useSelector } from "react-redux";
import axios from "axios";
axios.defaults.withCredentials=true


const AddTasks = ({status,setStatus,isRole}) => {
    const [availableMembers,setAvailableMembers]=useState(null)
    const [projects,setProjects] =useState(null)
    const [addTask,setAddTask] = useState(null)

   function onChangeHandlerTask(e){
    setAddTask(prev=>({
      ...prev,
      [e.target.name]:e.target.value
    }))
  }
   async function onTaskAddSubmit(){
    try{
        setStatus(prev=>({
          ...prev,
          loading:true
        }))
        const res = await axios.post("/api/task/add",addTask,{withCredentials:true})
        if(res.data.status){
          setStatus(prev=>({...prev,addTaskStatus:res.data.message}))
        }
      }catch(err){
        const {response}=err
        setStatus(prev=>({
          ...prev,
          addTaskStatus:response.data.message
        }))
      }
      finally{
        setStatus(prev=>({
          ...prev,
          loading:false
        }))
      }
  }

   useEffect(()=>{
    async function getAllProjects(){
      try{
        const res = await axios.get("/api/projectManager/project/get-all-projects",{withCredentials:true})
        console.log(res.data)
        if(res.data.status){
          setProjects(res.data.projects)
          setAvailableMembers(res.data.projects[0].Members)
          let initialPayload = {
            Project:res.data.projects[0]._id,
          }
          if(res.data.projects[0].Members.length){
            initialPayload["TeamMembers"]=res.data.projects[0].Members[0]._id
          }
          setAddTask(initialPayload)
        }
      }catch(err){
        console.log(err)
      }
    }
    if(isRole==="ProjectManager"||"TeamLeader"){
      getAllProjects()
    }
  },[])
  useEffect(()=>{
    console.log(status)
  },[status])

  return (
   <div className={styles.segment}>
          <h2>Add Task</h2>
          <form className={styles.form}>
            <div className={styles.formGroup}>
              <label>Project</label>
              <select name="Project" onChange={(e)=>{
                const memb = projects.find(item=>item._id===e.target.value).Members
                setAvailableMembers(memb)
                if(memb.length){
                  setAddTask(prev=>({...prev,TeamMembers:memb[0]._id}))
                }
                onChangeHandlerTask(e)
              }}>
                {projects&&projects.map((project, index) => (
                  <option key={index} value={project._id}>
                    {project.ProjectName}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Task Name</label>
              <input type="text" placeholder="Enter task name" name="Task" onChange={onChangeHandlerTask}/>
            </div>
            <div className={styles.formGroup}>
              <label>Members</label>
              <select name="TeamMembers" onChange={onChangeHandlerTask}>
                {availableMembers&&availableMembers.map((member, index) => 
                  (
                  <option key={index} value={member._id}>
                    {member.Email}
                  </option>
                )
                )}
              </select>
            </div>
            <button type="button" onClick={onTaskAddSubmit} disabled={status.loading}>Add Task</button>
            {status.addTaskStatus && <p className={styles.errorMessage}>{status.addTaskStatus}</p>}
          </form>
        </div>
  )
}

export default AddTasks