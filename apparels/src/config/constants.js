import { swatch, fileIcon, ai, logoShirt, stylishShirt, xl, l, m, xs, s, xxl } from "../assets";

export const EditorTabs = [
  {
    name: "colorpicker",
    icon: swatch,
  },
  {
    name: "filepicker",
    icon: fileIcon,
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
