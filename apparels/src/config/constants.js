import { swatch, fileIcon, ai, logoShirt, shopping, stylishShirt, xl, l, m, xs, s, xxl, buyNow } from "../assets";

export const EditorTabs = [
  {
    name: "colorpicker",
    icon: swatch,
    display: "Pick Color"
  },
  {
    name: "filepicker",
    icon: fileIcon,
    display: "Pick Design"
  },
  {
    name: "logoShirt",
    icon: logoShirt,
    display: "Logo"
  },
  {
    name: "baseShirt",
    icon: stylishShirt,
    display: "Base"
  },
  {
    name: "addToCart",
    icon: shopping,
    display: "Add To Cart"
  },
  {
    name: "buyNow",
    icon: buyNow,
    display: "Buy"
  },
  
  // {
  //   name: "aipicker",
  //   icon: ai,
  // },
];

export const SizeTabs = [
  {
    name: "XL",
    icon: xl,
  },
  {
    name: "L",
    icon: l,
  },
  {
    name: "M",
    icon: m,
  },
  // {
  //   name: "aipicker",
  //   icon: ai,
  // },
];

export const FilterTabs = [
  {
    name: "logoShirt",
    icon: logoShirt,
  },
  {
    name: "baseShirt",
    icon: stylishShirt,
  },
  // {
  //   name: "stylishShirt",
  //   icon: stylishShirt,
  // },
];

export const DecalTypes = {
  logo: {
    stateProperty: "logoDecal",
    filterTab: "logoShirt",
  },
  full: {
    stateProperty: "fullDecal",
    filterTab: "stylishShirt",
  },
  base: {
    stateProperty: "baseDecal",
    filterTab: "baseShirt",
  },
};
