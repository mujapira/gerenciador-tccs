import { TccsDetails } from "@/app/components/tcc-related/details/tccs-details"
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
      title: "Palavras Chave",
      description: "Gerencie as palavras-chave associadas aos TCCs",
      link: "/tccs/palavras-chave",
    },
    {
      title: "Classificações",
      description: "Visualize as classificações atribuídas aos TCCs",
      link: "/tccs/classificaçoes",
    },
    {
      title: "Avaliações",
      description: "Gerencie as avaliações feitas para os TCCs",
      link: "/tccs/avaliaçoes",
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
        {sections.map((section, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow min-w-[300px] max-w-[300px]">
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={section.link}>
                <Button className="mt-2 w-full">Acessar</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
