/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useTable } from "react-table";
import cn from "classnames";

const Table = ({
  data,
  columns,
  rowStyle = "primary",
}: {
  data: any;
  columns: any;
  rowStyle?: string;
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  return (
    <div className="flex justify-center md:justify-start flex-col shadow-sm w-full">
      <div className="overflow-x-auto touch relative">
        <table
          className="w-full overflow-hidden"
          cellPadding="0"
          cellSpacing="0"
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup: any, index: number) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column: any) => {
                  return (
                    <th
                      className={cn(
                        "bg-[#0A0A0A] font-medium border-none px-3 sm:px-4 py-3 text-left text-xs text-gray-400"
                      )}
                      {...column.getHeaderProps()}
                      key={column.id}
                    >
                      {column.render("Header")}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()} className="">
            {rows.map((row: any) => {
              prepareRow(row);

              return (
                <tr {...row.getRowProps()} key={row.id} className="border-t border-gray-800">
                  {row.cells.map((cell: any, cellIndex: number) => {
                    return (
                      <td
                        className={cn(
                          "text-white px-3 sm:px-4 py-4 text-left text-xs whitespace-nowrap",
                          {
                            "bg-[#0A0A0A]": rowStyle === "primary" || rowStyle === "secondary",
                          }
                        )}
                        {...cell.getCellProps()}
                        key={cell.column.id}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
