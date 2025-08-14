"use client";

import * as React from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Input } from "./ui/input";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  refetchIndex: number;
  triggerRefetch: () => void;
}

export function ReimbursementDatatable<TData, TValue>({
  columns,
  refetchIndex,
  triggerRefetch,
}: DataTableProps<TData, TValue>) {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [pagination, setPagination] = React.useState({
    isFirstPage: true,
    isLastPage: false,
    paginationSize: 100,
    pageNumber: 1,
    offset: 0,
  });

  async function fetchData() {
    setLoading(true);

    let filterStr = "";
    if (columnFilters.length !== 0) {
      filterStr = ("&changedBy=" + columnFilters[0].value) as string;
    }

    const sortQuery = sorting
      .map(({ id, desc }) => (desc ? `-${id}` : `+${id}`))
      .join(",");
    const res = await fetch(
      `/api/v1/reimbursements?sortArray=${encodeURIComponent(sortQuery)}&paginationPage=${pagination.pageNumber}${filterStr}`
    );

    const json = await res.json();

    if (!res.ok) {
      console.error(json);
      setError(json.error || "Something Went Wrong...");
      return;
    }

    setData(json.data);
    setPagination(json.pagination);
    setLoading(false);
  }

  function PlaceholderRow({
    colSpan,
    text,
  }: {
    colSpan: number;
    text: string;
  }) {
    return (
      <TableRow>
        <TableCell colSpan={colSpan} className="h-24 text-center">
          {text}
        </TableCell>
      </TableRow>
    );
  }
  const table = useReactTable({
    data,
    columns,
    manualSorting: true,
    manualPagination: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex: pagination.pageNumber - 1,
        pageSize: pagination.paginationSize,
      },
    },
    pageCount: pagination.isLastPage
      ? pagination.pageNumber
      : pagination.pageNumber + 1,
    meta: {
      triggerRefetch,
    },
  });

  function handlePrev() {
    if (!pagination.isFirstPage && !loading) {
      setPagination((p) => ({
        ...p,
        pageNumber: Math.max(1, p.pageNumber - 1),
      }));
    }
  }

  function handleNext() {
    if (!pagination.isLastPage && !loading) {
      setPagination((p) => ({
        ...p,
        pageNumber: p.pageNumber + 1,
      }));
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sorting,
    pagination.pageNumber,
    pagination.paginationSize,
    columnFilters,
    refetchIndex,
  ]);

  return (
    <>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter employee ID..."
          value={
            (table.getColumn("txEmployeeCode")?.getFilterValue() as string) ??
            ""
          }
          onChange={(event) =>
            table
              .getColumn("txEmployeeCode")
              ?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {error ? (
              <PlaceholderRow colSpan={columns.length} text={error} />
            ) : loading ? (
              <PlaceholderRow colSpan={columns.length} text="Loading..." />
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="even:bg-gray-100"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <PlaceholderRow colSpan={columns.length} text="No results..." />
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePrev()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleNext()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </>
    // </div>
  );
}
