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

import { useEffect, useState } from "react"
import { IOccurrencesChartData } from "@/app/models/mongoModels"
import { getTccKeywordsChartData } from "@/app/server-actions/mongoActions"

export const description = "A horizontal bar chart"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function KeyWordsChart() {
  const [keywords, setKeywords] = useState<IOccurrencesChartData[]>([])
  const [chartData, setChartData] = useState<IOccurrencesChartData[]>([])

  const fetchKeywords = async () => {
    const response = await getTccKeywordsChartData()
    if (response) {
      setKeywords(response)
      setChartData(response)
    }
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
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="occurrences" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="occurrences"
              name="Ocorrências"
              layout="vertical"
              fill="var(--color-desktop)"
              radius={4}>
              <LabelList
                dataKey="name"
                position="insideLeft"
                offset={8}
                className="fill-primary-foreground font-medium"
                fontSize={12}
              />
              <LabelList
                name="Ocorrências"
                dataKey="occurrences"
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
