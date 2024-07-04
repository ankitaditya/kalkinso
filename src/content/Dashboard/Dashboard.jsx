import React from 'react';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Checkbox,
  Button,
  TextInput,
} from '@carbon/react';
import {
  Dashboard,
  CloudMonitoring,
  Activity,
  Search,
  Settings,
  ChatBot,
} from '@carbon/icons-react';
import SearchPage from '../SearchPage';
import Kanban from '../Kanban';
import ChatScreen from '../ChatScreen/ChatScreen';
import AnalyticsDashboard from './AnalyticsDashboard';

const DashboardScreen = () => {
  return (
    <Tabs aria-label="Tabs example">
      <TabList activation="manual" aria-label="List of tabs" fullWidth>
        <Tab renderIcon={Search} style={{minWidth:"6vw"}}>Tasks</Tab>
        <Tab renderIcon={CloudMonitoring} style={{minWidth:"6vw"}}>Kanban</Tab>
        <Tab renderIcon={ChatBot} style={{minWidth:"6vw"}}>Chat</Tab>
        <Tab renderIcon={Activity} style={{minWidth:"6vw"}}>Analyze</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <SearchPage />
        </TabPanel>
        <TabPanel>
          <Kanban />
        </TabPanel>
        <TabPanel>
          <ChatScreen />
        </TabPanel>
        <TabPanel>
          <AnalyticsDashboard />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default DashboardScreen;