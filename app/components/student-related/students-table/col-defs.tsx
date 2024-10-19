import { ColumnDef } from "@tanstack/react-table"
import { IStudent } from "../../../models/studentsModel"
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

const formatCPF = (cpf: string) => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}

const formatPhone = (phone: string) => {
  if (phone.length === 11) {
    return phone.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2-$3-$4")
  } else {
    return phone
  }
}

export const studentTableColumns: ColumnDef<IStudent>[] = [
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
    accessorKey: "matricula",
    header: "Matrícula",
  },
  {
    accessorKey: "cpf",
    header: "CPF",
    cell: ({ getValue }) => formatCPF(getValue() as string),
  },
  {
    accessorKey: "telefone",
    header: "Telefone",
    cell: ({ getValue }) => formatPhone(getValue() as string),
  },
  {
    accessorKey: "cidade",
    header: "Cidade",
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
            <Link href={`/alunos/${student?.id}`}>
              <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
            </Link>
            <Link href={`/alunos/editar/${student?.id}`}>
              <DropdownMenuItem>Editar</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
