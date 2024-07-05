import { EditSidePanel, pkg } from "@carbon/ibm-products";
import { Dropdown, NumberInput, TextInput, usePrefix } from "@carbon/react";
import { useState } from "react";


const SidePanel = ({
    isSideNavExpanded,
    closeSideNav
  }) => {
    pkg.component.EditSidePanel = true;
    const carbonPrefix = usePrefix();
    const items = ['Day(s)', 'Month(s)', 'Year(s)'];
    // const [open, setOpen] = useState(false);
    const [topicValue, setTopicValue] = useState('Cluster management');
    return <EditSidePanel id="storybook-id" title="Edit Work" primaryButtonText="Save" secondaryButtonText="Cancel" open={isSideNavExpanded} onRequestClose={() => closeSideNav()} onRequestSubmit={() => closeSideNav()} selectorPrimaryFocus={`.${carbonPrefix}--text-input`}>
                <TextInput id="create-side-panel-topic-name-a" labelText="Topic name" className={`${carbonPrefix}form-item`} placeholder="Enter topic name" value={topicValue} onChange={event => setTopicValue(event.target.value)} />
                <NumberInput iconDescription="Choose a number" id="1" className={`${carbonPrefix}form-item`} label="Partitions" min={0} max={50} value={1} />
                <NumberInput iconDescription="Choose a number" id="2" className={`${carbonPrefix}form-item`} label="Replicas" min={0} max={50} value={1} />
                <NumberInput iconDescription="Choose a number" id="3" className={`${carbonPrefix}form-item`} label="Minimum in-sync replicas" min={0} max={50} value={1} />
                <div style={{
                display: 'grid',
                alignItems: 'flex-end',
                gridGap: '0.75rem',
                gridTemplateColumns: '1fr 1fr'
                }}>
                    <NumberInput iconDescription="Choose a number" id="4" className={`${carbonPrefix}form-item`} label="Retention time" min={0} max={50} value={30} />
                    <Dropdown id="create-side-panel-dropdown-options-a" items={items} initialSelectedItem="Day(s)" label="Options" titleText="Options" className={`${carbonPrefix}form-item`} />
                </div>
                <NumberInput iconDescription="Choose a number" id="5" className={`${carbonPrefix}form-item`} label="Minimum in-sync replicas" min={0} max={50} value={1} />
            </EditSidePanel>;
  }

export default SidePanel;