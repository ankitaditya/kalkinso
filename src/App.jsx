import React, { Component } from 'react';
import UIShell from './content/UIShell/UIShell';
import './App.scss';

class App extends Component {
  componentDidMount() {
    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
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
