import React from "react";
import { baseUrl, APIKey } from "./constants";


export type ContextState = { status: "LOADING" } | { status: "LOADED"; data: any } | {status: "ERROR"; error: any };

const Context = React.createContext<ContextState| null>(null);

const apiUrl = ((): string => {
  const fields = [
    'latest.admissions',
    'latest.earnings.10_yrs_after_entry.median',
    'school.city',
    'school.state',
    'school.school_url',
    'school.name',
  ];
  // eg. https://api.data.gov/ed/collegescorecard/v1/schools.json?school.degrees_awarded.predominant=2,3&fields=id,school.name,2013.student.size
  return `${baseUrl}.json?api_key=${APIKey}&_fields=${fields.join(',')}`;
})();

/**
  Unflattens the the given JSON Object.filter

  @params obj - The object containing flattend keys of the form 'a.b.c.d'

  @returns The unflatted object.
*/
function unflatten(obj) {
  if (Object(obj) !== obj || Array.isArray(obj))
      return obj;
  var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
      resultholder = {};
  for (var p in obj) {
      var cur = resultholder,
          prop = "",
          m;
      while (m = regex.exec(p)) {
          cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
          prop = m[2] || m[1];
      }
      cur[prop] = obj[p];
  }
  return resultholder[""] || resultholder;
};

/**
  Makes a GET request as per the specified URL to retrieve the ContextState.

  @params url - The url to request.

  @returns: A ContextState depending on the URL response.

*/
async function apiRequest(url: string): Promise<ContextState> {
  try {
    const res = await fetch(apiUrl);
    const json = await res.json();
    return {
      status: "LOADED",
      data: {
        results: json.results.map(unflatten),
      }
     } as ContextState;
  } catch(err) {
    return { status: "ERROR", error: err } as ContextState;
  }
}

/**
  Fetches the colelge data asynchronousely using Contexts in React.

  @returns: The Fetched ContextState.
*/
export const useCollegeData = (): ContextState => {
  const contextState = React.useContext(Context);
  if (contextState === null) {
    throw new Error("fetchCollegeData must be used within a CollegeDataProvider tag.");
  }
  return contextState;
}


type SchoolFilter = {};

export const CollegeDataProvider: React.FC<{ filter: SchoolFilter }> = (props) => {
  const [state, setState] = React.useState<ContextState>({ status: "LOADING"});

  React.useEffect(() => {
    setState({ status: "LOADING"});

    (async () => { setState(await apiRequest(apiUrl) )})();
  }, [ props.filter ]);

  return (
    <Context.Provider value={state}>
      {props.children}
    </Context.Provider>
  );
}