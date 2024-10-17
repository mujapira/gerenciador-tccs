import { StudentDetails } from "@/app/components/student-related/student-details"

import { Metadata } from "next"

export const metadata: Metadata = {

}

export default async function TeacherPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <main className="flex w-full h-full justify-start flex-col gap-4 items-center p-4 min-h-[calc(100vh-68px)]"></main>
  )
}
