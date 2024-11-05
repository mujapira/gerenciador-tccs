import { Communities } from "@/app/components/community-related/community-list"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Comunidades",
  description: "Comunidades",
}

export default function CommunitiesPage() {
  return (
    <main className="flex w-full h-full justify-start flex-col gap-4 items-center p-4 min-h-[calc(100vh-68px)]">
      <span className="flex w-full items-center justify-start text-3xl font-bold">
        Comunidades
      </span>
      <Communities />
    </main>
  )
}
