import React from 'react';
import './App.css';
import { CollegeTableContext } from './CollegeTable';
import { CollegeDataProvider } from './CollegeDataProvider';

function App() {
  return (
    <div className="App">
      <CollegeDataProvider filter=''>
        <CollegeTableContext/>
      </CollegeDataProvider>
    </div>
  );
}

export default App;
