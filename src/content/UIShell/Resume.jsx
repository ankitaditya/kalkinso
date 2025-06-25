import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from 'axios';
import { ProductiveCard, pkg } from "@carbon/ibm-products";
import { Document } from "@carbon/react/icons";

pkg.component.ProductiveCard = true;

const Resume = () => {
    const { selectedTask } = useSelector((state) => state.kits);
    const [resumeDoc, setResumeDoc] = useState(<></>);
    useEffect(() => {
        if (selectedTask?.entries?.length>0) {
            axios.get(selectedTask.entries[0].children.entries.find(child => child.id === 'RESUME.html').signedUrl)
            .then(res => {
                setResumeDoc(
                    <iframe title="resume" id="resume" name="resume" srcDoc={res.data} style={{minHeight:"75vh"}} />
                );
                // console.log(res.data);
                // console.log(typeof res.data);
            })
            .catch(err => {
                console.log(err);
            });
        }
    }, [selectedTask]);
    return <ProductiveCard
    label=""
    actionIcons={[
        {
            id: '1',
            icon: (props) => <Document size={20} {...props} />,
            iconDescription: 'Print',
            onClick: () => {
                window.frames["resume"].print();
            }
        }
    ]}
    actionsPlacement="top"
    // onClick={()=>{}}
    description=""
    // overflowActions={}
    // onPrimaryButtonClick={() => {}}
    // primaryButtonText={"View"}
    // secondaryButtonText={"Start"}
    // onSecondaryButtonClick={() => handleTaskOpen('multi')}
    title=""
  >
    {resumeDoc}
  </ProductiveCard>;
};

export default Resume;