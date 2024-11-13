import { NotificationsPanel } from "@carbon/ibm-products";
import { HeaderGlobalAction, HeaderGlobalBar, Theme } from "@carbon/react"
import { AiGenerate, Notification, UserProfile } from "@carbon/react/icons"
import { useDispatch, useSelector } from "react-redux";
import SidePanelChat from "../SidePanelChat/SidePanelChat";
import { useEffect, useState } from "react";
import SidePanel from "../SidePanel/SidePanel";
import { sampleData } from "../sampleData";
import { loadUser, setLoading } from "../../../actions/auth";

const HeaderGlobal = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [state, setState] = useState({
        activeTab: 0,
        isSideNavExpanded: false,
        notificationOpen: false,
        notificationsData: sampleData,
    });
    const setNotificationsData = (data) => {
        let newState = state;
        newState.notificationsData = data;
        setState({...newState});
    }
    const auth = useSelector((state) => state.auth);

    useEffect(() => {
        // console.log('isAuthenticated:', auth);
        if(!isAuthenticated&&localStorage.getItem('token')) {
            if(
                (window.location.pathname.split('/').length>1&&window.location.pathname.split('/')[1].startsWith('token='))
            ){
                localStorage.setItem('token', window.location.pathname.split('/')[1].replace('token=',''))
            }
            dispatch(setLoading(true));
            if(localStorage.getItem('token')){
                dispatch(loadUser({token: localStorage.getItem('token')}));
            }
        }
    },[])
    return (

        isAuthenticated&&!(window.location.pathname.split('/').length>1&&window.location.pathname.split('/')[1].startsWith('token='))?(<><HeaderGlobalBar kind="secondary">
            <HeaderGlobalAction
                aria-label="Notifications"
                isActive={ state.activeTab === 1}
                onClick={() =>  setState({ ...state,activeTab:  state.activeTab === 1 ? 0 : 1, notificationOpen:  state.activeTab === 1 ? true : false})}
                kind="secondary"
                tooltipAlignment="end">
                <Notification size={20} />
            </HeaderGlobalAction>
            <HeaderGlobalAction
                aria-label="Profile"
                kind="secondary"
                tooltipAlignment="end"
                isActive={ state.activeTab === 2}
                onClick={() =>  setState({ ...state,activeTab:  state.activeTab === 2 ? 0 : 2})}
                >
                <UserProfile size={20} />
            </HeaderGlobalAction>
            <HeaderGlobalAction
                aria-label="Assistance"
                kind="secondary"
                tooltipAlignment="end"
                isActive={ state.activeTab === 3}
                onClick={() =>  setState({ ...state,activeTab:  state.activeTab === 3 ? 0 : 3})}
                >
                <AiGenerate size={20} />
            </HeaderGlobalAction>
        </HeaderGlobalBar>
        <Theme theme="white">
        <SidePanel isSideNavExpanded={state.activeTab === 2} closeSideNav={()=>{setState({ ...state,activeTab:  state.activeTab === 2 ? 0 : 2})}} />
        <SidePanelChat isSideNavExpanded={state.activeTab === 3} closeSideNav={()=>{setState({ ...state,activeTab:  state.activeTab === 3 ? 0 : 3})}} />
        <div className="main--content">
        <NotificationsPanel
            open={state.activeTab === 1}
            onClickOutside={() => {}}
            data={state.notificationsData}
            // onDoNotDisturbChange={(event) =>
                // console.log('Toggled do not disturb', event)
            // }
            // onViewAllClick={() => console.log('Clicked view all button')}
            // onSettingsClick={() => console.log('Clicked settings gear button')}
            onDismissAllNotifications={() => setNotificationsData([])}
            onDismissSingleNotification={({ id }) => {
                let tempData = [...state.notificationsData];
                tempData = tempData.filter((item) => item.id !== id);
                setNotificationsData(tempData);
            }}
            />
        </div>
        </Theme>
        </>):<></>
    )
}

export default HeaderGlobal;