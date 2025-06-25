import React, { Component, useEffect } from 'react';
import UIShell from './content/UIShell/UIShell';
import './App.scss';
import { getIpInfo } from './utils/utils';
import { useDispatch } from 'react-redux';
// import { env } from './utils/env';

const App = () => {
  useEffect(() => {
    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });

    // env();
    
    document.addEventListener('keydown', function (e) {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
      }
    });
  }, []);
  return (
    <div className="app">
      <UIShell />
    </div>
  );
}

export default App;
