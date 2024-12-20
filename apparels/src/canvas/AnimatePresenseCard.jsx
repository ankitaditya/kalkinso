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

const AnimatePresenceCard = ({product, onEdit, onBuy}) => {
  const snap = useSnapshot(state);
  const { title, description, price, key } = product;
  const getTitle = (value) => {
    return value.slice(0)[0].toLocaleUpperCase()+value.slice(1).toLocaleLowerCase();
  }
  return (
    <AnimatePresence key={key}>
      {snap.intro && (
        <motion.section className="home-product" {...slideAnimation("left")}>

          <motion.div className="home-product-content" {...headContainerAnimation}>
            <motion.div {...headTextAnimation}>
              <h5>
                {getTitle(title)} <br className="xl:block hidden" />
              </h5>
              <h2>
                {price}
              </h2>
            </motion.div>
            <motion.div
              {...headContentAnimation}
              // className="flex flex-col gap-5"
            >
              <p style={{
                maxWidth: "50px",
                fontSize: "0.75rem",
              }}>
              </p>
            </motion.div>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default AnimatePresenceCard;
