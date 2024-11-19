import React, { Component } from 'react';
import UIShell from './content/UIShell/UIShell';
import './App.scss';
import { getIpInfo } from './utils/utils';

class App extends Component {
  componentDidMount() {
    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });

    fetch('/api/config').then(res => res.json()).then(data => {
      if (data) {
        Object.keys(data).forEach(key => {
          process.env[key] = data[key];
        });
      }
    });
    
    document.addEventListener('keydown', function (e) {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
      }
    });
  }
  render() {
    return (
      <div className="app">
        <UIShell />
      </div>
    );
  }
}

export default App;
