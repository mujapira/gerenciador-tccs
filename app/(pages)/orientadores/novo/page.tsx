import NewTeacherForm from "@/app/components/teacher-related/new-teacher-form/new-teacher-form"
import { Button } from "@/components/ui/button"
import NewStudentForm from "@components/student-related/new-student-form/new-student-form"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

export default function NewStudentPage() {
  return (
    <main className="flex w-full h-full justify-start flex-col gap-4 items-start p-4 min-h-[calc(100vh-68px)]">
      <div className="flex items-start w-full gap-4">
        <Button variant="ghost">
          <Link href="/alunos">
            <ArrowLeftIcon />
          </Link>
        </Button>
        <span className="flex w-full items-center justify-start text-3xl font-bold">
          Novo orientador
        </span>
      </div>
      <NewTeacherForm />
    </main>
  )
}
