import { ToastNotification } from "@carbon/react";
import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { loadUser, setLoading } from "../../actions/auth";

const Notification = ({alerts}) => {
  const [notifications, setNotifications] = useState(<></>);
  const alerts_notif = useSelector(state => state.alert);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
    useEffect(() => {
        // console.log('isAuthenticated:', auth);
        if(!isAuthenticated&&localStorage.getItem('token')) {
            if(
                (window.location.pathname.split('/').length>1&&window.location.pathname.split('/')[1].startsWith('token='))
            ){
                localStorage.setItem('token', window.location.pathname.split('/')[1].replace('token=',''))
            }
            dispatch(setLoading(true));
            if(localStorage.getItem('token')){
                dispatch(loadUser({token: localStorage.getItem('token')}));
            }
        }
    },[])
  useEffect(
    () => {
        if (alerts_notif?.length > 0){
            setNotifications(<>{alerts_notif.map(alert =>
                <ToastNotification
                  style={{ position: "fixed", top: "10vh", right: "5vw", zIndex: 9999}}
                  title={"Alert!"}
                  kind={alert.alertType}
                  subtitle={alert.msg}
                  caption={Date.now().toString()}
                  timeout={60*60*2}
                />
              )}</>);
        } else {
            setNotifications(<></>);
        }
    },
    [alerts_notif]
  );

  return notifications;
};

const mapStateToProps = state => ({
  alerts: state.alert
});

export default connect(mapStateToProps)(Notification);
