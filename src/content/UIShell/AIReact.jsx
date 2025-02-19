import React from "react-dom";
import { AllComponents, ComponentMap } from "./AIReactConfig";

const AIReact = ({config}) => {

  return Object.keys(config).map((key)=>{
    if (Array.isArray(config[key])){
        return config[key].map((subConfig, index)=>{
            let {SubComponent, ...rest} = subConfig;
            let Component = ComponentMap[key];
            if(SubComponent){
            return <Component key={index} {...rest}><AIReact config={SubComponent} /></Component>
            } else {
                return <Component key={index} {...rest} />
            }
        })
    } else {
        let {SubComponent, ...rest} = config[key];
        let Component = ComponentMap[key];
        if(SubComponent){
        return <Component {...rest}><AIReact config={SubComponent} /></Component>
        } else {
            return <Component {...rest} />
        }
    }
});
};

export default AIReact;