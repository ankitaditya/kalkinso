import axios from 'axios';

export const getIpInfo = async () => {
    let data = {
        appVersion: navigator.appVersion,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        userAgentPlatform: navigator.userAgentData.platform,
    };

    try {
        const res = await axios.get('https://ipinfo.io/ip');
        data.ip = res.data;
    } catch (err) {
        console.log('Error getting appVersion info: ', err);
    }
    return data;
  }