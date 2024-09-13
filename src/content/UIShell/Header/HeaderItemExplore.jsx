import { HeaderMenuItem } from "@carbon/react";
import { useSelector } from "react-redux";

const HeaderItemExplore = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    return (
        isAuthenticated?<><HeaderMenuItem
        style={{cursor: 'pointer'}} 
        onClick={
            ()=>{
                window.location.href = window.location.origin + '/#/Home'
                window.location.reload()
            }
        }>Home</HeaderMenuItem><HeaderMenuItem 
        style={{cursor: 'pointer'}}
        onClick={
            ()=>{
                window.location.href = window.location.origin + '/#/Home/create'
                window.location.reload()
            }
        }>Dashboard</HeaderMenuItem></>:<HeaderMenuItem onClick={()=>{
            window.location.href = window.location.origin + '/#/Home/search'
            window.location.reload()
        }}>Explore</HeaderMenuItem>
    );
};

export default HeaderItemExplore;