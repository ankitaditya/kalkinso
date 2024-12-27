import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";

import config from "../config/config";
import state from "../store";
import { download, shopping } from "../assets";
import { downloadCanvasToImage, reader } from "../config/helpers";
import { EditorTabs, FilterTabs, DecalTypes, SizeTabs } from "../config/constants";
import { fadeAnimation, slideAnimation } from "../config/motion";
import {
  AIPicker,
  ColorPicker,
  CustomButton,
  FilePicker,
  Tab,
} from "../components";
import Tab2 from "../components/Tab2";
import Buy from "./Buy";
import { useCart } from "./Cart/cart-context";
import CustomShirt from "../canvas/CommonCustomT";
import { CommonCustomHoodie } from "../canvas/CommonCustomHoodie";

const Customizer = ({setItems, items}) => {
  const snap = useSnapshot(state);
  const { addProduct } = useCart();
  const [size, setSize] = useState('M');
  const productFormat = {
    shirt: {
      id: 'shirt-1',
      sku: items[0].icon(),
      title: "Shirt",
      description: "Elevate your wardrobe with our classic shirt, tailored for a perfect fit and crafted with premium, breathable fabric. Ideal for both formal and casual occasions, this shirt ensures you stay stylish and comfortable all day.",
      availableSizes: [size],
      style: 'Quality',
      price: 560,
      color: snap.color['shirt'],
      isLogoTexture: snap.isLogoTexture,
      isBaseTexture: snap.isBaseTexture,
      texture: snap.baseDecal,
      installments: '1',
      currencyId: 'INR',
      currencyFormat: '₹',
      isFreeShipping: false,
      quantity: 1
    },
    hoodie: {
      id: 'hoodie-1',
      sku: items[1].icon(),
      title: "Hoodie",
      description: "Stay warm and cozy in our stylish hoodie, designed to keep you comfortable in all weather conditions. Made with premium fabric, this hoodie is perfect for casual outings and everyday wear.",
      availableSizes: [size],
      style: 'Quality',
      price: 899,
      color: snap.color['hoodie'],
      isLogoTexture: snap.isLogoTexture,
      isBaseTexture: snap.isBaseTexture,
      texture: snap.baseDecal,
      installments: '1',
      currencyId: 'INR',
      currencyFormat: '₹',
      isFreeShipping: false,
      quantity: 1
    }
  }

  const [file, setFile] = useState("");

  const [prompt, setPrompt] = useState("");
  const [generatingImg, setGeneratingImg] = useState(false);

  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: false,
    baseShirt: true,
  });

  // show tab content depending on the activeTab
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
      case "filepicker":
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
      case "aipicker":
        return (
          <AIPicker
            prompt={prompt}
            setPrompt={setPrompt}
            generatingImg={generatingImg}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (type) => {
    if (!prompt) return alert("Please enter a prompt");

    try {
      setGeneratingImg(true);

      const response = await fetch('http://localhost:8080/api/v1/dalle', {
        method: 'POST',
        body: JSON.stringify({
          prompt
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })


      const data = await response.json();
      const imageFile = await fetch(`http://localhost:8080/api/v1/dalle/fetch-image?imageUrl=${encodeURIComponent(data.photo)}`);
      const fileUrl = await reader(await imageFile.blob());
      handleDecals(type, fileUrl);
    } catch (error) {
      alert(error);
    } finally {
      setGeneratingImg(false);
      setActiveEditorTab("");
    }
  };

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];

    state[decalType.stateProperty] = result;

    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab);
    }
  };

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName];
        break;
      case "baseShirt":
          state.isBaseTexture = !activeFilterTab[tabName];
          break;
      default:
        state.isLogoTexture = false;
        state.isFullTexture = false;
        state.isBaseTexture = true;
        break;
    }

    // after setting the state, activeFilterTab is updated

    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName],
      };
    });
  };

  const readFile = (type) => {
    reader(file).then((result) => {
      handleDecals(type, result);
      setActiveEditorTab("");
    });
  };

  return !snap.buy&&(
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation("left")}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => {if(activeEditorTab==""){setActiveEditorTab(tab.name); console.log("moose")}else{setActiveEditorTab("")}}}
                  />
                ))}

                {generateTabContent()}
              </div>
            </div>
          </motion.div>

          <motion.div
            key="custom"
            className="absolute top-0 right-0 z-10"
            {...slideAnimation("right")}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {SizeTabs.map((tab) => (
                  <Tab2
                    key={tab.name}
                    tab={tab}
                    selectedSize={size}
                    handleClick={() => {setSize(tab.name)}}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <div className="w-fit px-4 py-2.5 font-bold text-sm">
            <Buy />
            </div>
            <CustomButton
              type="filled"
              title="Go Back"
              handleClick={() => (state.intro = true)}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
              style={{
                position: "absolute",
                right: "88vw",
                top: "1rem",
                minWidth: "8rem"
              }}
            />
            <CustomButton
              type="filled"
              title="Add"
              handleClick={() => addProduct({...productFormat[snap.selectedApparel], title: productFormat[snap.selectedApparel].title + ` ${productFormat[snap.selectedApparel].texture.split('/').slice(-1)[0].replace('.png','')}`, id: `PROD-${productFormat[snap.selectedApparel].title.toLocaleUpperCase()}-${productFormat[snap.selectedApparel].availableSizes[0]}-${productFormat[snap.selectedApparel].color.replace('#','')}-${productFormat[snap.selectedApparel].texture}`, sku: (title)=> {if(title.toLocaleUpperCase()==="SHIRT"){return <CustomShirt texture={productFormat[snap.selectedApparel].texture} color={productFormat[snap.selectedApparel].color} />}else{<CommonCustomHoodie texture={productFormat[snap.selectedApparel].texture} color={productFormat[snap.selectedApparel].color} />}}})}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm mr-20"
            />
          </motion.div>

          <motion.div
            className="filtertabs-container"
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => handleActiveFilterTab(tab.name)}
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
