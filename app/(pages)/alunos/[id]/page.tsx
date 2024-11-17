import { StudentDetails } from "@/app/components/student-related/student-details"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, CrownIcon } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"

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
      <div className="flex items-start w-full gap-4">
        <Button variant="ghost">
          <Link href="/alunos">
            <ArrowLeftIcon />
          </Link>
        </Button>
        <span className="flex w-full items-center justify-start text-3xl font-bold">
          Aluno
        </span>
      </div>
      <StudentDetails id={params.id} />
    </main>
  )
}