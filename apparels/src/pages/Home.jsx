import { motion, AnimatePresence } from "framer-motion";
import { useSnapshot } from "valtio";
import {
  headContainerAnimation,
  headContentAnimation,
  headTextAnimation,
  slideAnimation,
} from "../config/motion";
import { CustomButton } from "../components";
import state from "../store/index";

const Home = () => {
  const snap = useSnapshot(state);
  return (
    <AnimatePresence>
      {snap.intro && (
        <motion.section className="home" {...slideAnimation("left")}>
          <motion.header {...slideAnimation("down")}>
            <img
              src="./kalkinso.png"
              alt="logo"
              className="w-24 h-24 object-contain"
            ></img>
          </motion.header>

          <motion.div className="home-content" {...headContainerAnimation}>
            <motion.div {...headTextAnimation}>
              <h1 className="head-text">
                WANT <br className="xl:block hidden" />
                CUSTOM ?
              </h1>
            </motion.div>
            <motion.div
              {...headContentAnimation}
              className="flex flex-col gap-5"
            >
              <p className="max-w-md font-normal text-grey-600 text-base">
                Discover the ultimate opportunity to design shirts that are uniquely yours with our Kalkinso 3D customization tool. 
                <strong>Let your creativity soar</strong> and craft a style that truly reflects who you are. 
                The possibilities are endless—start creating today!
              </p>
              <CustomButton
                type="filled"
                title="Try it."
                handleClick={() => {
                  state.intro = false;
                }}
                customStyles="w-fit px-4 py-2.5 font-bold text-sm"
              ></CustomButton>
            </motion.div>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default Home;
