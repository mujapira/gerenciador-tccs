import { StudentDetails } from "@/app/components/student-related/student-details"
import { KeyWordDetails } from "@/app/components/tcc-related/key-words/key-word-details"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Palavra-Chave | Detalhes",
  description: "Página de um Palavra-Chave",
}

export default async function KeyWordPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <main className="flex w-full h-full justify-start flex-col gap-4 items-center p-4 min-h-[calc(100vh-68px)]">
      <div className="flex items-start w-full gap-4">
        <Button variant="ghost">
          <Link href="/tccs">
            <ArrowLeftIcon />
          </Link>
        </Button>
        <span className="flex w-full items-center justify-start text-3xl font-bold">
          Palavra-Chave
        </span>
      </div>

      <KeyWordDetails id={parseInt(params.id)} />
    </main>
  )
}
