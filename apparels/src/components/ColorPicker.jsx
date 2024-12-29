import React from "react";
import { CirclePicker } from "react-color";
import { useSnapshot } from "valtio";
import state from "../store";
import { updateUrl } from "../App"

const ColorPicker = ({setActiveEditorTab}) => {
  const snap = useSnapshot(state);
  return (
    <div className="absolute left-full ml-3" style={{
      background: "white",
      padding: "1rem",
      borderRadius: "1.5rem"
    }}>
      <CirclePicker
        color={snap.color[snap.selectedApparel.split('-')[0]]}
        disableAlpha
        onChange={(color) => {state.color[snap.selectedApparel.split('-')[0]] = color.hex; setActiveEditorTab(""); updateUrl()}}
        colors={[
          {
            color: "#2f344a",
            title: "blue"
          },
          {
            color: "#cac8c2",
            title: "white/gray"
          },
          {
            color: "#772522",
            title: "red"
          },
          {
            color: "#2c2c2c",
            title: "black"
          },
          {
            color: "#cf9583",
            title: "swirl"
          }
        ].map(value=>value.color)}
      />
    </div>
  );
};

export default ColorPicker;
