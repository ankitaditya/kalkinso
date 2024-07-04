import React from "react";
import {
    HeaderContainer, Header, SkipToContent, HeaderMenuButton, HeaderName,
    HeaderNavigation, HeaderMenu, HeaderMenuItem, HeaderGlobalBar,
    HeaderGlobalAction, SideNav, SideNavItems, Content,
    SideNavMenu, SideNavMenuItem, Theme, ExpandableSearch, HeaderPanel,
    SwitcherItem, SwitcherDivider, Switcher,
    ContainedList, ContainedListItem, Tag, Button
} from '@carbon/react';
import {
    Notification,
    // Search,
    Switcher as SwitcherIcon,
    Fade,
    Close
} from '@carbon/react/icons';
import { Route, Routes, HashRouter, Link } from 'react-router-dom';
import { NotificationsPanel } from '@carbon/ibm-products';
import { sampleData } from './sampleData';

import ErrorBoundary from "../../components/ErrorBoundary";
import LandingPage from '../LandingPage';
import NotFound from '../../components/NotFound';
import ContactPage from "../ContactPage";
import SearchPage from "../SearchPage";
import Login from "../Login";
import SignUp from "../Signup";
import Kanban from "../Kanban";
import ChatScreen from "../ChatScreen/ChatScreen";
import Dashboard from "../Dashboard";
import HowToPage from "../HowToPage";
// import Notification from '../../components/Notification';


