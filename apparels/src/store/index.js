import { proxy } from "valtio";

const state = proxy({
  intro: true,
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
  logoDecal: "./I_008.png",
  fullDecal: "./I_008.png",
  baseDecal: "./I_008.png",
});

export default state;
