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
import { getTccThemesChartData } from "@/app/server-actions/mongoActions"


export const description = "A horizontal bar chart"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function ThemesChart() {
  const [chart, setChart] = useState<IOccurrencesChartData[]>()
  const [chartData, setChartData] = useState<IOccurrencesChartData[]>([])
  const [domain, setDomain] = useState<number[]>([0, 1])

  const fetchChart = async () => {
    const response: IOccurrencesChartData[] = await getTccThemesChartData()

    setChart(response)
    console.log(response)
    if (!response) return

    setChartData(response)
    setDomain([0, Math.max(...response.map((item) => item.occurrences))])
  }

  useEffect(() => {
    fetchChart()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Temas</CardTitle>
        <CardDescription>Janeiro - Outubro 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-w-[400px]">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            barSize={64}
            maxBarSize={128}
            margin={{
              right: 16,
            }}
          
            >
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
            <XAxis dataKey="occurrences" type="number" hide domain={domain} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="occurrences"
              layout="vertical"
              fill="var(--color-desktop)"
              name="Ocorrências"
              radius={4}>
              <LabelList
                dataKey="name"
                name="Ocorrências"
                position="insideLeft"
                offset={8}
                className="fill-foreground font-medium"
                fontSize={12}
              />
              <LabelList
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
