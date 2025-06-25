import { useEffect, useState } from 'react';
import { Image } from 'semantic-ui-react';
import axios from 'axios';

const Thumbnail = ({ src, alt, relative=false }) => {
    const [ image, setImage ] = useState(<></>);
    useEffect(() => {
        if (relative) {
            const params = {
                Bucket: 'kalkinso.com',
                Key: src,
                Expires: 3600*48
            }
            axios.post('/api/auth/get-signed-url', { params, operation: 'getObject' }).then(res => {
                setImage(<Image src={res.data.url} verticalAlign="middle" spaced='right' size='tiny' />);
            }).catch(err => {
                setImage(<Image src={`https://via.placeholder.com/100?text=${alt}`} verticalAlign="middle" spaced='right' size='tiny' />);
            });
        } else {
            setImage(<Image src={src} verticalAlign="middle" spaced='right' size='tiny' />);
        }
    }, []);
    return image;
}

export default Thumbnail;