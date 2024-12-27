import { Canvas } from "@react-three/fiber";
import { Environment, Center, Sky, Bvh, OrbitControls } from "@react-three/drei";
import Shirt from "./Shirt";
import Backdrop from "./Backdrop";
import CameraRig from "./CameraRig";
import { Link } from "wouter";
import state from "../store/index";
import { useSnapshot } from "valtio";
import { useEffect, useRef, useState } from "react";
import { TSports } from "./T-shirt-sports";
import { Jeans } from "./Jeans";
import { Mindfull } from "./Hoodie-mindfull";
import { ExpandableSearch, Menu, MenuItem, MenuItemDivider, Theme, Column, Tile, Grid, Button } from "@carbon/react";
import ProductCard from "./ProductCard";
import AnimatePresenceCard from "./AnimatePresenseCard";
import CustomShirt from "./CommonCustomT";
import { CommonCustomHoodie } from "./CommonCustomHoodie";

const CanvasModel = () => {
  const apparels = {
    shirt: <Shirt />,
    // tsports: <TSports /> ,
    hoodie: <Mindfull />,
    // jeans: <Jeans />,
  }
  const prices = {
    shirt: 1200,
    tsports: 800,
    hoodie: 1500,
    jeans: 2000,
  }
  const descriptions = {
    shirt: 'Elevate your wardrobe with our classic shirt, tailored for a perfect fit and crafted with premium, breathable fabric. Ideal for both formal and casual occasions, this shirt ensures you stay stylish and comfortable all day.',
    tsports: 'Stay cool and comfortable in our sports tee, designed to keep you dry and fresh during your workout. Made with moisture-wicking fabric, this tee is perfect for all your fitness activities.',
    hoodie: 'Stay warm and cozy in our stylish hoodie, designed to keep you comfortable in all weather conditions. Made with premium fabric, this hoodie is perfect for casual outings and everyday wear.',
    jeans: 'Add a touch of style to your wardrobe with our classic jeans, designed for a perfect fit and crafted with durable denim fabric. Ideal for casual and semi-formal occasions, these jeans are a versatile addition to your collection.',
  }
  const { selectedApparel, intro, buy } = useSnapshot(state);
  const [ apparel, setApparel ] = useState(<Shirt />);
  const [ menuPos, setMenuPos ] = useState({ x: 0, y: 0 });
  const [ menuOpen, setMenuOpen ] = useState(false);
  const [ menuItems, setMenuItems ] = useState(apparels);
  const searchRef = useRef();
  useEffect(() => {
    if(Object.keys(apparels).includes(selectedApparel)){
      setApparel(apparels[selectedApparel]);
    }
    // if(localStorage.getItem('finalDesigns')){
    //   let finalDesigns = JSON.parse(localStorage.getItem('finalDesigns'))
    //   if(Object.keys(finalDesigns).includes(selectedApparel)){
    //     if(selectedApparel.includes('shirt')){
    //       setApparel(selectedApparel==='shirt'?<Shirt />:<CustomShirt texture={finalDesigns[selectedApparel].texture.base} color={finalDesigns[selectedApparel].color} />)
    //     } else {
    //       setApparel(selectedApparel==='hoodie'?<Mindfull />:<CommonCustomHoodie texture={finalDesigns[selectedApparel].texture.base} color={finalDesigns[selectedApparel].color} />)
    //     }
    //   }
    // }
  }, [selectedApparel]);

  useEffect(() => {
    if(searchRef.current){
      const { x, y, width, height } = searchRef.current.getBoundingClientRect();
      setMenuPos({ x: x + width, y: y + height });
    }
  }, [searchRef]);

  return !buy&&(
    <>
    <Canvas
      onClick={() => {setMenuOpen(false)}}
      key={selectedApparel}
      shadows
      camera={{ position: [0, 0, 0], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
      className="w-full max-w-full h-full transition-all ease-in"
    >
      {/* <ambientLight intensity={1.5} /> */}
      {/* <Sky /> */}
      <Environment files="canary_wharf_1k.hdr" />
      <CameraRig>
        <Backdrop />
        <Center>
          {apparel}
        </Center>
      </CameraRig>
    </Canvas>
    {intro&&(<div className="nav">
      {/* <Link onClick={()=>{state.selectedApparel='shirt'}}>shirt</Link>
      <Link onClick={()=>{state.selectedApparel='tsports'}}>sports</Link>
      <Link onClick={()=>{state.selectedApparel='hoodie'}}>hoodie</Link>
      <Link onClick={()=>{state.selectedApparel='jeans'}}>jeans</Link> */}
      <Theme style={{
        background: 'none',
        color: 'black',
      }} theme="white">
      <ExpandableSearch ref={searchRef} defaultValue={state.selectedApparel} onClear={()=>setMenuOpen(false)} size="lg" labelText="Search" closeButtonLabelText="Clear search input" id="search-expandable-1" onChange={(e) => {
        if(e.target.value){
          setMenuOpen(true);
        }
        setMenuItems(e.target.value?Object.keys(apparels).
        filter((key) => key.includes(e.target.value)).
        reduce((cur, key) => { return Object.assign(cur, { [key]: apparels[key] })}, {}):apparels);
      }} onKeyDown={(e) => {
        if(e.key === 'Escape'){
          setMenuOpen(false);
        }
      }} />
      </Theme>
      <Menu size="lg" mode="full" open={menuOpen} x={menuPos.x} y={menuPos.y} onFocus={()=>{if(searchRef.current) searchRef.current.focus()}}>
        {Object.keys(menuItems).map((item, index) => (
          <>
          <MenuItem key={index} label={item} onClick={() => {state.selectedApparel=item; setMenuOpen(false); searchRef.current.value = item}}/>
          <MenuItemDivider key={`${index}-divider`} />
          </>
        ))}
      </Menu>
    </div>)}
    {/* Features Section */}
    {/* <section className="features-section">
        <h2>🛍️ Shop the Look You Love!</h2>
        <Grid>
            {
              Object.keys(menuItems).map((key) => (<Column style={{
                backgroundColor: '#f4f4f4'
              }} className='feature' sm={4} md={2} lg={4}>
                <Tile key={key}>
                <Canvas
                  onClick={() => {setMenuOpen(false)}}
                  key={key}
                  shadows
                  camera={{ position: [0, 0, 0], fov: 25 }}
                  gl={{ preserveDrawingBuffer: true }}
                  className="w-full max-w-full h-full transition-all ease-in"
                >
                  <ambientLight intensity={1.5 * Math.PI} />
                  <Sky />
                  <Environment files="canary_wharf_1k.hdr" />
                  <Bvh firstHitOnly>
                  <CameraRig>
                    <Backdrop />
                    <Center>
                      {menuItems[key]}
                    </Center>
                  </CameraRig>
                  </Bvh>
                </Canvas>
                <AnimatePresenceCard 
                  product={{
                    key: key,
                    title: key,
                    description: descriptions[key],
                    price: `₹ ${prices[key]}`,
                  }}
                  onEdit={(key) => {state.selectedApparel=key; state.intro = false;}}
                  onBuy={() => {state.selectedApparel=key; state.intro = true;}}
                />
                <ProductCard 
                  product={{
                    key: key,
                    title: key,
                    description: descriptions[key],
                    price: `₹ ${prices[key]}`,
                  }}
                  onEdit={(key) => {state.selectedApparel=key; state.intro = false;}}
                  onBuy={() => {state.selectedApparel=key; state.intro = true;}}
                />
                </Tile>
                </Column>))
            }
        </Grid>
      </section> */}
    </>
  );
};

export default CanvasModel;
