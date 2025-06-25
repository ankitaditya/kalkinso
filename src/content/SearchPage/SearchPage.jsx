import React, { useEffect, useState } from 'react';
import { Search, Tile, Grid, Row, Column, SelectableTag, Pagination } from '@carbon/react';
import { Asleep } from '@carbon/react/icons';
import './SearchPage.css';  // Optional CSS for custom styling
import CustomTile from './CustomTile';
import Banner from './Banner';
import logo from './banner.webp';
import AuthModal from '../Login/AuthModal';
import Gallery from './Gallery/Gallery';
import { useNavigate } from 'react-router-dom';
import ComponentPlayground from './component-playground/ComponentPlayground';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, setLoading } from '../../actions/auth';

   const SearchPage = (props) => {
    const itemsPerPage = 10; // Number of items per page

    const data = Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    name: `Item ${index + 1}`,
    }));
     const [searchTerm, setSearchTerm] = useState('');
     const { token, isAuthenticated } = useSelector((state) => state.auth);
     const dispatch = useDispatch();
     const [results, setResults] = useState([]);
     const [currentPage, setCurrentPage] = useState(1);
     const [isModalOpen, setIsModalOpen] = useState(false);
     const navigate = useNavigate();

    //  useEffect(() => {
    //     if(!isAuthenticated&&!localStorage.getItem('token')) {
    //       dispatch(setLoading(true));
    //       dispatch(loadUser({token: localStorage.getItem('token')}))
    //     }
    //   },[]);

        const handleOpenModal = () => {
            setIsModalOpen(true);
        };

        const handleCloseModal = () => {
            setIsModalOpen(false);
        };
    
    useEffect(() => {
        setTimeout(() => {
            handleOpenModal();
        }, 5000);
    }, []);

    const handlePageChange = ({ page }) => {
        setCurrentPage(page);
    };
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

     const allTasks = [
       { id: 1, img: 'https://marketplace.canva.com/EAE0rNNM2Fg/1/0/1600w/canva-letter-c-trade-marketing-logo-design-template-r9VFYrbB35Y.jpg', description: 'Example task one with valuable information.' },
       { id: 2, img: 'https://marketplace.canva.com/EAE0rNNM2Fg/1/0/1600w/canva-letter-c-trade-marketing-logo-design-template-r9VFYrbB35Y.jpg', description: 'Another task featuring different details.' },
       { id: 3, img: 'https://marketplace.canva.com/EAE0rNNM2Fg/1/0/1600w/canva-letter-c-trade-marketing-logo-design-template-r9VFYrbB35Y.jpg', description: 'Task three involves challenging assignments.' }
       // Add more tasks as required
     ];

     const handleSearchChange = (e) => {
       const value = e.target.value;
       setSearchTerm(value);
       filterTasks(value);
     };

     const filterTasks = (searchTerm) => {
       const filteredResults = allTasks.filter(task => {
         return task.description.toLowerCase().includes(searchTerm.toLowerCase());
       });
       setResults(filteredResults.length ? filteredResults : allTasks);
     };

     return (
       <div className="search-page" {...props}>
         <ComponentPlayground {...props} />
       </div>
     );
   };

   export default SearchPage;