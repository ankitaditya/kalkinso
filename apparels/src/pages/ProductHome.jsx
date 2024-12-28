import { motion, AnimatePresence } from "framer-motion";
import { useSnapshot } from "valtio";
import {
  headContainerAnimation,
  headContentAnimation,
  headTextAnimation,
  slideAnimation,
} from "../config/motion";
import { Tab, CustomButton } from "../components";
import state from "../store/index";
import "primereact/resources/primereact.min.css";
import { MultiStateCheckbox } from 'primereact/multistatecheckbox';
import { FilterTabs, SizeTabs } from "../config/constants";
import { useState } from "react";
import { RadioButton } from "primereact/radiobutton";
import Tab2 from "../components/Tab2";



const ProductHome = () => {
  const snap = useSnapshot(state);
  const [value, setValue] = useState('M');
  const prices = {
    shirt: 560,
    tsports: 800,
    hoodie: 899,
    jeans: 2000,
  }
  const descriptions = {
    shirt: 'Elevate your wardrobe with our classic shirt, tailored for a perfect fit and crafted with premium, breathable fabric. Ideal for both formal and casual occasions, this shirt ensures you stay stylish and comfortable all day.',
    tsports: 'Stay cool and comfortable in our sports tee, designed to keep you dry and fresh during your workout. Made with moisture-wicking fabric, this tee is perfect for all your fitness activities.',
    hoodie: 'Stay warm and cozy in our stylish hoodie, designed to keep you comfortable in all weather conditions. Made with premium fabric, this hoodie is perfect for casual outings and everyday wear.',
    jeans: 'Add a touch of style to your wardrobe with our classic jeans, designed for a perfect fit and crafted with durable denim fabric. Ideal for casual and semi-formal occasions, these jeans are a versatile addition to your collection.',
  }
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: false,
    baseShirt: true,
  });
  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        state.isFullTexture = false;
        state.isBaseTexture = false;
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName];
        state.isLogoTexture = false;
        state.isBaseTexture = false;
        break;
      case "baseShirt":
          state.isBaseTexture = !activeFilterTab[tabName];
          state.isLogoTexture = false;
          state.isFullTexture = false;
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
  return !snap.buy&&(
    <AnimatePresence>
      {snap.intro && (
        <motion.section className="home">
          <motion.header>
            <img
              src="./kalkinso.png"
              alt="logo"
              className="w-24 h-24 object-contain"
            ></img>
          </motion.header>

          <motion.div className="home-content">
            <motion.div>
              <h1 className="head-text">
                {snap.selectedApparel.split('-')[0].slice(0,1).toLocaleUpperCase()+snap.selectedApparel.split('-')[0].slice(1).toLocaleLowerCase()}
              </h1>
            </motion.div>
            <motion.div
              className="flex flex-col gap-5"
            >
            <ul className="mt-4 text-gray-600 text-sm">
                <li><strong>Price:</strong> Starting at ₹ {prices[snap.selectedApparel.split('-')[0]]}</li>
                <li><strong>Key Features:</strong></li>
                <p style={{maxWidth:"40rem"}}>
                {descriptions[snap.selectedApparel.split('-')[0]]}
                </p>
            </ul>
              <CustomButton
                type="filled"
                title="Buy"
                disabled={!value}
                handleClick={() => {
                  state.intro = false;
                }}
                customStyles="w-fit px-4 py-2.5 font-bold text-sm"
              ></CustomButton>
            </motion.div>
          </motion.div>
        </motion.section>
      )}
          {snap.intro&&<motion.div
            key="custom"
            className="absolute top-0 right-0 z-10"
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {SizeTabs.map((tab) => (
                  <Tab2
                    key={tab.name}
                    tab={tab}
                    selectedSize={value}
                    handleClick={() => {setValue(tab.name)}}
                  />
                ))}
              </div>
            </div>
          </motion.div>}
    </AnimatePresence>
  );
};

export default ProductHome;
