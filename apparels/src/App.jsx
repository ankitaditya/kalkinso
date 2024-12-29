import { useEffect, useState } from "react";
import Canvas from "./canvas";
import Customizer from "./pages/Customiser";
import Home from "./pages/Home";
import ProductHome from "./pages/ProductHome";
import { Dock } from 'primereact/dock'
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import Shirt from "./canvas/Shirt";
import { Canvas as MainCanvas } from "@react-three/fiber";
import { Environment, Center, Sky, Bvh, OrbitControls } from "@react-three/drei";
import CameraRig from "./canvas/CameraRig";
import { TSports } from "./canvas/T-shirt-sports";
import { Jeans } from "./canvas/Jeans";
import { Mindfull } from "./canvas/Hoodie-mindfull";
import { useSnapshot } from "valtio";
import state from "./store/index";
import CustomShirt from "./canvas/CommonCustomT";
import { CommonCustomHoodie } from "./canvas/CommonCustomHoodie";
import { useCart } from "./pages/Cart/cart-context";
import { ThemeProvider } from "./pages/Cart/commons/style/styled-components";
import { theme } from "./pages/Cart/commons/style/theme";
import Checkout from "./pages/Checkout";

export const updateUrl = () => {
  window.location.search = `?apparel=${state.selectedApparel}&&color=${state.color[state.selectedApparel].replace('#','')}&&style=${state.baseDecal.replace('./styles/','')}&&placement=${state.isLogoTexture?'logo':'base'}&&intro=${state.intro}&&size=${state.size}&&purchase=${state.buy}`
}

