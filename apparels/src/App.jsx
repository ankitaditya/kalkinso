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
import { CartProvider } from "./pages/Cart/cart-context";
import { ThemeProvider } from "./pages/Cart/commons/style/styled-components";
import { theme } from "./pages/Cart/commons/style/theme";
import Checkout from "./pages/Checkout";

function App() {
  const snap = useSnapshot(state)
  let designs = JSON.parse(localStorage.getItem('finalDesigns'))
  const [ items, setItems ]  = useState([
    {label: "shirt",
      command: () => {
        state.selectedApparel="shirt"
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
        state.selectedApparel="hoodie"
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
  useEffect(()=>{
    if(window.location.pathname!=='/'){
      state.selectedApparel = window.location.pathname.replace('/','').split('_')[0].toLocaleLowerCase()
      state.color[state.selectedApparel] = '#'+window.location.pathname.replace('/').split('_')[1].toLocaleLowerCase()
      state.baseDecal = './'+window.location.pathname.replace('/').split('_')[3]+'.png'
      state.logoDecal = './'+window.location.pathname.replace('/').split('_')[3]+'.png'
    }
  },[])
  return (
    <PrimeReactProvider>
      <ThemeProvider theme={theme}>
      <CartProvider>
        <main className="app transition-all ease-in">
          <ProductHome />
          <Canvas />
          <Customizer setItems={setItems} items={items} />
          {snap.buy&&<Checkout />}
        </main>
      </CartProvider>
      </ThemeProvider>
      {!snap.buy&&<Dock model={items} position="top" />}
      </PrimeReactProvider>
  );
}

export default App;
