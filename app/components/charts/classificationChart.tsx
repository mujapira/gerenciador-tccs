"use client"

import { useState, useEffect } from "react"
import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

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
import {
  getTccClassificationChartData,
  ITccClassificationChart,
} from "@/app/server-actions/tcc/getTccClassificationChartData"

export const description = "Quantidade de TCCs por Classificação"

const chartConfig = {
  tccCount: {
    label: "TCCs",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function ClassificationChart() {
  const [chartData, setChartData] = useState<ITccClassificationChart[]>([])

  async function fetchData() {
    const data = await getTccClassificationChartData()
    setChartData(data || [])
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Quantidade de TCCs por Classificação</CardTitle>
        <CardDescription>
          Visualizando a distribuição de TCCs por tipo de classificação.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[260px]">
          <RadarChart className="overflow-visible" data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="classification" width={100} />
            <PolarGrid />
            <Radar
              dataKey="occurrences"
              name="Ocorrências"
              fill="var(--color-tccCount)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
