import { Loading } from "carbon-components-react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenTask } from "../../actions/task";
import SelectHeirarchy from '../SearchPage/SelectHeirarchy/SelectHeirarchy';
import { useEffect } from "react";
import { loadUser, setLoading } from "../../actions/auth";

const Loader = () => {
    const dispatch = useDispatch();
    const { isMulti, openTask, selectedTask } = useSelector((state) => state.task);
	const auth = useSelector(state => state.auth)
	const { isAuthenticated, loading } = auth;
	useEffect(() => {
		if(isAuthenticated) {
            // console.log("Redirecting to search page");
            // dispatch(setLoading(false));
			// window.location.href =  window.location.origin + '/#/home/search'
		}
	}, [isAuthenticated, loading])

    return (
        <>
        <Loading active={loading} />
        <SelectHeirarchy isMulti={isMulti} open={openTask} task_id={selectedTask} onClose={()=>dispatch(setOpenTask(``))} onSubmit={()=>{window.location.replace(window.location.origin+'/#/home/create');window.location.reload()}} />
        </>
    );
    };

export default Loader;