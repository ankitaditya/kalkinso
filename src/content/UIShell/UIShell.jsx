import React from "react";
import {
    HeaderContainer, Header, SkipToContent, HeaderMenuButton, HeaderName,
    HeaderNavigation, HeaderMenu, HeaderMenuItem, HeaderGlobalBar,
    HeaderGlobalAction, SideNav, SideNavItems, Content,
    SideNavMenu, SideNavMenuItem, Theme, ExpandableSearch, HeaderPanel,
    SwitcherItem, SwitcherDivider, Switcher,
    ContainedList, ContainedListItem, Tag, Button,
    TextInput,
    NumberInput,
    Dropdown,
    TextArea,
    IconButton,
} from '@carbon/react';
import axios from 'axios';
import ToastNotification from "../../components/ToastNotification";
import {
    Notification,
    // Search,
    Switcher as SwitcherIcon,
    Fade,
    Close,
    UserProfile,
    Chat,
    AiGenerate,
    View,
    FolderOpen,
    Folder
} from '@carbon/react/icons';
import { Route, Routes, HashRouter, Navigate } from 'react-router-dom';
import { NotificationsPanel,  } from '@carbon/ibm-products';
import { sampleData } from './sampleData';

// import ErrorBoundary from "../../components/ErrorBoundary";
import LandingPage from '../LandingPage';
import NotFound from '../../components/NotFound';
import ContactPage from "../ContactPage";
import SearchPage from "../SearchPage";
import { Login, PasswordReset, VerifyOtp } from "../Login";
import SignUp from "../Signup";
// import Kanban from "../Kanban";
import ChatScreen from "../ChatScreen/ChatScreen";
import Dashboard from "../Dashboard";
import HowToPage from "../HowToPage";
import SidePanel from "./SidePanel/SidePanel";
import SidePanelChat from "./SidePanelChat/SidePanelChat";
import ComingSoon from "./ComingSoon";
import store from "../../store";
import { Provider } from "react-redux";
import Kanban from "../Kanban";
import brandLogo from './brand.png';
import Loader from "./MainLoader";
import DashboardScreen from "../Dashboard/Dashboard";
import AIReact from "./AIReact";
import PrivateRoute from "../../components/routing/PrivateRoute";
import { AIReactBaseConfig, AIReactChatConfig, AIReactDashboardConfig } from "./AIReactConfig";
import HeaderItemExplore from "./Header/HeaderItemExplore";
import HeaderGlobal from "./Header/HeaderGlobal";
import Resume from "./Resume";
import PrivacyPolicy from "./PrivacyPolicy/PrivacyPolicy";
import TermsNConditions from "./TermsNConditions/TermsNConditions";
import Footer from "./Footer/Footer";
import WalletPage from "../Wallet";
import PaymentStatus from "../Wallet/PaymentStatus";
import OrdersPage from "../Orders";
import OrdersPaymentStatus from "../Orders/PaymentStatus";
import BlockNoteEditor from "../Dashboard/BlockNoteEditor";
// import Notification from '../../components/Notification';


