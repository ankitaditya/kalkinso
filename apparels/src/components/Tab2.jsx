import React from "react";
import { useSnapshot } from "valtio";
import { FilterTabs } from "../config/constants";
import state from "../store";

const Tab2 = ({ tab, isFilterTab, isActiveTab, selectedSize, handleClick }) => {
  const snap = useSnapshot(state);
  const activeStyles = selectedSize===tab.name?{
    background: "white",
    borderRadius: "200%",
    width:"80%"
  }:{background: "none", width:"70%"};

  return (
    <div
      key={tab.name}
      className={`tab-btn ${
        isFilterTab ? "rounded-full glassmorphism" : "rounded-4"
      }`}
      onClick={handleClick}
      style={activeStyles}
    >
      <img
        src={tab.icon}
        alt={tab.name}
        style={{
          width: "70%"
        }}
        className={`${
          isFilterTab ? "w-2/3 h-2/3" : "w-11/112 h-11/12 object-contain"
        }`}
      ></img>
    </div>
  );
};

export default Tab2;
