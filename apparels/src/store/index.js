import { proxy } from "valtio";

const state = proxy({
  intro: true,
  color: {
    "shirt":"#0C0A00",
    "tsports":"#0C0A00",
    "hoodie":"#FFFFFF",
    "jeans":"#FFFFFF",
  },
  selectedApparel: "shirt",
  isLogoTexture: true, //is logo currently displayed
  isFullTexture: false,
  logoDecal: "./kalkinso.png",
  fullDecal: "./kalkinso.png",
});

export default state;
