import { StudentDetails } from "@/app/components/student-related/student-details"
import { TeacherDetails } from "@/app/components/teacher-related/teacher-details"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"

import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Orientador",
  description: "Página de orientador",
}

export default async function TeacherPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <main className="flex w-full h-full justify-start flex-col gap-4 items-center p-4 min-h-[calc(100vh-68px)]">
      <div className="flex items-start w-full gap-4">
        <Button variant="ghost">
          <Link href="/orientadores">
            <ArrowLeftIcon />
          </Link>
        </Button>
        <span className="flex w-full items-center justify-start text-3xl font-bold">
          Orientador
        </span>
      </div>
      <TeacherDetails id={Number(params.id)} />
    </main>
  )
}
