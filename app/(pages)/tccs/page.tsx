import { TccsDetails } from "@/app/components/tcc-related/tccs-details"

import { Metadata } from "next"

export const metadata: Metadata = {
  title: "TCC's",
  description: "Página de TCCs",
}

export default function TccsPage() {
  return (
    <main className="flex w-full h-full items-start justify-start flex-col gap-4 p-4 min-h-[calc(100vh-68px)]">
      <span className="flex w-full items-center justify-start text-3xl font-bold">
        TCCs
      </span>
      <TccsDetails />
    </main>
  )
}
