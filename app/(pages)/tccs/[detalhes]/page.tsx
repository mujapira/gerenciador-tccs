import { TccsDetails } from "@/app/components/tcc-related/details/tccs-details"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"

import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "TCC's | Detalhes",
  description: "Página de TCCs detalhados",
}

export default function TccsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return (
    <main className="flex w-full h-full items-start justify-start flex-col gap-4 p-4 min-h-[calc(100vh-68px)]">
      <div className="flex items-start w-full gap-4">
        <Button variant="ghost">
          <Link href="/tccs">
            <ArrowLeftIcon />
          </Link>
        </Button>
        <span className="flex w-full items-center justify-start text-3xl font-bold">
          TCCs - Detalhes
        </span>
      </div>

      <TccsDetails />
    </main>
  )
}
