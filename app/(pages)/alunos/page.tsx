import { StudentsTable } from "@/app/components/student-related/students-table/students-table"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Alunos",
  description: "Página de alunos",
}

export default function StudentsPage() {
  return (
    <main className="flex w-full h-full items-start justify-start flex-col gap-4 p-4 min-h-[calc(100vh-68px)]">
      <span className="flex w-full items-center justify-start text-3xl font-bold">
        Alunos
      </span>
      <Link prefetch href="/alunos/novo">
        <Button>Cadastrar novo aluno</Button>
      </Link>
      <StudentsTable />
    </main>
  )
}

