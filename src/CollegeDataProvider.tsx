import React from "react";
import { baseUrl, APIKey } from "./constants";
import {CollegeTable} from "./CollegeTable"
import type {FormInputs} from "./Form";


/**
  Utility function to extract elements from an object.

  @param object - The javascript object from which to extra an element
  @param path - The path to find

  @returns The extract object at the path, or null if the path is undefined
*/
function get(object: any, path: string): any | null {
  return path.split('.').reduce((xs, x) => ((xs != null && xs[x] != null) ? xs[x] : null), object);
}

/* Computes the admit rate */
function adminRateAccessor(row): string {
  const rate = get(row, "latest.admissions.admission_rate.consumer_rate");
  if (rate == null) {
    return "N/A";
  }
  return `${(100*(rate as number)).toFixed(2)}%`;
}

const columns = [
  {
    Header: "Recommended Colleges",
    columns: [
      {
        id: "schoolname",
        Header: "School Name",
        accessor: "school.name",
      },
      {
        id: "type",
        Header: "Application Type",
        accessor: "type",
      },
      {
        id: "adminrate",
        Header: "Admissions Rate",
        accessor: adminRateAccessor,
      },
      {
        id: "satmath",
        Header: "SAT 25th Math",
        accessor: "latest.admissions.sat_scores.25th_percentile.math",
      },
      {
        id: "satreading",
        Header: "SAT 25th Reading",
        accessor: "latest.admissions.sat_scores.25th_percentile.critical_reading",
      },
    ]
  }
];

type School = "Target" | "Reach" | "Safety" | "N/A";
/** Generates the option to append to API request to retrieve the given set of schools. */
function SATFilter(type: School, {SAT_Math}: FormInputs) {
  if (SAT_Math === undefined) {
    return "";
  }
  const prefix = "latest.admissions.sat_scores";
  switch (type) {
    case "Reach":
      return `${prefix}.25th_percentile.math__range=${SAT_Math}..800`
    case "Safety":
      return `${prefix}.75th_percentile.math__range=200..${SAT_Math}`
    case "Target":
      return `${prefix}.25th_percentile.math__range=200..${SAT_Math}&${prefix}.75th_percentile_math__range=${SAT_Math}..800`;
  }
}

export type APIResponse = { status: "LOADING" } | { status: "LOADED"; pageCount: number, data: any } | {status: "ERROR"; error: any };

function apiUrl(pageSize: number, pageIndex: number, filter: FormInputs): string {
  const fields = [
    'latest.admissions',
    'latest.earnings.10_yrs_after_entry.median',
    'school.city',
    'school.state',
    'school.school_url',
    'school.name',
  ];
  const sortField = "latest.admissions.admission_rate.consumer_rate"
  // Only pull down reach schools.
  // eg. https://api.data.gov/ed/collegescorecard/v1/schools.json?school.degrees_awarded.predominant=2,3&fields=id,school.name,2013.student.size
  return `${baseUrl}.json?api_key=${APIKey}&_fields=${fields.join(',')}&per_page=${pageSize}&page=${pageIndex}&${SATFilter("Reach", filter)}&sort=${sortField}:asc`;
}

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


/** Function that adds derived fields to the downloaded data */
function postProcessResults(results: any[], {SAT_Math, SAT_Reading}: FormInputs): any[] {
  return results.map((value: any) => {
    if (SAT_Math === undefined) {
      value.type = "N/A" as const;
      return value;
    }
    if (value.latest.admissions.sat_scores["75th_percentile"].math < SAT_Math) {
      value.type = "Safety" as const
    }
    else if ( SAT_Math <= value.latest.admissions.sat_scores["25th_percentile"].math) {
      value.type = "Reach" as const
    }
    else {
      value.type = "Target" as const
    }
    return value;
  });
}

/**
  Makes a GET request as per the specified URL to retrieve the APIResponse.

  @params url - The url to request.

  @returns: A APIResponse depending on the URL response.

*/
async function apiRequest(pageSize: number, pageIndex: number, filter: FormInputs): Promise<APIResponse> {
  const url = apiUrl(pageSize, pageIndex, filter)
  try {
    const res = await fetch(url);
    const json = await res.json();
    return {
      status: "LOADED",
      pageCount: Math.ceil(json.metadata.total / json.metadata.per_page),
      data: postProcessResults(json.results.map(unflatten), filter),
     } as APIResponse;
  } catch(err) {
    return { status: "ERROR", error: err } as APIResponse;
  }
}


interface CollegeDataProviderProps {
  filter: FormInputs
}
export function CollegeDataProvider({ filter }: CollegeDataProviderProps) {
  // We'll start our table without any data
  const [data, setData] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [pageCount, setPageCount] = React.useState(0)
  const fetchIdRef = React.useRef(0)

  const fetchData = React.useCallback(async ({ pageSize, pageIndex }) => {
    // Give this fetch an ID
    const fetchId = ++fetchIdRef.current;

    // Set the loading state
    setLoading(true);

    // Grab Results.
    const res = await apiRequest(pageSize, pageIndex, filter);

    if (fetchId === fetchIdRef.current && res.status === 'LOADED') {
      setData(res.data);
      setPageCount(res.pageCount);
      setLoading(false);
    }
  }, [filter]);

  return (
    <CollegeTable
      columns={columns}
      data={data}
      fetchData={fetchData}
      loading={loading}
      pageCount={pageCount}
    />
  )
}


