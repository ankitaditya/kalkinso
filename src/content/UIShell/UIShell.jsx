import React from "react";
import {
    HeaderContainer, Header, HeaderName,
    HeaderNavigation, HeaderMenuItem,
    Content,Theme, 
} from '@carbon/react';
import ToastNotification from "../../components/ToastNotification";
import { Route, Routes, HashRouter, Navigate } from 'react-router-dom';
import { sampleData } from './sampleData';

// import ErrorBoundary from "../../components/ErrorBoundary";
import LandingPage from '../LandingPage';
import ContactPage from "../ContactPage";
import SearchPage from "../SearchPage";
import { PasswordReset, VerifyOtp } from "../Login";
import SignUp from "../Signup";
// import Kanban from "../Kanban";
import ChatScreen from "../ChatScreen/ChatScreen";
import HowToPage from "../HowToPage";
import store from "../../store";
import { Provider } from "react-redux";
import Kanban from "../Kanban";
import brandLogo from './brand.png';
import Loader from "./MainLoader";
import DashboardScreen from "../Dashboard/Dashboard";
import AIReact from "./AIReact";
import PrivateRoute from "../../components/routing/PrivateRoute";
import { AIReactChatConfig, AIReactDashboardConfig } from "./AIReactConfig";
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
import AIPromptEditor from "./AIPromptEditor";
import Editor from "./AIPhotoEditor/components/Editor/Editor";
import AudioBook from "./AudioBook";
import AnalysisAssistant from "./AnalysisAssistant";
import DashboardTools from "../Dashboard/DashboardTools";
import WorkInProgress from "./WorkInProgress";
import VideoBook from "./VideoBook";
import Reports from "./Reports";
import CancellationRefund from "./CancellationRefund/CancellationRefund";
import Services from "./Services";
import TermsAndConditions from "./TermsNConditions/TermsNConditions_1_0";
import BuyCoffeePage from "./BuyMeCoffee";


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
        if(window.location.pathname.includes('token=')) {
            localStorage.setItem('token', window.location.pathname.replaceAll('/','').split('=')[1])
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
                                        {!(window.location.pathname.split('/').length>1&&window.location.pathname.split('/')[1].startsWith('token='))&&(<><HeaderName href="/#" prefix={<img src={brandLogo} alt="KALKINSO KALKINSO Logo" height={75} />}>
                                            KALKINSO
                                        </HeaderName>
                                        <HeaderNavigation aria-label="KALKINSO App">
                                            <HeaderItemExplore />
                                            <HeaderMenuItem href="/#/how-to">How To</HeaderMenuItem>
                                        </HeaderNavigation></>)}
                                        <HeaderGlobal />
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
                            <Route path="terms-n-conditions" element={<TermsAndConditions />} />
                            <Route path="return-n-refund-policy" element={<CancellationRefund />} />
                            <Route path="buy-me-coffee" element={<BuyCoffeePage />} />
                            <Route path="services" element={<Services />} />
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
                            <Route path="tools">
                                    <Route path="home" element={<PrivateRoute access_page={'TOOLS'} Component={DashboardTools} />} />
                                    <Route path="writing-assistant" element={<PrivateRoute access_page={'TOOLS'} Component={AIPromptEditor} />} />
                                    <Route path="design-assistant" element={<PrivateRoute access_page={'TOOLS'} Component={Editor} image_uri="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ718nztPNJfCbDJjZG8fOkejBnBAeQw5eAUA&s" />} />
                                    <Route path="audiobook-assistant" element={<PrivateRoute access_page={'TOOLS'} Component={AudioBook} image_uri="https://encrypted-tbn0.gstatic.com/images?q=tbn:&s" />} />
                                    <Route path="videobook-assistant" element={<PrivateRoute access_page={'TOOLS'} Component={VideoBook} image_uri="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ718nztPNJfCbDJjZG8fOkejBn" />} />
                                    <Route path="report" element={<PrivateRoute access_page={'TOOLS'} Component={Reports} image_uri="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ718nztPNJfCbDJjZG8fOkejBn" />} />
                                    <Route path="analysis-assistant" element={<PrivateRoute access_page={'TOOLS'} Component={AnalysisAssistant} image_uri="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ718nztPNJfCbDJjZG8fOkejBnBAeQw5e" />} />
                                    <Route path="*" element={<PrivateRoute access_page={'TOOLS'} Component={WorkInProgress} image_uri="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ718nztPNJfCbDJjZG8fOkejBnBAeQw5e" />} />
                            </Route>
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