class UIShell extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        activeItem: `/${window.location.pathname.split('/')[1] ?? ''}`,
        activeTab: 0,
        isSideNavExpanded: false,
        searchTerm: '',
        searchResults: ['Item 1', 'Item 2', 'Item 3', 'Item 4'],
        listItems: ['Item 1', 'Item 2', 'Item 3', 'Item 4'],
        notificationOpen: false,
        notificationsData: sampleData,
      };
    }

    handleChange = (e) => {
        if (e.target.value === '') {
            this.setState({ ...this.state, searchTerm: '', searchResults: this.state.listItems });
            return;
        }
        const results = this.state.listItems.filter(listItem => listItem.toLowerCase().includes(e.target.value.toLowerCase()));
        this.setState({ ...this.state ,searchTerm: e.target.value, searchResults: results });
    }

    setNotificationsData = (data) => {
        this.setState({ ...this.state, notificationsData: data });
    }

    setNotificationOpen = () => {
        this.setState({ ...this.state, notificationOpen: true });
    }

    render() {
        return (
            <HashRouter>
                <Theme theme='g90'>
                    <HeaderContainer
                        render={({isSideNavExpanded, onClickSideNavExpand}) => (
                            <div>
                                <Header aria-label="IBM Platform Name">
                                    {/* <SkipToContent />
                                    <HeaderMenuButton
                                        aria-label="Open menu"
                                        onClick={onClickSideNavExpand}
                                        isActive={isSideNavExpanded}
                                    /> */}
                                    <HeaderName href="/#" prefix="KALKIN">
                                        SO
                                    </HeaderName>
                                    <HeaderNavigation aria-label="Carbon React App">
                                        <HeaderMenuItem href="/#/Contribute">Contributing</HeaderMenuItem>
                                        <HeaderMenuItem href="/#/Contact">Contact</HeaderMenuItem>
                                        <HeaderMenuItem href="/#/how-to">How To</HeaderMenuItem>
                                    </HeaderNavigation>
                                    <HeaderGlobalBar kind="secondary">
                                        <HeaderGlobalAction
                                            aria-label="Notifications"
                                            isActive={this.state.activeTab === 1}
                                            onClick={() => this.setState({ activeTab: this.state.activeTab === 1 ? 0 : 1, notificationOpen: this.state.activeTab === 1 ? true : false})}
                                            kind="secondary"
                                            tooltipAlignment="end">
                                            <Notification size={20} />
                                        </HeaderGlobalAction>
                                        <HeaderGlobalAction
                                            aria-label="App Switcher"
                                            kind="secondary"
                                            tooltipAlignment="end"
                                            isActive={this.state.activeTab === 2}
                                            onClick={() => this.setState({ activeTab: this.state.activeTab === 2 ? 0 : 2, isSideNavExpanded: this.state.activeTab === 2 ? false : true})}
                                            >
                                            <SwitcherIcon size={20} />
                                        </HeaderGlobalAction>
                                    </HeaderGlobalBar>
                                    <HeaderPanel expanded={this.state.isSideNavExpanded}>
                                        {/* <ExpandableSearch placeholder={`Search ${this.state.activeTab===1?'Notifications':'Apps'}`} labelText={`Search ${this.state.activeTab===1?'Notifications':'Apps'}`} value={this.state.searchTerm} onChange={(e)=>this.handleChange(e)} closeButtonLabelText="Clear search input" size="lg" /> */}
                                        <ContainedList label={<div style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between'
                                                                }}>
                                                                        <span>{this.state.activeTab===1?'Notifications':'Apps'}</span>
                                                                        <Tag size="sm" role="status" aria-label="4 items in list">
                                                                            {this.state.listItems.length}
                                                                        </Tag>
                                                                    </div>} kind="on-page">
                                            {this.state.searchResults.map((listItem, key) => 
                                                <ContainedListItem 
                                                    key={key} 
                                                    action={
                                                    <Button 
                                                        kind="ghost" 
                                                        iconDescription="Dismiss" 
                                                        hasIconOnly 
                                                        renderIcon={Close} 
                                                        aria-label="Dismiss" />}>{
                                                            listItem}
                                                </ContainedListItem>)
                                            }
                                        </ContainedList>
                                    </HeaderPanel>
                                    {/* <ErrorBoundary>
                                        <SideNav aria-label="Side navigation" expanded={isSideNavExpanded}>
                                            <SideNavItems>
                                                <SideNavMenuItem element={Link} to='/'
                                                    isActive={this.state.activeItem === '/'}
                                                    onClick={() => { this.setState({ activeItem: '/' }) }}>
                                                    Overview
                                                </SideNavMenuItem>
                                                <SideNavMenu renderIcon={Fade} title="Inventory" defaultExpanded>
                                                    <SideNavMenuItem element={Link} to='/inventory/items'
                                                        isActive={this.state.activeItem === '/inventory/items'}
                                                        onClick={() => { this.setState({ activeItem: '/inventory/items' }) }}>
                                                        Items
                                                    </SideNavMenuItem>
                                                </SideNavMenu>
                                                <SideNavMenu renderIcon={Fade} title="Management">
                                                    <SideNavMenuItem href="#">
                                                        Link
                                                    </SideNavMenuItem>
                                                    <SideNavMenuItem href="#">
                                                        Link
                                                    </SideNavMenuItem>
                                                    <SideNavMenuItem href="#">
                                                        Link
                                                    </SideNavMenuItem>
                                                </SideNavMenu>
                                                <SideNavMenu
                                                    renderIcon={Fade}
                                                    title="Docs">
                                                    <SideNavMenuItem href="#">
                                                        Link
                                                    </SideNavMenuItem>
                                                    <SideNavMenuItem href="#">
                                                        Link
                                                    </SideNavMenuItem>
                                                </SideNavMenu>
                                            </SideNavItems>
                                        </SideNav>
                                    </ErrorBoundary> */}
                                </Header>
                                <div className="main--content">
                                <NotificationsPanel
                                    open={this.state.activeTab === 1}
                                    // onClickOutside={() => this.setState({ activeTab: 0 })}
                                    data={this.state.notificationsData}
                                    onDoNotDisturbChange={(event) =>
                                        console.log('Toggled do not disturb', event)
                                    }
                                    onViewAllClick={() => console.log('Clicked view all button')}
                                    onSettingsClick={() => console.log('Clicked settings gear button')}
                                    onDismissAllNotifications={() => this.setNotificationsData([])}
                                    onDismissSingleNotification={({ id }) => {
                                        let tempData = [...this.state.notificationsData];
                                        tempData = tempData.filter((item) => item.id !== id);
                                        this.setNotificationsData(tempData);
                                    }}
                                    />
                                </div>
                            </div>
                        )}
                    />
                </Theme>
                <Content className='content'>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="Contribute" element={<SearchPage />} />
                        <Route path="Login" element={<Login />} />
                        <Route path="Register" element={<SignUp />} />
                        <Route path="home" element={<Dashboard />} />
                        <Route path="chat" element={<ChatScreen />} />
                        <Route path="Contact" element={<ContactPage />} />
                        <Route path="how-to" element={<HowToPage />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Content>
            </HashRouter>
        );
    }
}

export default UIShell;
