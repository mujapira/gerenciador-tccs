import { StudentsTable } from "@/app/components/student-related/students-table/students-table"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Alunos",
  description: "Página de alunos",
}

export default function StudentsPage() {
  return (
    <main className="flex w-full h-full justify-start flex-col gap-4 items-center p-4 min-h-[calc(100vh-68px)]">
      <span className="flex w-full items-center justify-start text-3xl font-bold">Alunos</span>
      <StudentsTable />
    </main>
  )
}
