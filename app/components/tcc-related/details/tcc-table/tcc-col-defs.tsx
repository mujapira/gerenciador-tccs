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
import { ITccDetailed } from "@/app/models/tcc/tccModel"
import { Badge } from "@/components/ui/badge"

export const tccTableColumns: ColumnDef<ITccDetailed>[] = [
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
      return <span>{tcc.tituloTcc}</span>
    },
  },
  // {
  //   accessorKey: "nomeAluno",
  //   header: "Aluno",
  //   cell: ({ row }) => {
  //     const tcc = row.original
  //     return (
  //       <Link href={`/alunos/${tcc.alunoId}`}>
  //         <Button className="px-0" variant={"link"}>
  //           {tcc.nomeAluno}
  //         </Button>
  //       </Link>
  //     )
  //   },
  // },
  // {
  //   accessorKey: "nomeOrientador",
  //   header: "Orientador",
  //   cell: ({ row }) => {
  //     const tcc = row.original
  //     return (
  //       <Link href={`/orientadores/${tcc.orientadorId}`}>
  //         <Button className="px-0" variant={"link"}>
  //           {tcc.nomeOrientador}
  //         </Button>
  //       </Link>
  //     )
  //   },
  // },
  {
    accessorKey: "nomeTurma",
    header: "Turma",
    cell: ({ row }) => {
      const tcc = row.original
      return <span>{tcc.nomeTurma}</span>
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

      if (tcc.estadoAtual === "Em andamento") {
        return (
          <Badge className="bg-yellow-500 w-full flex items-center justify-center">
            {tcc.estadoAtual}
          </Badge>
        )
      }
      if (tcc.estadoAtual === "Aprovado") {
        return (
          <Badge className="bg-green-500 w-full flex items-center justify-center">
            {tcc.estadoAtual}
          </Badge>
        )
      }
      if (tcc.estadoAtual === "Em Avaliação") {
        return (
          <Badge className="bg-blue-500 w-full flex items-center justify-center">
            {tcc.estadoAtual}
          </Badge>
        )
      }
      if (tcc.estadoAtual === "Reprovado") {
        return (
          <Badge className="bg-red-500 w-full flex items-center justify-center">
            {tcc.estadoAtual}
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
