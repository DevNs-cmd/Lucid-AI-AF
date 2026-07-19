import * as React from "react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyLabel?: string;
}

export default function DataTable<T>({ columns, rows, rowKey, emptyLabel = "No records found." }: DataTableProps<T>) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-elevated/50">
              {columns.map((col) => (
                <th key={col.header} className={cn("text-left px-4 py-3 text-xs uppercase tracking-wide text-muted font-medium", col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center py-10 text-muted text-sm">
                  {emptyLabel}
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={rowKey(row)} className="border-b border-border/60 last:border-0 hover:bg-elevated/40 transition">
                {columns.map((col) => (
                  <td key={col.header} className={cn("px-4 py-3 text-ink", col.className)}>
                    {col.accessor(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
