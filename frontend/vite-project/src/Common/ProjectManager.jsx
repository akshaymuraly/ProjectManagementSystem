import React, { useEffect, useState } from "react";
import styles from "./ProjectManager.module.css";
import { useSelector } from "react-redux";
import axios from "axios";
import AddTasks from "../Components/AddTasks";
import ProjectsPage from "../Components/ProjectsPage";
import TasksPage from "../Components/TaskPage";
import ProjectEditForm from "../Components/ProjectEditForm";
import TaskEditForm from "../Components/TaskEditForm";
axios.defaults.withCredentials=true

const ProjectManager = ({ showAddProject, showAddTask,showEditTask,showEditProject }) => {
  const isRole = useSelector(state=>state.user.userInfo.role)
  const [status,setStatus] = useState({
    loading:false,
    addProjectStatus:null,
    addTaskStatus:null
  })
  const [members,setMembers] = useState([])
  const [addProject,setAddProject] = useState({
    ProjectName:"",
    ProjectDetails:""
  })

  function onChangeHandlerPRoject(e){
    setAddProject(prev=>({
      ...prev,
      [e.target.name]:e.target.value
    }))
  }

  async function onProjectAddSubmit(){
    try{
        setStatus(prev=>({
          ...prev,
          loading:true
        }))
        const res = await axios.post("/api/projectManager/project/add",addProject,{withCredentials:true})
        if(res.data.status){
          setStatus(prev=>({...prev,addProjectStatus:res.data.message}))
        }
      }catch(err){
        const {response}=err
        setStatus(prev=>({
          ...prev,
          addProjectStatus:response.data.message
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
    async function getMembers(){
      try{
        const res = await axios.get("/api/user/all-members",{withCredentials:true})
        if(res.data.status){
          setMembers(res.data.data)
          setAddProject(prev=>({
            ...prev,
          Members:res.data.data[0]._id
          }))
          
        }
      }catch(err){
        console.log(err)
      }
    }
  
    if(isRole==="ProjectManager"){
        getMembers()
    }
  },[])

  return (
    <div className={styles.container}>
      {/* Segment 1: Add Project Form */}
      {showAddProject && (
        <div className={styles.segment}>
          <h2>Add Project</h2>
          <form className={styles.form}>
            <div className={styles.formGroup}>
              <label>Project Name</label>
              <input type="text" placeholder="Enter project name" name="ProjectName" onChange={(e)=>onChangeHandlerPRoject(e)}/>
            </div>
            <div className={styles.formGroup}>
              <label>Project Details</label>
              <textarea placeholder="Enter project details" name="ProjectDetails"onChange={onChangeHandlerPRoject}></textarea>
            </div>
            {
              isRole==="ProjectManager"?
              <div className={styles.formGroup}>
              <label>Members</label>
              <select name="Members" onChange={(e)=>onChangeHandlerPRoject(e)}>
                {members.length?members.map((member, index) => (
                  <option key={index} value={member._id}>
                    {member.Email}
                  </option>
                )):<option disabled>No members</option>}
              </select>
            </div>
            :null
            }
            <button type="button" onClick={onProjectAddSubmit} disabled={status.loading}>Add Project</button>
             {status.addProjectStatus && <p className={styles.errorMessage}>{status.addProjectStatus}</p>}
          </form>
        </div>
      )}

      {/* Segment 2: Add Task Form */}

      {showAddTask && <AddTasks status={status} setStatus={setStatus} isRole={isRole}/>}

      {/* Segment 3: Projects Table */}
      <ProjectsPage members={members} isRole={isRole}/>
      <TasksPage/>
      {showEditProject&&<ProjectEditForm/>}
      {showEditTask&&<TaskEditForm/>}
    </div>
  );
};

export default ProjectManager;