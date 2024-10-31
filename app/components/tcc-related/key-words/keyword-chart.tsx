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

export const description = "A horizontal bar chart"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-5))",
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

  const fetchKeywords = async () => {
    const response = await GetKeyWords()
    setKeywords(response)

    //pegar as 5 que mais se repetem e colocar no chartData
    const data = response
      .slice(0, 5)
      .sort((a, b) => b.ocorrencias - a.ocorrencias)
    setChartData(data)
  }

  useEffect(() => {
    fetchKeywords()
  }, [])

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Palavras-Chave</CardTitle>
        <CardDescription>Janeiro - Outubro 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-w-[400px]">
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
                className="fill-primary-foreground font-medium"
                fontSize={12}
              />
              <LabelList
                dataKey="ocorrencias"
                position="insideBottomRight"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
