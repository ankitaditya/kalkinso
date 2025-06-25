
import React, { useState, useEffect } from "react";
import { Mention } from 'primereact/mention';
import { getSmallCustomers } from './service/CustomerService';
import { ProductiveCard, UserProfileImage } from "@carbon/ibm-products";
import { FluidForm } from "carbon-components-react";
import { Button } from "@carbon/react";
import { AddComment, Attachment, FaceActivated } from "@carbon/react/icons";

export default function MentionComponent() {
    const [value, setValue] = useState('');
    const [customers, setCustomers] = useState([]);
    const [multipleSuggestions, setMultipleSuggestions]= useState([]);
    const tagSuggestions = ['primereact', 'primefaces', 'primeng', 'primevue'];

    useEffect(() => {
        getSmallCustomers().then(data => {
            data.forEach(d => d['nickname'] = `${d.name.replace(/\s+/g, '').toLowerCase()}_${d.id}`);
            setCustomers(data);
        });
    }, [])

    const onMultipleSearch = (event) => {
        const trigger = event.trigger;

        if (trigger === '@') {
            //in a real application, make a request to a remote url with the query and return suggestions, for demo we filter at client side
            setTimeout(() => {
                const query = event.query;
                let suggestions;

                if (!query.trim().length) {
                    suggestions = [...customers];
                }
                else {
                    suggestions = customers.filter((customer) => {
                        return customer.nickname.toLowerCase().startsWith(query.toLowerCase());
                    });
                }

                setMultipleSuggestions(suggestions);
            }, 250);
        }
        else if (trigger === '#') {
            setTimeout(() => {
                const query = event.query;
                let suggestions;

                if (!query.trim().length) {
                    suggestions = [...tagSuggestions];
                }
                else {
                    suggestions = tagSuggestions.filter((tag) => {
                        return tag.toLowerCase().startsWith(query.toLowerCase());
                    });
                }

                setMultipleSuggestions(suggestions);
            }, 250);
        }
    }

    const itemTemplate = (suggestion) => {
        const src = 'https://primefaces.org/cdn/primereact/images/avatar/' + suggestion.representative.image;
        
        return (
            <ProductiveCard onClick={()=>{}} title={suggestion.name} media={<UserProfileImage kind='user' image={src} size='md' style={{marginTop:'2px'}}/>} mediaPosition="left" subTitle={`@${suggestion.nickname}`} image={src} />
        );
    }

    const multipleItemTemplate = (suggestion, options) => {
        const trigger = options.trigger;

        if (trigger === '@' && suggestion.nickname) {
            return itemTemplate(suggestion);
        }
        else if (trigger === '#' && !suggestion.nickname) {
            return <span>{suggestion}</span>;
        }

        return null;
    }
    

    return (
            <Mention 
            value={value} 
            onChange={(e) => setValue(e.target.value)} 
            trigger={['@', '#']} 
            suggestions={multipleSuggestions} 
            onSearch={onMultipleSearch}    
            field={['nickname']} 
            placeholder="Enter @ to mention people, # to mention tag" 
            itemTemplate={multipleItemTemplate} rows={5} cols={120} />
    )
}
        