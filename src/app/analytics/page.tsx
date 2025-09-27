"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Music, ArrowLeft, BarChart3, TrendingUp, Calendar, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { ListeningTimeChart } from "@/components/charts/listening-time-chart"
import { GenreDistributionChart } from "@/components/charts/genre-distribution-chart"
import { TopArtistsChart } from "@/components/charts/top-artists-chart"
import { MonthlyActivityChart } from "@/components/charts/monthly-activity-chart"
import { useState } from "react"

export default function AnalyticsPage() {
  const router = useRouter()
  const [selectedYear, setSelectedYear] = useState("2024")

  const years = ["2024", "2023", "2022", "2021", "2020"]

  const chartData = {
    listeningTime: [
      { year: "2020", listeningTime: 8640 },
      { year: "2021", listeningTime: 9870 },
      { year: "2022", listeningTime: 11250 },
      { year: "2023", listeningTime: 12890 },
      { year: "2024", listeningTime: 15420 },
    ],
    genreDistribution: [
      { genre: "Pop", percentage: 35, count: 437 },
      { genre: "Indie Pop", percentage: 22, count: 274 },
      { genre: "Alternative Rock", percentage: 18, count: 224 },
      { genre: "Electronic", percentage: 15, count: 187 },
      { genre: "Hip Hop", percentage: 10, count: 125 },
    ],
    topArtistsChart: [
      { name: "Taylor Swift", plays: 1456 },
      { name: "Harry Styles", plays: 1234 },
      { name: "Bad Bunny", plays: 1123 },
      { name: "Olivia Rodrigo", plays: 987 },
      { name: "The Weeknd", plays: 876 },
      { name: "Billie Eilish", plays: 743 },
      { name: "Dua Lipa", plays: 654 },
      { name: "Ed Sheeran", plays: 567 },
    ],
    monthlyActivity: [
      { month: "Oca", tracks: 89, hours: 67 },
      { month: "Şub", tracks: 95, hours: 72 },
      { month: "Mar", tracks: 103, hours: 78 },
      { month: "Nis", tracks: 87, hours: 65 },
      { month: "May", tracks: 112, hours: 85 },
      { month: "Haz", tracks: 134, hours: 102 },
      { month: "Tem", tracks: 156, hours: 118 },
      { month: "Ağu", tracks: 142, hours: 108 },
      { month: "Eyl", tracks: 128, hours: 97 },
      { month: "Eki", tracks: 145, hours: 110 },
      { month: "Kas", tracks: 167, hours: 127 },
      { month: "Ara", tracks: 189, hours: 143 },
    ],
  }

  const insights = [
    {
      title: "En Aktif Ay",
      value: "Aralık",
      description: "189 şarkı dinlediniz",
      icon: Calendar,
      color: "text-chart-1",
    },
    {
      title: "Ortalama Günlük Dinleme",
      value: "4.2 saat",
      description: "Geçen yıla göre %23 artış",
      icon: Clock,
      color: "text-chart-2",
    },
    {
      title: "Müzik Çeşitliliği",
      value: "5 ana tür",
      description: "Pop müzik %35 oranında",
      icon: Music,
      color: "text-chart-3",
    },
    {
      title: "Keşif Oranı",
      value: "%18",
      description: "Yeni sanatçılar keşfettiniz",
      icon: TrendingUp,
      color: "text-chart-4",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Geri
              </Button>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Detaylı Analiz</span>
              </div>
            </div>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {insights.map((insight, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center`}>
                    <insight.icon className={`w-6 h-6 ${insight.color}`} />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {selectedYear}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{insight.title}</p>
                  <p className="text-2xl font-bold">{insight.value}</p>
                  <p className="text-xs text-muted-foreground">{insight.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ListeningTimeChart data={chartData.listeningTime} />
          <GenreDistributionChart data={chartData.genreDistribution} />
          <TopArtistsChart data={chartData.topArtistsChart} />
          <MonthlyActivityChart data={chartData.monthlyActivity} />
        </div>

        {/* Additional Insights */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Müzik Alışkanlıklarınız Hakkında İçgörüler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">En Verimli Saatler</h4>
                <p className="text-sm text-muted-foreground">
                  Genellikle akşam 20:00-22:00 arası en çok müzik dinliyorsunuz. Bu saatlerde daha çok indie ve
                  alternative rock türlerini tercih ediyorsunuz.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Sezonsal Tercihler</h4>
                <p className="text-sm text-muted-foreground">
                  Yaz aylarında daha çok pop ve electronic müzik dinlerken, kış aylarında indie ve alternative rock
                  türlerine yöneliyorsunuz.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Keşif Eğilimi</h4>
                <p className="text-sm text-muted-foreground">
                  Bu yıl %18 oranında yeni sanatçılar keşfettiniz. Bu oran geçen yıla göre %5 artış gösteriyor.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
