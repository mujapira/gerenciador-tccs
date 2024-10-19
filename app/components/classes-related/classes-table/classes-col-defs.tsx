import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { MoreHorizontal } from "lucide-react"
import { ArrowUpDown } from "lucide-react"
import { IClass, IClassWithStudents } from "@/app/models/classes/classModel"
import { Checkbox } from "@/components/ui/checkbox"

export const classesTableColumns: ColumnDef<IClassWithStudents>[] = [
  {
    accessorKey: "nome",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const turma = row.original
      return (
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => row.toggleSelected(!row.getIsSelected())}>
          <span>{turma?.nome}</span>
        </div>
      )
    },
  },
  {
    id: "Alunos",
    header: ({ column }) => {
      return <span className="flex items-center justify-center">Alunos</span>
    },

    cell: ({ row }) => {
      const turma = row.original
      return (
        <span className="flex items-center justify-center">
          {turma.alunos.length}
        </span>
      )
    },
  },
]
