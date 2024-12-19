import React, { useEffect, useRef, useState } from 'react';
import { PageHeader, UserAvatar } from '@carbon/ibm-products';
import { Menu, MenuItem, Theme } from '@carbon/react';

const Navbar = () => {
  const [location, setLocation] = useState(null);
  const ref = useRef(null);
  const [menu, setMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [auth, setAuth] = useState(false);
  const userProfile = (
    <>
        <UserAvatar onClick={(e)=>{
            setMenuPosition({ x: ref.current.getBoundingClientRect().x+ref.current.getBoundingClientRect().width, y: ref.current.getBoundingClientRect().y+ref.current.getBoundingClientRect().height });
            setMenu(!menu);
        }} tooltipText={auth?.user?.displayName} ref={ref} imageDescription='image-profile' image='https://lh3.googleusercontent.com/a/ACg8ocItBJ1RBjei9hBbalvMFSYlm4QeR627Bd6ShKtT49tmdHHgW1bq=s576-c-no' />
    </>
  )
  useEffect(() => {
    if (localStorage.getItem('auth')) {
        setAuth(JSON.parse(localStorage.getItem('auth')));
        window.onclick = (e) => {
            if(e.target.alt !== 'image-profile') {
                setMenu(false);
            }
        };
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`;
        fetch(url).then((response) => response.json()).then((data) => {
            if (data && data.display_name) {
                setLocation(data.display_name);
            } else {
                setLocation("Location Not found");
            }
        }).catch((error) => {
            console.error("Error fetching location:", error);
            setLocation("Error fetching location");
        });
      },
      () => alert("Unable to fetch location")
    );
  }, []);
  return (
    <Theme style={{
        zIndex: 1000,
    }} theme='white'>
    <Menu open={menu} {...menuPosition}>
        <MenuItem label={auth?.user?.displayName} />
        <MenuItem label={"Settings"} />
        <MenuItem label={"Logout"} onClick={()=>{
            localStorage.removeItem('auth');
            window.location.href = "/#/login";
        }} />
    </Menu>
    <PageHeader
      title="Welcome to G'UDDA Dashboard"
      subtitle={`Current Location: ${location ? location : "Fetching..."}`}
      pageActions={{
        content: userProfile
      }}
    />
    </Theme>
  );
};

export default Navbar;
