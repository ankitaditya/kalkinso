import { EditSidePanel, pkg, UserProfileImage, SidePanel } from "@carbon/ibm-products";
import { Dropdown, FilterableMultiSelect, TextArea, TextInput, usePrefix } from "@carbon/react";
import { useState } from "react";
import costaPic from '../../SearchPage/component-playground/_story-assets/costa.jpeg';
import { useSelector } from "react-redux";
import ChatScreen from "./ChatScreen/ChatScreen";


const SidePanelChat = ({
    isSideNavExpanded,
    closeSideNav
  }) => {
    pkg.component.SidePanel = true;
    const carbonPrefix = usePrefix();
    const itemsGender = ['Male', 'Female', 'Other'];
    const itemsPath = ['Fresher', 'Professional', 'Administrator', 'Explorer'];
    const profile = useSelector(state => state.profile);
    // const [open, setOpen] = useState(false);

    const [topicValue, setTopicValue] = useState('Sita Ram Chandra');
    const [ userInput, setUserInput ] = useState(profile);
    return <SidePanel id="storybook-id" title="Ease Assistance" subtitle="Lets think together!" size="2xl" primaryButtonText="Send" secondaryButtonText="Cancel" open={isSideNavExpanded} onRequestClose={() => closeSideNav()} selectorPrimaryFocus={`.${carbonPrefix}--text-input`}>
                <ChatScreen />
            </SidePanel>;
  }

export default SidePanelChat;