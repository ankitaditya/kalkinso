import { proxy } from "valtio";

const state = proxy({
  intro: true,
  color: {
    "shirt":"#cac8c2",
    "tsports":"#0C0A00",
    "hoodie":"#2c2c2c",
    "jeans":"#FFFFFF",
  },
  selectedApparel: "shirt",
  isLogoTexture: false, //is logo currently displayed
  isFullTexture: false,
  isBaseTexture: true,
  logoDecal: "./kalkinso.png",
  fullDecal: "./shiv.png",
  baseDecal: "./kalkinso.png",
});

export default state;
