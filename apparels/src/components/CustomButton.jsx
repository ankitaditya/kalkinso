import React from "react";
import { useSnapshot } from "valtio";
import state from "../store";
import { getContrastingColor } from "../config/helpers";

const CustomButton = ({ type, title, customStyles, style, handleClick, disabled }) => {
  const snap = useSnapshot(state);
  const generateStyle = (type) => {
    if (type === "filled") {
      return {
        backgroundColor: snap.color[snap.selectedApparel.includes('shirt')?'shirt':'hoodie'],
        color: getContrastingColor(snap.color[snap.selectedApparel.includes('shirt')?'shirt':'hoodie']),
      };
    } else if (type === "outline") {
      return {
        borderWidth: "1px",
        borderColor: snap.color[snap.selectedApparel.includes('shirt')?'shirt':'hoodie'],
        color: snap.color[snap.selectedApparel.includes('shirt')?'shirt':'hoodie'],
      };
    }
  };
  return (
    <button
      className={`px-2 py-1.5 flex-1 rounded-md ${customStyles}`}
      style={{...generateStyle(type), ...style}}
      onClick={handleClick}
      disabled={disabled}
    >
      {title}
    </button>
  );
};

export default CustomButton;
