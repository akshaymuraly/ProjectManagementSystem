import React, { useState } from "react";
import styles from "./Dashboard.module.css";
import ProjectManager from "./ProjectManager";
import TeamLeader from "./TeamLeader/TeamLeader";
import { useSelector } from "react-redux";
import TaskList from "../Components/TaskList";

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const isRole = useSelector(state=>state.user.userInfo.role)

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        if(isRole==="ProjectManager"||isRole==="TeamLeader"){
            return <ProjectManager showAddProject={true} showAddTask={true} showEditTask={true} showEditProject={true}/>;
        }else{
          return <TaskList/>;
        }
      case "teamLeaderReports":
        return <TeamLeader/>
      default:
        return <div>Select a menu to display content</div>;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <button
          className={`${styles.navButton} ${
            activeMenu === "dashboard" ? styles.activeButton : ""
          }`}
          onClick={() => setActiveMenu("dashboard")}
        >
          Dashboard
        </button>
        {  isRole==="ProjectManager"?
        <>
          <button
            className={`${styles.navButton} ${
              activeMenu === "teamLeaderReports" ? styles.activeButton : ""
            }`}
            onClick={() => setActiveMenu("teamLeaderReports")}
          >
            Team Reports
          </button>
        </>
          :null
        }
      </div>

      <div className={styles.contentContainer}>{renderContent()}</div>
    </div>
  );
};

export default Dashboard;