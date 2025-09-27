"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

interface MonthlyActivityChartProps {
  data: Array<{
    month: string
    tracks: number
    hours: number
  }>
}

export function MonthlyActivityChart({ data }: MonthlyActivityChartProps) {
  const formatTooltip = (value: number, name: string) => {
    if (name === "tracks") {
      return [`${value} şarkı`, "Dinlenen Şarkı"]
    }
    return [`${value} saat`, "Dinleme Süresi"]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-chart-3" />
          Aylık Aktivite
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-muted-foreground" tick={{ fontSize: 12 }} />
              <YAxis className="text-muted-foreground" tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={formatTooltip}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                }}
              />
              <Line
                type="monotone"
                dataKey="tracks"
                stroke="hsl(var(--chart-3))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--chart-3))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(var(--chart-3))", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="hours"
                stroke="hsl(var(--chart-5))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--chart-5))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(var(--chart-5))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
