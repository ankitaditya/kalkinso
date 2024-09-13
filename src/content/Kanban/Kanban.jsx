import React, { useEffect, useState } from 'react';
import ComponentPlayground from './component-playground/ComponentPlayground';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../actions/auth';
import { getTasks } from '../../actions/task';

const KanbanBoard = () => {
  const { taskPath } = useParams();
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.task.kanban);
  const [ breadcrumb, setBreadcrumb ] = useState([]);
  useEffect(() => {
    dispatch(setLoading(true));
    dispatch(getTasks(taskPath))
  },[])
  useEffect(() => {
    console.log('Task path:', taskPath);
    const numberCheck = new RegExp(`^create$`);
    if (taskPath&&!numberCheck.test(taskPath)&&tasks.length) {
      let tempBreadcrumb = [];
      const pathArray = taskPath.split('->');
      pathArray.forEach((path, index) => {
        tempBreadcrumb.push({
          label: path,
          key: `${index}`,
          isCurrentPage: index === pathArray.length - 1,
          items: [
            {
              label: 'item 1',
              href: '/#/home',
            },
          ],
          href: `/#/home/${pathArray.slice(0, index + 1).join('->')}`,
        });
      });
      setBreadcrumb(tempBreadcrumb);
    } else {
      dispatch(setLoading(true));
      dispatch(getTasks(taskPath))
      setBreadcrumb([
        {
          label: 'create',
          key: `0`,
          isCurrentPage: true,
          href: `/#/home/create`,
        }
      ]);
    }
    console.log('Breadcrumb:', breadcrumb);
  }, [taskPath]);
  return (
    <ComponentPlayground breadcrumb={breadcrumb} />
  );
};

export default KanbanBoard;