function App() {
  const colors = [
    {
      color: "#2f344a",
      title: "blue"
    },
    {
      color: "#cac8c2",
      title: "white/gray"
    },
    {
      color: "#772522",
      title: "red"
    },
    {
      color: "#2c2c2c",
      title: "black"
    },
    {
      color: "#cf9583",
      title: "swirl"
    }
  ].map(value=>value.color.replace('#',''))

  const styles = [
    "1B_025.png",                              "I_008.png",                               "Picsart_24-12-25_18-34-59-490.png",
    "1E_016.png",                              "I_027.png",                               "Picsart_24-12-25_19-05-28-594.png",
    "A_024.png",                               "P_005.png",                               "Picsart_24-12-25_19-08-26-881.png",
    "F_008.png",                               "P_089.png",                               "Picsart_24-12-25_19-12-06-351.png",
    "F_039.png",                               "P_106.png",                               "Picsart_24-12-25_19-16-58-200.png",
    "kalkinso.png"
     ]
  const apparel = ['shirt', 'hoodie']
  const snap = useSnapshot(state)
  const { isOpen, addProduct } = useCart()
  let designs = JSON.parse(localStorage.getItem('finalDesigns'))
  const [ items, setItems ]  = useState([
    {label: "shirt",
      command: () => {
        state.selectedApparel="shirt";
        updateUrl()
      },
      icon: ()=><MainCanvas
      // onClick={() => {setMenuOpen(false)}}
      key={"shirt"}
      shadows
      camera={{ position: [0, 0, 0], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
      className="w-full max-w-full h-full transition-all ease-in"
    >
      {/* <ambientLight intensity={1.5 * Math.PI} /> */}
      {/* <Sky /> */}
      <Environment files="canary_wharf_1k.hdr" />
      <CameraRig defaultPosition={[0,0,2]}>
        <Center>
          <Shirt />
        </Center>
      </CameraRig>
    </MainCanvas>},
    {label: "hoodie",
      command: () => {
        state.selectedApparel="hoodie";
        updateUrl()
      },
      icon: () => <MainCanvas
    // onClick={() => {setMenuOpen(false)}}
    key={"hoodie"}
    shadows
    camera={{ position: [0, 0, 0], fov: 25 }}
    gl={{ preserveDrawingBuffer: true }}
    className="w-full max-w-full h-full transition-all ease-in"
  >
    {/* <ambientLight intensity={1.5 * Math.PI} /> */}
    {/* <Sky /> */}
    <Environment files="canary_wharf_1k.hdr" />
    <CameraRig defaultPosition={[0,0,2]}>
      <Center>
        <Mindfull />
      </Center>
    </CameraRig>
  </MainCanvas>}
  ])
  const productFormat = {
    shirt: {
      id: 'shirt-1',
      sku: items[0].icon(),
      title: "Shirt",
      description: "Elevate your wardrobe with our classic shirt, tailored for a perfect fit and crafted with premium, breathable fabric. Ideal for both formal and casual occasions, this shirt ensures you stay stylish and comfortable all day.",
      availableSizes: [],
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
      availableSizes: [],
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
  useEffect(()=>{
    const queryParams = window.location.search
      .replace('?', '')
      .split('&&')
      .reduce((acc, val) => {
        const [key, value] = val.split('=');
          if(key && ['apparel','color', 'style', 'intro', 'purchase', 'size'].includes(key)){
            switch (key){
              case 'apparel': {
                if(apparel.includes(value)){
                  acc[key] = value
                }
                return acc
              }
              case 'color': {
                if(colors.includes(value)){
                  acc[key] = value
                }
                return acc
              }
              case 'style': {
                if(styles.includes(value)){
                  acc[key] = `./styles/${value}`
                }
                return acc
              }
              case 'placement': {
                if(['logo', 'base'].includes(value)){
                  acc[key] = `./styles/${value}`
                }
                return acc
              }
              case 'intro': {
                if(['true', 'false'].includes(value.toLocaleLowerCase())){
                  acc[key] = value
                }
                return acc
              }
              case 'purchase': {
                if(['true', 'false'].includes(value.toLocaleLowerCase())){
                  acc[key] = value
                }
                return acc
              }
              case 'size': {
                if(['M', 'L', 'XL'].includes(value.toLocaleUpperCase())){
                  acc[key] = value
                }
                return acc
              }
              default: {
                return acc
              }
            }
            
          }
        return acc;
      }, {});
    if(Object.keys(queryParams).length>0){
      if(queryParams.apparel) state.selectedApparel = queryParams.apparel
      if(queryParams.color) state.color[state.selectedApparel] = queryParams.color
      if(queryParams.style) {
        state.baseDecal = queryParams.style
        state.logoDecal = queryParams.style
        state.fullDecal = queryParams.style
      }
      if(queryParams.placement){
        if(queryParams.placement==='logo'){
          state.isLogoTexture = true
          state.isBaseTexture = false
        } else {
          state.isLogoTexture = false
          state.isBaseTexture = true
        }
      }
      if(queryParams.intro!==null){
        state.intro = queryParams.intro==='true'
      }
      if(queryParams.size){
        state.size = queryParams.size
      }
      if(queryParams.purchase!==null){
        state.purchase = queryParams.purchase==='true'
        if(queryParams.purchase==='true'){
          addProduct({...productFormat[snap.selectedApparel], availableSizes: [snap.size], title: productFormat[snap.selectedApparel].title + ` ${productFormat[snap.selectedApparel].texture.split('/').slice(-1)[0].replace('.png','')}`, id: `PROD-${productFormat[snap.selectedApparel].title.toLocaleUpperCase()}-${productFormat[snap.selectedApparel].availableSizes[0]}-${productFormat[snap.selectedApparel].color.replace('#','')}-${productFormat[snap.selectedApparel].texture}`, sku: (title)=> {if(title.toLocaleUpperCase()==="SHIRT"){return <CustomShirt texture={productFormat[snap.selectedApparel].texture} color={productFormat[snap.selectedApparel].color} />}else{<CommonCustomHoodie texture={productFormat[snap.selectedApparel].texture} color={productFormat[snap.selectedApparel].color} />}}})
          state.buy = true 
        }
      }
    } else {
      window.location.search = `?apparel=${snap.selectedApparel}&&color=${snap.color[snap.selectedApparel].replace('#','')}&&style=${state.baseDecal.replace('./styles/','')}&&placement=${snap.isLogoTexture?'logo':'base'}&&intro=${snap.intro}&&size=${snap.size}&&purchase=${snap.buy}`
    }
  },[window.location.search])
  return (
    <PrimeReactProvider>
      <ThemeProvider theme={theme}>
        <main className="app transition-all ease-in">
          <ProductHome />
          <Canvas />
          <Customizer setItems={setItems} items={items} />
          {snap.buy&&<Checkout />}
        </main>
      </ThemeProvider>
      {!snap.buy&&!isOpen&&<Dock model={items} position="bottom" />}
      </PrimeReactProvider>
  );
}

export default App;
