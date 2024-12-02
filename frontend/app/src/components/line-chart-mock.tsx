"use client"

import { Rocket } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

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

export const description = "A multiple line chart"

const chartData = [
  { month: "January", online: 186, presenza: 80 },
  { month: "February", online: 305, presenza: 200 },
  { month: "March", online: 237, presenza: 120 },
  { month: "April", online: 73, presenza: 190 },
  { month: "May", online: 209, presenza: 130 },
  { month: "June", online: 214, presenza: 140 },
]

const chartConfig = {
  online: {
    label: "Online",
    color: "hsl(var(--chart-1))",
  },
  presenza: {
    label: "In presenza",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function Linechart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment Completati</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="online"
              type="monotone"
              stroke="var(--color-online)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="presenza"
              type="monotone"
              stroke="var(--color-presenza)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Stanno andando tutti benissimo! <Rocket className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Mostra il numero totale di assessment completati negli ultimi 6 mesi
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
