import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.scss";
import PredictiveText from "./PredictiveText";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleSelection = (path) => {
    navigate(path);
    window.location.reload();
  };

  return (
    <>
    <div id="threejs-canvas"></div>
    <div className="dashboard-main">
      <div className="cards-container">
        <PredictiveText />
      </div>
    </div>
    </>
  );
};

export default Dashboard;
