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

export const description = "A horizontal bar chart"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function KeyWordsChart() {
  const [keywords, setKeywords] = useState<IKeyWord[]>([
    { id: 1, palavra: "Carregando", ocorrencias: 1 },
    { id: 2, palavra: "Carregando", ocorrencias: 1 },
    { id: 3, palavra: "Carregando", ocorrencias: 1 },
    { id: 4, palavra: "Carregando", ocorrencias: 1 },
    { id: 5, palavra: "Carregando", ocorrencias: 1 },
    { id: 6, palavra: "Carregando", ocorrencias: 1 },
  ])
  const [chartData, setChartData] = useState<IKeyWord[]>([])
  const [newKeyword, setNewKeyword] = useState("")

  const fetchKeywords = async () => {
    const response = await GetKeyWords()
    setKeywords(response)

    //pegar as 5 que mais se repetem e colocar no chartData
    const data = response
      .slice(0, 5)
      .sort((a, b) => b.ocorrencias - a.ocorrencias)
    setChartData(data)
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
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Palavras-Chave</CardTitle>
          <CardDescription>Lista de palavras chave dos TCCs</CardDescription>
        </CardHeader>
        <CardContent className="max-w-[400px] min-w-[400px] ">
          <div className="flex flex-wrap gap-2 items-start">
            {keywords.map((keyword, index) => (
              <Badge variant={"secondary"} key={index} className="">
                <span>{keyword.palavra}</span>
              </Badge>
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

      <Card>
        <CardHeader>
          <CardTitle>Palavras-Chave</CardTitle>
          <CardDescription>Janeiro - Outubro 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                right: 16,
              }}>
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="palavra"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                hide
              />
              <XAxis dataKey="ocorrencias" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar
                dataKey="ocorrencias"
                layout="vertical"
                fill="var(--color-desktop)"
                radius={4}>
                <LabelList
                  dataKey="palavra"
                  position="insideLeft"
                  offset={8}
                  className="fill-[--color-label] "
                  fontSize={12}
                />
                <LabelList
                  dataKey="ocorrencias"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Palavras-Chave mais usadas nesse ano{" "}
            <TrendingUp className="h-4 w-4" />
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
