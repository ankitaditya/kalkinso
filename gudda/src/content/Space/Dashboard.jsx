import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.scss";

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
        <div className="card" onClick={() => handleSelection("/feed")}>
          <h3>Social Media</h3>
          <p>View social media updates tailored to your preferences.</p>
        </div>
        <div className="card" onClick={() => handleSelection("/live")}>
          <h3>Live Stream</h3>
          <p>Watch live streams curated for your interests.</p>
        </div>
        <div className="card" onClick={() => handleSelection("/search")}>
          <h3>Work</h3>
          <p>Explore work opportunities in your local area.</p>
        </div>
        <div className="card" onClick={() => handleSelection("/release")}>
          <h3>Hot Topics</h3>
          <p>Explore Hot Topics in your local area.</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Dashboard;
