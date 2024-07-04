import React, { useEffect, useState } from 'react';
import { Search, Tile, Grid, Row, Column, SelectableTag, Pagination } from '@carbon/react';
import { Asleep } from '@carbon/react/icons';
import './SearchPage.css';  // Optional CSS for custom styling
import CustomTile from './CustomTile';
import Banner from './Banner';
import logo from './banner.webp';
import AuthModal from '../Login/AuthModal';

   const SearchPage = () => {
    const itemsPerPage = 10; // Number of items per page

    const data = Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    name: `Item ${index + 1}`,
    }));
     const [searchTerm, setSearchTerm] = useState('');
     const [results, setResults] = useState([]);
     const [currentPage, setCurrentPage] = useState(1);
     const [isModalOpen, setIsModalOpen] = useState(false);

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

     const highlightText = (text, highlight) => {
       if (!highlight.trim()) {
         return text;
       }
       const regex = new RegExp(`(${highlight})`, 'gi');
       const parts = text.split(regex);
       return parts.map((part, index) => {
         return regex.test(part) ? <mark key={index}>{part}</mark> : part;
       });
     };

     return (
       <div className="search-page">
        <Grid>
            <Column md={4}
                              lg={14}
                              sm={4}>
                <Banner logoSrc={logo}
      altText="Company Logo"/>
                <Search
                id="search"
                labelText="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                placeHolderText="Search tasks..."
                />
         </Column>
         {/* <Column md={4}
                              lg={7}
                              sm={4}>
         <Grid style={{marginTop:"20px", marginBottom:"20px"}}>
            <Column>
                <SelectableTag renderIcon={Asleep} text="Software" className="some-class"  />
            </Column>
            <Column>
                <SelectableTag renderIcon={Asleep} text="Civil" className="some-class"  />
            </Column>
            <Column>
                <SelectableTag renderIcon={Asleep} text="Electronics" className="some-class"  />
            </Column>
            <Column>
                <SelectableTag renderIcon={Asleep} text="Mechanical" className="some-class"  />
            </Column>
            <Column>
                <SelectableTag renderIcon={Asleep} text="Ideation" className="some-class"  />
            </Column>
            <Column>
                <SelectableTag renderIcon={Asleep} text="Others" className="some-class"  />
            </Column>
         </Grid>
         </Column> */}
         {results.map(result => (
            <Column key={result.id} md={4}
            lg={14}
            sm={4}
            style={{marginBottom:"10px"}}>
                <CustomTile title={`Task ${result.id}`} description={highlightText(result.description, searchTerm)} imgSrc={result.img} />
            </Column>
            ))}
         <Column md={4}
                              lg={14}
                              sm={4}>
         <Pagination
          pagesUnknown={true}
          totalItems={undefined}
          pageSize={itemsPerPage}
          pageSizes={[5, 10, 20, 50, 100]}
          onChange={handlePageChange}
          page={currentPage}
        />
         </Column>
         </Grid>
         <AuthModal open={isModalOpen} onClose={handleCloseModal} />
       </div>
     );
   };

   export default SearchPage;