import React from 'react';
import Landing from './content/Landing';
import Feed from './content/Feed';
import Search from './content/Search';
import Release from './content/Release';
import Login from './content/Login';
import { Route, Routes, HashRouter, Navigate } from 'react-router-dom';
import Footer from './content/Landing/Footer';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path='/feed' element={<Feed />} />
        {/* <Route path='/advanced-feed' element={<AdvancedFeed />} /> */}
        <Route path='/search' element={<Search />} />
        <Route path='/release' element={<Release />} />
        <Route path='/login' element={<Login />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </HashRouter>
  );
}

export default App;