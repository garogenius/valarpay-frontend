/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTable, Column } from "react-table";

interface CustomTableProps {
  data: any[];
  columns: Column<any>[];
}

const MobileTable: React.FC<CustomTableProps> = ({ data, columns }) => {
  const { rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <div className="w-full">
      <div className="bg-bg-600 dark:bg-bg-1100 rounded-xl flex flex-col gap-6 py-4">
        {rows.map((row, rowIndex) => {
          prepareRow(row);

          // Find the actions cell
          const actionCell = row.cells.find(
            (cell) => String(cell.column.Header) === "Actions"
          );

          // Filter out the actions cell from regular cells
          const regularCells = row.cells.filter(
            (cell) => String(cell.column.Header) !== "Actions"
          );

          return (
            <div key={rowIndex} className="px-5 2xs:px-6 flex flex-col gap-4">
              <div className="flex flex-col  gap-2">
                {/* Render Actions cell at the top if it exists */}
                {actionCell && (
                  <div className="flex justify-end">
                    {actionCell.render("Cell")}
                  </div>
                )}

                {/* Render all other cells */}
                <div className="flex flex-col">
                  {regularCells.map((cell, cellIndex) => (
                    <div
                      key={cellIndex}
                      className="flex items-center py-2.5 gap-4"
                    >
                      <div className="w-1/3 font-medium text-xs 2xs:text-sm text-text-200 dark:text-text-400">
                        {String(cell.column.Header)}
                      </div>
                      <div className="w-2/3 flex justify-start text-xs 2xs:text-sm text-text-200 dark:text-text-400">
                        {cell.render("Cell")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {rowIndex !== rows.length - 1 && (
                <hr className="border border-bg-1700" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileTable;
