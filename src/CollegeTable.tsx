import React from "react";

import { useTable, useFilters, useGlobalFilter } from "react-table";
import type { Column } from "react-table";
import { DefaultColumnFilter, GlobalFilter } from "./Filter";

import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import "./react-table-config.d";
import { useCollegeData } from "./CollegeDataProvider"


type TableProps<T extends object> = {
  data: T[];
  columns: Column<T>[];
};

function CollegeTable<T extends object>({columns, data}: TableProps<T>) {
  const filterTypes = React.useMemo(
    () => ({
      text: (rows: any, id: any, filterValue: any) => {
        return rows.filter((row: any) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      }
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      Header: '',
      Filter: DefaultColumnFilter
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable({
      columns,
      data,
      defaultColumn,
      filterTypes,
    },
    useFilters,
    useGlobalFilter,
  );

  return (
    <MaUTable {...getTableProps()}>
      <TableHead>
        {headerGroups.map(headerGroup => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <TableCell {...column.getHeaderProps()}>
                {column.render("Header")}
                <div>{column.canFilter ? column.render("Filter") : null}</div>
              </TableCell>
            ))}
          </TableRow>
        ))}
        <TableRow>
          <th
            colSpan={visibleColumns.length}
            style={{
              textAlign: "left"
            }}>
              <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={state.globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
            </th>
        </TableRow>
      </TableHead>
      <TableBody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <TableRow {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <TableCell {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </MaUTable>
  );
};


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

export const CollegeTableContext = (props) => {
  const res = useCollegeData();

  if (res.status === 'LOADING') {
    return <div>Loading</div>
  }
  if (res.status === 'ERROR') {
    return <div>Unable to load item data</div>
  }
  return (
    <CollegeTable columns={columns} data={res.data.results} />
  )
};