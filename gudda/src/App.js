import React from 'react';
import Landing from './content/Landing';
import Feed from './content/Feed';
import Search from './content/Search';
import Release from './content/Release';
import Login from './content/Login';
import Footer from './content/Landing/Footer';
import Live from './content/Live';
import PrivateRoute from './content/routing/PrivateRoute';
import Space from './content/Space';
import { Route, Routes, HashRouter } from 'react-router-dom';


const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path='/live' element={<Live />} />
        <Route path='/space' element={<PrivateRoute Component={Space}/>} />
        <Route path='/feed'>
          <Route path=':id' element={<PrivateRoute Component={Feed} />} />
        </Route>
        {/* <Route path='/advanced-feed' element={<AdvancedFeed />} /> */}
        <Route path='/search' element={<PrivateRoute Component={Search} />} />
        <Route path='/release' element={<PrivateRoute Component={Release} />} />
        <Route path='/login' element={<PrivateRoute login={true} Component={Login} />} />
        <Route path="*" element={<PrivateRoute Component={Space} />} />
      </Routes>
      <Footer />
    </HashRouter>
  );
}

export default App;