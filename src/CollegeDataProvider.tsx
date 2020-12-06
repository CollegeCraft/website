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

/** Cartesian product */
const cartesian =
  (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));

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

type School = "Target" | "Reach" | "Safety" | "Unknown";
const SATFilter = (() => {
  const prefix = "latest.admissions.sat_scores";
  const percentiles = ["25th_percentile", "midpoint", "75th_percentile"];
  const names = ["math", "critical_reading", "writing"];
  const ranges = cartesian(percentiles, names).map(
    ([percentile, name]) => `${prefix}.${percentile}.${name}__range=200..800`
  );
  return ranges.join("&")
})();

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
  return `${baseUrl}.json?api_key=${APIKey}&_fields=${fields.join(',')}&per_page=${pageSize}&page=${pageIndex}&${SATFilter}&sort=${sortField}:asc`;
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

function maxSchool(a: School, b: School): School {
  if (a === "Reach" || b === "Reach") {
    return "Reach" as const
  }
  if (a === "Target" || b === "Target") {
    return "Target" as const;
  }
  if (a === "Safety" || b === "Safety") {
    return "Safety" as const;
  }
  return "Unknown" as const;
}

function compareSchool(school: any, key: string, value: number): School {
  if (school.latest.admissions.sat_scores["75th_percentile"][key] < value) {
    return "Safety" as const
  }
  if ( value <= school.latest.admissions.sat_scores["25th_percentile"][key]) {
    return "Reach" as const
  }
  return "Target" as const
}

function getType(school: any, math: number | undefined, reading: number | undefined): School {
  if (school.latest.admissions.admission_rate.consumer_rate < 0.15) {
    return "Reach" as const;
  }
  if (math === undefined && reading === undefined) {
    return "Unknown" as const;
  }
  if (reading !== undefined && math !== undefined) {
    return maxSchool(
      compareSchool(school, "critical_reading", reading),
      compareSchool(school, "math", math)
    );
  }
  if (reading !== undefined) {
    return compareSchool(school, "critical_reading", reading);
  }
  if (math !== undefined) {
    return compareSchool(school, "math", math);
  }
  return "Unknown" as const;
}


/** Function that adds derived fields to the downloaded data */
function postProcessResults<T>(results: T[], filter: FormInputs): (T & {type: School})[] {
  const {
    SAT_Math,
    SAT_Reading,
    Reach,
    Target,
    Safety,
    Unknown,
  } = filter;
  const typedSchools = results.map((value: any) => {
    value.type = getType(value, SAT_Math, SAT_Reading);
    return value;
  });
  const filtered = typedSchools.filter((value) => {
    return (
      (Reach && value.type === "Reach") || 
      (Target && value.type === "Target") ||
      (Safety && value.type === "Safety") ||
      (Unknown && value.type === "Unknown")
    );
  });
  return filtered;
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
    const postData = postProcessResults(json.results.map(unflatten), filter);
    return {
      status: "LOADED",
      pageCount: Math.ceil(json.metadata.total / json.metadata.per_page),
      data: postData,
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


