import React from 'react';
import './App.css';
import { CollegeTable } from './CollegeTable';

const data = [
  { firstName: "jane", lastName: "doe", age: 20 },
  { firstName: "john", lastName: "smith", age: 21 }
];

const columns = [
  {
    Header: "Name",
    columns: [
      {
        Header: "First Name",
        accessor: "firstName"
      },
      {
        Header: "Last Name",
        accessor: "lastName"
      }
    ]
  },
  {
    Header: "Other Info",
    columns: [
      {
        Header: "Age",
        accessor: "age"
      }
    ]
  }
];

function App() {
  return (
    <div className="App">
      <CollegeTable columns={columns} data={data} />
    </div>
  );
}

export default App;
