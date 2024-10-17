import NewStudentForm from "@/app/components/student-related/new-student-form/new-student-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function NewStudentPage() {
  return (
    <main className="flex w-full h-full justify-start flex-col gap-4 items-start p-4 min-h-[calc(100vh-68px)]">
      <span className="flex w-full items-center justify-start text-3xl font-bold">
        Novo aluno
      </span>
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Informações do novo aluno</CardTitle>
          <CardDescription>
            Informe os dados do novo aluno para cadastrá-lo no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewStudentForm />
        </CardContent>
      </Card>
    </main>
  )
}
