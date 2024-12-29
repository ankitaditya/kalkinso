import React from "react";

import CustomButton from "./CustomButton";
import { useSnapshot } from "valtio";
import state from "../store";
import { updateUrl } from "../App";

const FilePicker = ({ file, setFile, readFile, setActiveEditorTab }) => {
  const snap = useSnapshot(state)
  const styles = [
 "./styles/1B_025.png",                              "./styles/I_008.png",                               "./styles/Picsart_24-12-25_18-34-59-490.png",
 "./styles/1E_016.png",                              "./styles/I_027.png",                               "./styles/Picsart_24-12-25_19-05-28-594.png",
 "./styles/A_024.png",                               "./styles/P_005.png",                               "./styles/Picsart_24-12-25_19-08-26-881.png",
 "./styles/F_008.png",                               "./styles/P_089.png",                               "./styles/Picsart_24-12-25_19-12-06-351.png",
 "./styles/F_039.png",                               "./styles/P_106.png",                               "./styles/Picsart_24-12-25_19-16-58-200.png",
 "./kalkinso.png"
  ]

  return (
    <div className="filepicker-container">
      {
        styles.map(imgs=><div onClick={()=>{
          state.logoDecal = imgs
          state.baseDecal = imgs
          state.fullDecal = imgs
          setActiveEditorTab("")
          updateUrl()
        }} className="image flex-1 flex flex-col">
          <img src={imgs} />
        </div>)
      }
    </div>
  );
};

export default FilePicker;