class UIShell extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        activeItem: `/${window.location.pathname.split('/')[1] ?? ''}`,
        activeTab: 0,
        isSideNavExpanded: false,
        resumeDoc: '',
        searchTerm: '',
        searchResults: ['Item 1', 'Item 2', 'Item 3', 'Item 4'],
        listItems: ['Item 1', 'Item 2', 'Item 3', 'Item 4'],
        notificationOpen: false,
        notificationsData: sampleData,
      };
    }

    componentDidMount = () => {
        if(window.location.hash.includes('token')){
            localStorage.setItem('token', window.location.hash.split('?token=')[1])
        }
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
            <Provider store={store}>
                <Loader />
                <HashRouter>
                    {!window.location.pathname.startsWith('/token=')&&(<Theme theme='g100'>
                        <HeaderContainer 
                            render={({isSideNavExpanded, onClickSideNavExpand}) => (
                                <div>
                                    <Header aria-label="KALKINSO Platform">
                                        {/* <SkipToContent />
                                        <HeaderMenuButton
                                            aria-label="Open menu"
                                            onClick={onClickSideNavExpand}
                                            isActive={isSideNavExpanded}
                                        /> */}
                                        {!(window.location.pathname.split('/').length>1&&window.location.pathname.split('/')[1].startsWith('token='))&&(<><HeaderName href="/#" prefix={<img src={brandLogo} alt="KALKINSO KALKINSO Logo" height={75} />}>
                                            KALKINSO
                                        </HeaderName>
                                        <HeaderNavigation aria-label="KALKINSO App">
                                            <HeaderItemExplore />
                                            {/* <HeaderMenuItem href="/#/Contact">Contact</HeaderMenuItem> */}
                                            <HeaderMenuItem href="/#/how-to">How To</HeaderMenuItem>
                                        </HeaderNavigation></>)}
                                        <HeaderGlobal />
                                        {/* <HeaderPanel expanded={this.state.isSideNavExpanded}> */}
                                        {/* </HeaderPanel> */}
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
                                </div>
                            )}
                        />
                    </Theme>)}
                    <Theme theme='white'>
                    <Content className='content'>
                        <ToastNotification />
                        <Routes>
                            {/* <Route path="/" element={<ComingSoon />} /> */}
                            <Route path="/" element={<LandingPage />} />
                            <Route path="Search" element={<SearchPage />} />
                            <Route path="privacy-policy" element={<PrivacyPolicy />} />
                            <Route path="terms-n-conditions" element={<TermsNConditions />} />
                            <Route path="Login">
                                <Route path="" element={<VerifyOtp />} />
                                {/* <Route path="otp" element={<Login />} /> */}
                            </Route>
                            <Route path="reset-password">
                                <Route path="" element={<Navigate to="/" />} />
                                <Route path=":token" element={<PasswordReset />} />
                            </Route>
                            <Route path="Register" element={<SignUp />} />
                            <Route path="home">
                                <Route path="" element={<PrivateRoute access_page={'HOME'} Component={DashboardScreen} />} />
                                <Route path=":taskPath" element={<PrivateRoute access_page={'DASH'} Component={Kanban} />} />
                            </Route>
                            <Route path="chat" element={<PrivateRoute access_page={'AI'} Component={ChatScreen} />} />
                            <Route path="Contact" element={<ContactPage />} />
                            <Route path="how-to" element={<HowToPage />} />
                            <Route path="test-component" element={<PrivateRoute access_page={'DASH'} Component={AIReact} config={AIReactChatConfig} />} />
                            <Route path="test-dashboard" element={<PrivateRoute access_page={'DASH'} Component={AIReact} config={AIReactDashboardConfig} />} />
                            <Route path="wallet">
                                <Route path="" element={<PrivateRoute access_page={'WALLET'} Component={WalletPage} />} />
                                <Route path=":orderId" element={<PrivateRoute access_page={'WALLET'} Component={PaymentStatus} />} />
                            </Route>
                            <Route path="orders">
                                <Route path="" element={<OrdersPage  />} />
                                <Route path=":orderId" element={<OrdersPaymentStatus />} />
                            </Route>
                            {window.location.pathname.startsWith('/token=')&&<Route path="tools">
                                    <Route path="writing-assistant" element={<PrivateRoute access_page={'TOOLS'} Component={BlockNoteEditor} />} />
                                    <Route path="design-assistant" element={<PrivateRoute access_page={'TOOLS'} Component={ChatScreen} />} />
                                </Route>}
                            <Route path="ankit.see" element={
                                    <Resume />
                                } />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </Content>
                    </Theme>
                    <Theme theme='g100'>
                        <HeaderContainer render={({isSideNavExpanded, onClickSideNavExpand})=>{
                                return !window.location.pathname.startsWith('/token=')&&(
                                    <Footer />
                                )
                            }} />
                    </Theme>
                </HashRouter>
            </Provider>
        );
    }
}

export default UIShell;
