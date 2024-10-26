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
import { GetThemes, ITheme } from "@/app/server-actions/tcc/getThemes"

export const description = "A horizontal bar chart"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function ThemesChart() {
  const [chart, setChart] = useState<ITheme[]>([
    { id: 1, tema: "Carregando", ocorrencias: 1 },
    { id: 2, tema: "Carregando", ocorrencias: 1 },
    { id: 3, tema: "Carregando", ocorrencias: 1 },
    { id: 4, tema: "Carregando", ocorrencias: 1 },
    { id: 5, tema: "Carregando", ocorrencias: 1 },
    { id: 6, tema: "Carregando", ocorrencias: 1 },
  ])
  const [chartData, setChartData] = useState<ITheme[]>([])

  const fetchChart = async () => {
    const response: ITheme[] = await GetThemes()

    setChart(response)

    if (!response) return

    const data = response
      .slice(0, 5)
      .sort((a, b) => b.ocorrencias - a.ocorrencias)

    setChartData(data)
  }

  useEffect(() => {
    fetchChart()
  }, [])

  return (
    <Card className="max-h-[300px]">
      <CardHeader>
        <CardTitle>Temas</CardTitle>
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
              dataKey="descricao"
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
                dataKey="tema"
                position="insideLeft"
                offset={8}
                className="fill-background font-medium"
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
  )
}
