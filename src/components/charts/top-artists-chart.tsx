"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { User } from "lucide-react"

interface TopArtistsChartProps {
  data: Array<{
    name: string
    plays: number
  }>
}

export function TopArtistsChart({ data }: TopArtistsChartProps) {
  const formatTooltip = (value: number, name: string) => {
    return [`${value} dinleme`, name]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-chart-2" />
          En Çok Dinlenen Sanatçılar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.slice(0, 8)} layout="horizontal" margin={{ top: 20, right: 30, left: 80, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis type="number" className="text-muted-foreground" tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="name"
                className="text-muted-foreground"
                tick={{ fontSize: 12 }}
                width={80}
              />
              <Tooltip
                formatter={formatTooltip}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                }}
              />
              <Bar dataKey="plays" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
