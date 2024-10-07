export const cache = (action, dispatch) => {
    
    if (action.type === 'CLEAR_CACHE') {
        if (action.payload){
            // clear cache for specific action
            let data = window.localStorage.getItem('__data');
            delete data[action.payload];
            window.localStorage.setItem('__data', data);
            return true;
        }
        // clear cache
        window.localStorage.removeItem('__data');
        return true;
    }

    // check if cache is available
    const data = window.localStorage.getItem('__data');
    if (data){
        const cache = JSON.parse(data);
        if (cache[action.type]){
            dispatch(cache[action.type]);
            return true;
        }
    }
    return false;
  }