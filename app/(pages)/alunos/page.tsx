import { StudentsTable } from "@/app/components/student-related/students-table/students-table"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Alunos",
  description: "Página de alunos",
}

export default function StudentsPage() {
  return (
    <main className="flex w-full h-full justify-start flex-col gap-8 items-center min-h-[calc(100vh-68px)]">
      <h1>Esta é a página dos alunos</h1>
      <StudentsTable />
    </main>
  )
}
