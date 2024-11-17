import EditStudentForm from "@/app/components/student-related/edit-student-form/edit-student-form"
import EditTeacherForm from "@/app/components/teacher-related/edit-teacher-form/edit-teacher-form"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

export default function EditTeacherPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <main className="flex w-full h-full justify-start flex-col gap-4 items-start p-4 min-h-[calc(100vh-68px)]">
      <div className="flex items-start w-full gap-4">
        <Button variant="ghost">
          <Link href="/orientadores">
            <ArrowLeftIcon />
          </Link>
        </Button>
        <span className="flex w-full items-center justify-start text-3xl font-bold">
          Editar informações do orientador
        </span>
      </div>
      <EditTeacherForm id={params.id} />
    </main>
  )
}
