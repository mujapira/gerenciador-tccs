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
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { ITeacher } from "@/app/models/mongoModels"
import { formatCPF, formatPhoneNumber } from "@/app/utils/formatters"

export const teacherTableColumns: ColumnDef<ITeacher>[] = [
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
      const student = row.original
      return (
        <div className="flex items-center space-x-2">
          <Image
            width={24}
            height={24}
            src={student?.caminho_foto || "/images/placeholder.png"}
            alt="Imagem do aluno"
            className="h-8 w-8 rounded-full object-cover"
          />
          <span>{student?.nome}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "cpf",
    header: "CPF",
    cell: ({ getValue }) => formatCPF(getValue() as string),
  },
  {
    accessorKey: "telefone",
    header: "Telefone",
    cell: ({ getValue }) => formatPhoneNumber(getValue() as string),
  },
  {
    accessorKey: "tituloAcademico",
    header: "Titulo",
  },
  {
    accessorKey: "departamento",
    header: "Departamento",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const student = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href={`/orientadores/${student?.id}`}>
              <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
            </Link>
            <Link href={`/orientadores/editar/${student?.id}`}>
              <DropdownMenuItem>Editar</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
