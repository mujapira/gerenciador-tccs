import NewStudentForm from "@components/student-related/new-student-form/new-student-form"

export default function NewStudentPage() {
  return (
    <main className="flex w-full h-full justify-start flex-col gap-4 items-start p-4 min-h-[calc(100vh-68px)]">
      <span className="flex w-full items-center justify-start text-3xl font-bold">
        Novo aluno
      </span>
      <NewStudentForm />
    </main>
  )
}
