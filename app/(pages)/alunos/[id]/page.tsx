import { StudentDetails } from "@/app/components/student-related/student-details"

import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Aluno",
  description: "Página de um aluno",
}

export default async function StudentPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <main className="flex w-full h-full justify-start flex-col gap-4 items-center p-4 min-h-[calc(100vh-68px)]">
      <span className="flex w-full items-center justify-start text-3xl font-bold">
        Aluno
      </span>
      <StudentDetails id={parseInt(params.id)} />
    </main>
  )
}
