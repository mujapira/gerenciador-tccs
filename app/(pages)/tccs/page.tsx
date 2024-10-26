import { TccsDetails } from "@/app/components/tcc-related/details/tccs-details"
import { KeyWords } from "@/app/components/tcc-related/key-words/key-words"
import { KeyWordsChart } from "@/app/components/tcc-related/key-words/keyword-chart"
import { ThemesChart } from "@/app/components/tcc-related/themes/themes-chart"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "TCC's",
  description: "Página de TCCs",
}

export default function TccsPage() {
  const sections = [
    {
      title: "TCCs",
      description: "Visualize e gerencie os TCCs cadastrados",
      link: "/tccs/detalhes",
    },
    {
      title: "Relatórios de Progresso",
      description: "Acompanhe o progresso dos TCCs",
      link: "/tccs/relatorios-progresso",
    },
  ]

  return (
    <main className="flex w-full h-full items-start justify-start flex-col gap-6 p-4 min-h-[calc(100vh-68px)]">
      <span className="text-3xl font-bold">TCCs</span>
      <div className="flex flex-wrap gap-4">
        <Card>
          <CardHeader>
            <CardTitle>TCCs</CardTitle>
            <CardDescription>
              Visualize e gerencie os TCCs cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/tccs/detalhes">
              <Button>Visualizar</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
     
    </main>
  )
}
