import { proxy } from "valtio";

const state = proxy({
  intro: false,
  purchase: false,
  size: 'L',
  color: {
    "shirt":"#2f344a",
    "tsports":"#0C0A00",
    "hoodie":"#2f344a",
    "jeans":"#FFFFFF",
  },
  selectedApparel: "hoodie",
  isLogoTexture: false, //is logo currently displayed
  isFullTexture: false,
  isBaseTexture: true,
  logoDecal: "./styles/I_008.png",
  fullDecal: "./styles/I_008.png",
  baseDecal: "./styles/I_008.png",
});

export default state;
