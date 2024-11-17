"use client"

import { Activity, TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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
import { getTccGradesChartData } from "@/app/server-actions/mongoActions"
import { IOccurrencesChartData } from "@/app/models/mongoModels"

export const description = "Nota final dos TCCs"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-2))",
    icon: Activity,
  },
} satisfies ChartConfig

export function GradesChart() {
  const [chartData, setChartData] = useState<IOccurrencesChartData[]>([])

  async function fetchChartData() {
    const response = await getTccGradesChartData()
    if (response)
      setChartData(response)
  }

  useEffect(() => {
    fetchChartData()
  }, [])

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Nota final dos TCCs</CardTitle>
        <CardDescription>
          Janeiro - Outubro 2024
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-w-[400px]">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              name="Nota"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Area
              name="Ocorrências"
              dataKey="occurrences"
              type="step"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
