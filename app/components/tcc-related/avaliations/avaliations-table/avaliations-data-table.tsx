"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Fragment, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"

interface AvaliationDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onRowClick: (row: TData) => void
}

export function AvaliationDataTable<TData, TValue>({
  columns,
  data,
  onRowClick
}: AvaliationDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  useEffect(() => {
    table.setPageSize(6)
  }, [])

  return (
    <div className="w-full">
      <div>{}</div>
      <div className="flex items-center py-4 gap-4 w-2/3">
        <Input
          placeholder="Filtrar por titulo..."
          value={
            (table.getColumn("tituloTcc")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("tituloTcc")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <Input
          placeholder="Filtrar por aluno..."
          value={
            (table.getColumn("nomeAluno")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("nomeAluno")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <Input
          placeholder="Filtrar por orientador..."
          value={
            (table.getColumn("nomeOrientador")?.getFilterValue() as string) ??
            ""
          }
          onChange={(event) =>
            table
              .getColumn("nomeOrientador")
              ?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border p-4 w-full min-h-[300px] min-w-[900px]">
        <Table className="h-full">
          <TableHeader>
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
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => {
                    setSelectedRowId(row.id)
                    onRowClick(row.original)
                  }}
                  className={`cursor-pointer  ${
                    row.id === selectedRowId ? "bg-muted/50" : ""
                  }`}>
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
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center h-full justify-end space-x-2 p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            Próximo
          </Button>
        </div>
      </div>
    </div>
  )
}
