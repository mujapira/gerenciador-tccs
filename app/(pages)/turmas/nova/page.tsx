import NewClassForm from "@/app/components/classes-related/new-class/new-class-form/new-class-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Turmas",
  description: "Página de turmas",
}

export default function NewClassPage() {
  return (
    <main className="flex w-full h-full items-start justify-start flex-col gap-4 p-4 min-h-[calc(100vh-68px)]">
      <span className="flex w-full items-center justify-start text-3xl font-bold">
        Turmas
      </span>

      <NewClassForm />
    </main>
  )
}
