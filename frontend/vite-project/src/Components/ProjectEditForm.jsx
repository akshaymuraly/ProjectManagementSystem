import React, { useEffect, useState } from "react";
import styles from "./ProjectEditForm.module.css";
import axios from "axios";
axios.defaults.withCredentials=true

const ProjectEditForm = () => {
  const [projects,setProjects] = useState([])
  const [projectId,setProjectId] = useState(null)
  const [status,setStatus]=useState({
    message:null,
    loading:false
  })

  const [formData, setFormData] = useState({
 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async() => {
    try{
        setStatus(prev=>({...prev,loading:true}))
        const res = await axios.put(`/api/projectManager/project/edit-project/${projectId}`,{Payload:formData},{withCredentials:true})
        if(res.data.status){
          setProjects(prev=>prev.map(item=>{
            if(item._id===projectId){
              return res.data.project
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

  useEffect(()=>{
    async function getAllProjects(){
      try{
        const res = await axios.get("/api/projectManager/project/get-all-projects",{withCredentials:true})
        console.log("dt",res.data)
        if(res.data.status){
          setProjects(res.data.projects)
          setProjectId(res.data.projects[0]._id)
        }
      }catch(err){
        console.log(err)
      }
    }
    getAllProjects()
  },[])

  return (
    <div className={styles.formContainer}>
      <h2>Edit Project</h2>
      <div className={styles.formGroup}>
        <select name="ProjectId" onChange={(e)=>{
                setProjectId(e.target.value)
              }}>
                {projects.length>0?projects.map((project, index) => (
                  <option key={index} value={project._id}>
                    {project.ProjectName}
                  </option>)):<option>No projects found</option>
                }
              </select>
        <label htmlFor="name" className={styles.label}>
          Project Name
        </label>
        <input
          type="text"
          id="name"
          name="ProjectName"
          onChange={handleChange}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="details" className={styles.label}>
          Project Details
        </label>
        <textarea
          id="details"
          name="ProjectDetails"
          onChange={handleChange}
          className={styles.textarea}
          rows="5"
        ></textarea>
      </div>
      <div className={styles.buttonRow}>
        <button onClick={handleSave} disabled={status.loading}>{status.loading?"Loading...":"Save"}</button>
      </div>
      {status.message&&<p className={styles.errorMessage}>{status.message}</p>}
    </div>
  );
};

export default ProjectEditForm;
