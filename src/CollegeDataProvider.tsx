import React from "react";
import { baseUrl, APIKey } from "./constants";
import {CollegeTable} from "./CollegeTable"


/* Computes the admit rate */
function adminRateAccessor(row): string {
  const percent = 100*row.latest.admissions.admission_rate.consumer_rate;
  return `${percent.toFixed(2)}%`;
}

const columns = [
  {
    Header: "Recommended Colleges",
    columns: [
      {
        id: "schoolname",
        Header: "School Name",
        accessor: "school.name"
      },
      {
        id: "adminrate",
        Header: "Admissions Rate",
        accessor: adminRateAccessor
      }
    ]
  }
];

export type APIResponse = { status: "LOADING" } | { status: "LOADED"; pageCount: number, data: any } | {status: "ERROR"; error: any };

function apiUrl(pageSize: number, pageIndex: number): string {
  const fields = [
    'latest.admissions',
    'latest.earnings.10_yrs_after_entry.median',
    'school.city',
    'school.state',
    'school.school_url',
    'school.name',
  ];
  // eg. https://api.data.gov/ed/collegescorecard/v1/schools.json?school.degrees_awarded.predominant=2,3&fields=id,school.name,2013.student.size
  return `${baseUrl}.json?api_key=${APIKey}&_fields=${fields.join(',')}&per_page=${pageSize}&page=${pageIndex}`;
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

/**
  Makes a GET request as per the specified URL to retrieve the APIResponse.

  @params url - The url to request.

  @returns: A APIResponse depending on the URL response.

*/
async function apiRequest(pageSize: number, pageIndex: number): Promise<APIResponse> {
  const url = apiUrl(pageSize, pageIndex)
  try {
    const res = await fetch(url);
    const json = await res.json();
    return {
      status: "LOADED",
      pageCount: json.metadata.total,
      data: json.results.map(unflatten),
     } as APIResponse;
  } catch(err) {
    return { status: "ERROR", error: err } as APIResponse;
  }
}

export function CollegeDataProvider() {
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
    const res = await apiRequest(pageSize, pageIndex);

    if (fetchId === fetchIdRef.current && res.status === 'LOADED') {
      setData(res.data);
      setPageCount(res.pageCount);
      setLoading(false);
    }
  }, []);

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


