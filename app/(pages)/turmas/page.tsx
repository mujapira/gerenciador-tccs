import { ClassesDetails } from "@/app/components/classes-related/classes-details"
import { NewClass } from "@/app/components/classes-related/new-class/new-class"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Turmas",
  description: "Página de turmas",
}

export default function ClassesPage() {
  return (
    <main className="flex w-full h-full items-start justify-start flex-col gap-4 p-4 min-h-[calc(100vh-68px)]">
      <span className="flex w-full items-center justify-start text-3xl font-bold">
        Turmas
      </span>

      <Link prefetch href="/turmas/nova">
        <Button>Adicionar nova turma</Button>
      </Link>

      <ClassesDetails />
    </main>
  )
}
