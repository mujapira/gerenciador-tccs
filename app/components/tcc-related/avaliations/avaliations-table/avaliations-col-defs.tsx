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
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ITccDetailed } from "@/app/models/tcc/tccModel"

export const avaliationTableColumns: ColumnDef<ITccDetailed>[] = [
  {
    accessorKey: "tituloTcc",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Título
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const tcc = row.original
      return <span>{tcc?.tituloTcc || "Sem título"}</span>
    },
  },
  {
    accessorKey: "nomeTurma",
    header: "Turma",
    cell: ({ row }) => {
      const tcc = row.original
      return <span>{tcc?.nomeTurma || "Sem turma"}</span>
    },
  },
  {
    accessorKey: "numeroAvaliacoes",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Avaliações
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const tcc = row.original

      const statusMap = {
        0: "",
        1: "",
        2: "",
        3: "bg-blue-500",
      } as Record<number, string>

      const badgeColor = statusMap[tcc.numeroAvaliacoes] || "bg-gray-500"

      return (
        <Badge
          className={`${badgeColor} w-full flex items-center justify-center`}>
          {tcc.numeroAvaliacoes}
          {"/"}
          {"3"}
        </Badge>
      )
    },
  },
]
