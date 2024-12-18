import React from 'react';
import Landing from './content/Landing';
import Feed from './content/Feed';
import Search from './content/Search';
import Release from './content/Release';
import Login from './content/Login';
import { Route, Routes, HashRouter } from 'react-router-dom';
import Footer from './content/Landing/Footer';
import PrivateRoute from './content/routing/PrivateRoute';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path='/feed' element={<PrivateRoute Component={Feed} />} />
        {/* <Route path='/advanced-feed' element={<AdvancedFeed />} /> */}
        <Route path='/search' element={<PrivateRoute Component={Search} />} />
        <Route path='/release' element={<PrivateRoute Component={Release} />} />
        <Route path='/login' element={<Login />} />
        <Route path="*" element={<PrivateRoute Component={Feed} />} />
      </Routes>
      <Footer />
    </HashRouter>
  );
}

export default App;