import { NotificationsPanel } from "@carbon/ibm-products";
import { HeaderGlobalAction, HeaderGlobalBar, Theme } from "@carbon/react"
import { AiGenerate, Notification, UserProfile } from "@carbon/react/icons"
import { useDispatch, useSelector } from "react-redux";
import SidePanelChat from "../SidePanelChat/SidePanelChat";
import { useEffect, useState } from "react";
import SidePanel from "../SidePanel/SidePanel";
import { sampleData } from "../sampleData";
import { closeCreateTask } from "../../../actions/task";

const HeaderGlobal = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { tasks, createTask } = useSelector((state) => state.task.kanban);
    const dispatch = useDispatch();
    const [state, setState] = useState({
        activeTab: 0,
        isSideNavExpanded: false,
        notificationOpen: false,
        notificationsData: sampleData,
    });
    useEffect(() => {
        setState({
            activeTab: 0,
            isSideNavExpanded: false,
            notificationOpen: false,
            notificationsData:tasks.map(task=>{
            return {
                id: task._id,
                type: 'informational',
                title: task.name,
                description: task.description,
                timestamp: new Date(task.updatedAt),
                unread: true,
                onNotificationClick: (notification) => {
                    window.location.href = `/#/home/${notification.id}`
                }
            }
        })})
    },[tasks])
    const setNotificationsData = (data) => {
        let newState = state;
        newState.notificationsData = data;
        setState({...newState});
    }
    return (

        isAuthenticated&&!(window.location.pathname.split('/').length>1&&window.location.pathname.split('/')[1].startsWith('token='))?(<><HeaderGlobalBar kind="secondary">
            <HeaderGlobalAction
                aria-label="Notifications"
                isActive={ state.activeTab === 1}
                onClick={() =>  {setState({ ...state,activeTab:  state.activeTab === 1 ? 0 : 1, notificationOpen:  state.activeTab === 1 ? true : false}); dispatch(closeCreateTask());}}
                kind="secondary"
                tooltipAlignment="end">
                <Notification size={20} />
            </HeaderGlobalAction>
            <HeaderGlobalAction
                aria-label="Profile"
                kind="secondary"
                tooltipAlignment="end"
                isActive={ state.activeTab === 2}
                onClick={() =>  {setState({ ...state,activeTab:  state.activeTab === 2 ? 0 : 2}); dispatch(closeCreateTask());}}
                >
                <UserProfile size={20} />
            </HeaderGlobalAction>
            <HeaderGlobalAction
                aria-label="Assistance"
                kind="secondary"
                tooltipAlignment="end"
                isActive={ state.activeTab === 3 || createTask }
                onClick={() =>  {setState({ ...state,activeTab:  state.activeTab === 3 ? 0 : 3}); dispatch(closeCreateTask())}}
                >
                <AiGenerate size={20} />
            </HeaderGlobalAction>
        </HeaderGlobalBar>
        <Theme theme="white">
        <SidePanel isSideNavExpanded={state.activeTab === 2} closeSideNav={()=>{setState({ ...state,activeTab:  state.activeTab === 2 ? 0 : 2}); dispatch(closeCreateTask())}} />
        <SidePanelChat isSideNavExpanded={state.activeTab === 3} closeSideNav={()=>{setState({ ...state,activeTab:  state.activeTab === 3 ? 0 : 3}); dispatch(closeCreateTask());}} />
        <div className="main--content">
        <NotificationsPanel
            open={state.activeTab === 1}
            onClickOutside={() => {dispatch(closeCreateTask())}}
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