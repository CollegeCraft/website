import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";

import {
  Select, 
  Checkbox,
  MenuItem,
} from "@material-ui/core";


function makeArr(startValue: number, stopValue: number, cardinality: number): number[] {
  var arr: number[] = [];
  var step = (stopValue - startValue) / (cardinality - 1);
  for (var i = 0; i < cardinality; i++) {
    arr.push(startValue + (step * i));
  }
  return arr;
}

function ButtonsResult({ data, reset }) {
  return (
    <button className="button">submit</button>
  );
}

export type FormInputs = {
  SAT_Math?: number;
  SAT_Reading?: number;
  SAT_Writing?: number;
  Reach: boolean;
  Target: boolean;
  Safety: boolean;
  Unknown: boolean;
};
export const defaultValues: FormInputs = {
  Reach: true,
  Target: true,
  Safety: true,
  Unknown: true,
};


interface CalculatorFormProps {
  data: any,
  setData: any,
};
export function CalculatorForm({ data, setData }: CalculatorFormProps) {
  const { handleSubmit, reset, control } = useForm<FormInputs>({defaultValues});
  const scores = makeArr(200, 800, 61);
  scores.reverse();
  const menus = [{
    name: 'Math', type: 'SAT_Math' as const
  }, {
    name: 'Reading', type: 'SAT_Reading' as const
  }, {
    name: 'Writing', type: 'SAT_Writing' as const
  }];
  // TODO(nautilik): Eventually let the user check stuff.
  const types = ["Reach" as const, "Target" as const, "Safety" as const, "Unknown" as const]

  return (
    <form onSubmit={handleSubmit((data) => {
      setData(data);
      console.log(data);
    })} className="form">
      <div className="container">
        {menus.map(({name, type}) => (
          <section>
            <label>SAT {name} Score: </label>
            <Controller
              name={type}
              control={control}
              as={
                <Select>
                  <MenuItem></MenuItem>
                  {scores.map((value: number) => (
                    <MenuItem key={`SAT-${name}-${value}`} value={value}>{value}</MenuItem>
                  ))}
                </Select>
              }
            />
          </section>   
        ))}
        {types.map((type) => (
          <section>
            <label>{type}</label>
            <Controller
              name={type}
              control={control}
              render={(props) => (
                <Checkbox
                  disabled={true}
                  onChange={(e) => props.onChange(e.target.checked)}
                  checked={props.value}
                />
              )}
            />
          </section>
        ))}
      </div>

      <ButtonsResult {...{ data, reset }} />
    </form>
  );
}