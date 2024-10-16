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
    <main className="flex  w-full h-full justify-center flex-col gap-8 items-center min-h-[calc(100vh-68px)]">
      <h1>esta é a página detalhada do aluno</h1>
      <StudentDetails id={parseInt(params.id)} />
    </main>
  )
}
