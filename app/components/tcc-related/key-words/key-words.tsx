"use client"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { GetKeyWords, IKeyWord } from "@/app/server-actions/tcc/getKeyWords"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { AddKeyWord } from "@/app/server-actions/tcc/addKeyWord"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Toast } from "@/components/ui/toast"
import Link from "next/link"
import { KeyWordsChart } from "./keyword-chart"

export const description = "A horizontal bar chart"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function KeyWords() {
  const [keywords, setKeywords] = useState<IKeyWord[]>([
    { id: 1, palavra: "Carregando", ocorrencias: 1 },
    { id: 2, palavra: "Carregando", ocorrencias: 1 },
    { id: 3, palavra: "Carregando", ocorrencias: 1 },
    { id: 4, palavra: "Carregando", ocorrencias: 1 },
    { id: 5, palavra: "Carregando", ocorrencias: 1 },
    { id: 6, palavra: "Carregando", ocorrencias: 1 },
  ])

  const [newKeyword, setNewKeyword] = useState("")

  const fetchKeywords = async () => {
    const response = await GetKeyWords()
    setKeywords(response)
  }

  const handleAddKeyword = async () => {
    if (!newKeyword.trim()) return

    try {
      await AddKeyWord({ palavra: newKeyword })

      fetchKeywords()

      setNewKeyword("")
    } catch (error) {
      Toast({
        content: "Erro ao adicionar palavra-chave",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchKeywords()
  }, [])

  return (
    <div className="flex gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Palavras-Chave</CardTitle>
          <CardDescription>Lista de palavras chave dos TCCs</CardDescription>
        </CardHeader>
        <CardContent className="max-w-[400px] min-w-[400px] ">
          <div className="flex flex-wrap gap-2 items-start">
            {keywords.map((keyword, index) => (
              <Link href={`palavras-chave/${keyword.id}`}>
                <Button variant={"secondary"} key={index} className="">
                  {keyword.palavra}
                </Button>
              </Link>
            ))}
            {keywords.length === 0 && (
              <span className="text-sm text-foreground">
                Nenhuma palavra-chave cadastrada
              </span>
            )}
          </div>

          <Separator className="my-8" />

          <div className="">
            <Input
              placeholder="Adicionar nova palavra-chave"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              className="mb-2"
            />
            <Button onClick={handleAddKeyword} className="w-full">
              Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>
      <KeyWordsChart />
    </div>
  )
}
