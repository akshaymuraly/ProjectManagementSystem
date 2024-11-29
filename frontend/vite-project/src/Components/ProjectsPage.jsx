import React, { useEffect, useState } from "react";
import styles from "./ProjectsPage.module.css";
import axios from "axios";
axios.defaults.withCredentials=true

const ProjectsPage = ({members,isRole}) => {
    const [projects,setProjects] = useState(null)
    const [MemberId,setMemberId] = useState({MemberId:""})
     async function addUser(projectId){
         try{
            const res = await axios.post(`/api/projectManager/project/add-member/${projectId}`,MemberId,{withCredentials:true})
            if(res.data.status){
                const updatedProject = res.data.project; // Contains updated Members array
                setProjects((prevProjects) =>
                prevProjects.map((project) =>
                    project._id === projectId
                        ? { ...project, Members: updatedProject.Members } // Update only Members
                        : project
                )
            );
            }
        }catch(err){
            console.log(err)
        }
    }
    async function deleteMemberFromProject(projectId,memberId){
        try{
            const res = await axios.delete(`/api/projectManager/project/remove-member/${projectId}/${memberId}`,{withCredentials:true})
            if(res.data.status){
                if(projects){
                  const updatedProject = res.data.project; // Contains updated Members array
              setProjects((prevProjects) =>
                prevProjects.map((project) =>
                    project._id === projectId
                        ? { ...project, Members: updatedProject.Members } // Update only Members
                        : project
                )
            );
                }
            }
        }catch(err){
            console.log(err)
        }
    }
    async function deleteProject(projectId){
        try{
            const res = await axios.delete(`/api/projectManager/project/delete-project/${projectId}`,{withCredentials:true})
            if(res.data.status){
                setProjects(prev=>prev.filter(item=>item._id!==res.data.project._id))
            }
        }catch(err){
            console.log(err)
        }
    }
    useEffect(()=>{
        async function getAllProjects(){
        try{
            const res = await axios.get("/api/projectManager/project/get-all-projects",{withCredentials:true})
            if(res.data.status){
                setProjects(res.data.projects)
            }
        }catch(err){
            console.log(err)
        }
    }
    getAllProjects()
    },[])

  return (
    <div className={styles.segment}>
      <h2>Projects Overview</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Details</th>
            <th>Members</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {projects&&projects.map((project) => (
            <tr key={project._id}>
              <td>{project.ProjectName}</td>
              <td>{project.ProjectDetails}</td>
              <td className={styles.scrollableCell}>
                {project.Members.length > 0 ? (
            project.Members.map((member) => (
              <div key={member._id} className={styles.memberRow}>
                {member.Email}
                <button onClick={() => deleteMemberFromProject(project._id, member._id)}>
                  Delete
                </button>
              </div>
            ))
          ) : (
            <div>No Members Found</div>
          )}
                 {isRole==="ProjectManager"&&<div className={styles.dropdownRow}>
                  <select
                  name="MemberId"
                   onChange={(e)=>setMemberId({[e.target.name]:e.target.value})}
                  >
                    <option value="">Select User</option>
                    {members&&members.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.Email}
                      </option>
                    ))}
                  </select>
                  <button onClick={()=>addUser(project._id)}>Add</button>
                </div>}
              </td>
               <td>
                <button onClick={()=>deleteProject(project._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectsPage;