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
import { ITcc } from "@/app/models/mongoModels"

export const tccTableColumns: ColumnDef<ITcc>[] = [
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
      return <span>{tcc.titulo}</span>
    },
  },
  {
    accessorKey: "nomeAluno",
    header: "Aluno",
    cell: ({ row }) => {
      const tcc = row.original
      return (
        <span>
          {tcc.aluno.nome}
        </span>
      )
    },
  },
  {
    accessorKey: "nomeOrientador",
    header: "Orientador",
    cell: ({ row }) => {
      const tcc = row.original
      return (
        <span>
          {tcc.orientador.nome}
        </span>
      )
    },
  },
  {
    accessorKey: "estadoAtual",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Estado
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },

    cell: ({ row }) => {
      const tcc = row.original

      if (tcc.status.descricao === "Pendente de Revisão") {
        return (
          <Badge className="bg-yellow-500 w-full flex items-center justify-center">
            {tcc.status.descricao}
          </Badge>
        )
      }
      if (tcc.status.descricao === "Aprovado") {
        return (
          <Badge className="bg-green-500 w-full flex items-center justify-center">
            {tcc.status.descricao}

          </Badge>
        )
      }
      if (tcc.status.descricao === "Em Avaliação") {
        return (
          <Badge className="bg-blue-500 w-full flex items-center justify-center">
            {tcc.status.descricao}

          </Badge>
        )
      }
      if (tcc.status.descricao === "Reprovado") {
        return (
          <Badge className="bg-red-500 w-full flex items-center justify-center">
            {tcc.status.descricao}

          </Badge>
        )
      }
    },
  },
  // {
  //   accessorKey: "notaFinal",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         className="flex items-center w-full justify-center"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
  //         Nota Final
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     )
  //   },

  //   cell: ({ getValue }) => {
  //     const notaFinal = getValue() as number
  //     return (
  //       <span className="text-center flex w-full  items-center justify-center">
  //         {notaFinal}
  //       </span>
  //     )
  //   },
  // },
]
