import { TeachersTable } from "@/app/components/teacher-related/teachers-table/teaches-table"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Comunidades",
  description: "Comunidades",
}

export default function Communities() {
  return (
    <main className="flex w-full h-full justify-start flex-col gap-4 items-center p-4 min-h-[calc(100vh-68px)]">
      <span className="flex w-full items-center justify-start text-3xl font-bold">
        Comunidades
      </span>
    </main>
  )
}
