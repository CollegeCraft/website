import React from 'react';
import './App.css';
import { CollegeDataProvider } from './CollegeDataProvider';
import { CalculatorForm, defaultValues } from "./Form";
import type {FormInputs} from "./Form";

function App() {
  const [data, setData] = React.useState<FormInputs>(defaultValues);
  return (
    <>
      <CalculatorForm setData={setData} data={data} />
      <CollegeDataProvider filter={data} />
    </>
  );
}

export default App;
