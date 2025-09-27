"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Music,
  User,
  Disc3,
  Clock,
  Play,
  LogOut,
  Loader2,
  Calendar,
  TrendingUp,
  ArrowUpDown,
  BarChart3,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { ListeningTimeChart } from "@/components/charts/listening-time-chart"
import { GenreDistributionChart } from "@/components/charts/genre-distribution-chart"
import { TopArtistsChart } from "@/components/charts/top-artists-chart"
import { MonthlyActivityChart } from "@/components/charts/monthly-activity-chart"

interface SpotifyTrack {
  id: string
  name: string
  artists: Array<{ name: string }>
  album: {
    name: string
    images: Array<{ url: string }>
  }
  duration_ms: number
  play_count?: number
}

interface SpotifyArtist {
  id: string
  name: string
  images: Array<{ url: string }>
  genres: string[]
  play_count?: number
}

interface SpotifyAlbum {
  id: string
  name: string
  artists: Array<{ name: string }>
  images: Array<{ url: string }>
  release_date: string
  play_count?: number
}

interface UserProfile {
  id: string
  display_name: string
  images: Array<{ url: string }>
  followers: { total: number }
  country: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [selectedYear, setSelectedYear] = useState("2025")
  const [timeRange, setTimeRange] = useState("medium_term")
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([])
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([])
  const [topAlbums, setTopAlbums] = useState<SpotifyAlbum[]>([])
  const [yearlyData, setYearlyData] = useState<Record<string, any>>({})
  const [showComparison, setShowComparison] = useState(false)

  const years = ["2025", "2024", "2023", "2022", "2021", "2020"]
  const timeRanges = [
    { value: "short_term", label: "Son 4 Hafta" },
    { value: "medium_term", label: "Son 6 Ay" },
    { value: "long_term", label: "Tüm Zamanlar" },
  ]

  const mockYearlyData = {
    "2025": {
      totalListeningTime: 16800, // minutes
      topTrack: { name: "Yaş Elli", artist: "Replikas", plays: 312 },
      topArtist: { name: "Asamethon", plays: 1678 },
      topAlbum: { name: "Güllerin Soldu", artist: "Sezen Aksu", plays: 945 },
      totalTracks: 1356,
      totalArtists: 167,
      totalAlbums: 94,
      genres: ["Turkish Rock", "Alternative", "Pop", "Indie", "Electronic"],
    },
    "2024": {
      totalListeningTime: 15420, // minutes
      topTrack: { name: "Anti-Hero", artist: "Taylor Swift", plays: 247 },
      topArtist: { name: "eğ", plays: 1456 },
      topAlbum: { name: "Midnights", artist: "Taylor Swift", plays: 892 },
      totalTracks: 1247,
      totalArtists: 156,
      totalAlbums: 89,
      genres: ["Pop", "Indie Pop", "Alternative Rock", "Electronic", "Hip Hop"],
    },
    "2023": {
      totalListeningTime: 12890,
      topTrack: { name: "Flowers", artist: "Miley Cyrus", plays: 198 },
      topArtist: { name: "Harry Styles", plays: 1234 },
      topAlbum: { name: "Harry's House", artist: "Harry Styles", plays: 756 },
      totalTracks: 1089,
      totalArtists: 134,
      totalAlbums: 76,
      genres: ["Pop", "Rock", "Indie", "Electronic", "R&B"],
    },
    "2022": {
      totalListeningTime: 11250,
      topTrack: { name: "As It Was", artist: "Harry Styles", plays: 189 },
      topArtist: { name: "Bad Bunny", plays: 1123 },
      topAlbum: { name: "Un Verano Sin Ti", artist: "Bad Bunny", plays: 634 },
      totalTracks: 967,
      totalArtists: 121,
      totalAlbums: 68,
      genres: ["Reggaeton", "Pop", "Latin", "Hip Hop", "Electronic"],
    },
    "2021": {
      totalListeningTime: 9870,
      topTrack: { name: "Good 4 U", artist: "Olivia Rodrigo", plays: 156 },
      topArtist: { name: "Olivia Rodrigo", plays: 987 },
      topAlbum: { name: "SOUR", artist: "Olivia Rodrigo", plays: 543 },
      totalTracks: 834,
      totalArtists: 98,
      totalAlbums: 54,
      genres: ["Pop", "Alternative Rock", "Indie Pop", "Hip Hop", "Electronic"],
    },
    "2020": {
      totalListeningTime: 8640,
      topTrack: { name: "Blinding Lights", artist: "The Weeknd", plays: 134 },
      topArtist: { name: "The Weeknd", plays: 876 },
      topAlbum: { name: "After Hours", artist: "The Weeknd", plays: 456 },
      totalTracks: 723,
      totalArtists: 87,
      totalAlbums: 45,
      genres: ["Pop", "R&B", "Electronic", "Hip Hop", "Indie"],
    },
  }

  useEffect(() => {
    fetchUserData()
  }, [timeRange])

  // Generate yearly data from real Spotify data
  useEffect(() => {
    if (topTracks.length > 0 && topArtists.length > 0) {
      const realYearlyData = generateYearlyData()
      setYearlyData({ ...mockYearlyData, ...realYearlyData })
    } else {
      setYearlyData(mockYearlyData)
    }
  }, [topTracks, topArtists, selectedYear])

  const generateYearlyData = () => {
    if (topTracks.length === 0 || topArtists.length === 0) return {}

    // Calculate total listening time (estimate based on track durations)
    const totalListeningTime = topTracks.reduce((total, track) => {
      return total + Math.floor(track.duration_ms / 60000) * (track.play_count || 50) // Estimate plays
    }, 0)

    // Get unique albums from tracks
    const uniqueAlbums = new Set(topTracks.map(track => track.album.name))
    
    // Extract genres from artists
    const allGenres = topArtists.flatMap(artist => artist.genres || [])
    const genreCounts = allGenres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const topGenres = Object.entries(genreCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([genre]) => genre)

    return {
      [selectedYear]: {
        totalListeningTime,
        topTrack: {
          name: topTracks[0]?.name || "Bilinmiyor",
          artist: topTracks[0]?.artists[0]?.name || "Bilinmiyor",
          plays: topTracks[0]?.play_count || Math.floor(Math.random() * 200) + 100
        },
        topArtist: {
          name: topArtists[0]?.name || "Bilinmiyor",
          plays: topArtists[0]?.play_count || Math.floor(Math.random() * 1000) + 500
        },
        topAlbum: {
          name: topTracks[0]?.album.name || "Bilinmiyor",
          artist: topTracks[0]?.artists[0]?.name || "Bilinmiyor",
          plays: Math.floor(Math.random() * 500) + 200
        },
        totalTracks: topTracks.length,
        totalArtists: topArtists.length,
        totalAlbums: uniqueAlbums.size,
        genres: topGenres.length > 0 ? topGenres : ["Pop", "Rock", "Alternative"]
      }
    }
  }

  const fetchUserData = async () => {
    try {
      setLoading(true)

      // Fetch user profile
      const profileResponse = await fetch("/api/spotify/profile")
      if (profileResponse.ok) {
        const profile = await profileResponse.json()
        setUserProfile(profile)
      }

      // Fetch top tracks
      const tracksResponse = await fetch(`/api/spotify/top-tracks?time_range=${timeRange}&limit=20`)
      if (tracksResponse.ok) {
        const tracks = await tracksResponse.json()
        setTopTracks(tracks.items || [])
      }

      // Fetch top artists
      const artistsResponse = await fetch(`/api/spotify/top-artists?time_range=${timeRange}&limit=20`)
      if (artistsResponse.ok) {
        const artists = await artistsResponse.json()
        setTopArtists(artists.items || [])
      }

      // Mock albums data (Spotify API doesn't have top albums endpoint)
      setTopAlbums([
        {
          id: "1",
          name: "Midnights",
          artists: [{ name: "Taylor Swift" }],
          images: [{ url: "/album-cover-midnights.jpg" }],
          release_date: "2022-10-21",
          play_count: 156,
        },
        {
          id: "2",
          name: "Harry's House",
          artists: [{ name: "Harry Styles" }],
          images: [{ url: "/album-cover-harrys-house.jpg" }],
          release_date: "2022-05-20",
          play_count: 134,
        },
        {
          id: "3",
          name: "Un Verano Sin Ti",
          artists: [{ name: "Bad Bunny" }],
          images: [{ url: "/album-cover-un-verano-sin-ti.jpg" }],
          release_date: "2022-05-06",
          play_count: 98,
        },
      ])
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
  }

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = ((ms % 60000) / 1000).toFixed(0)
    return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`
  }

  const formatListeningTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    if (days > 0) {
      return `${days} gün ${hours % 24} saat`
    }
    return `${hours} saat ${minutes % 60} dakika`
  }

  const getYearComparison = (currentYear: string, previousYear: string, metric: string) => {
    const current = yearlyData[currentYear]
    const previous = yearlyData[previousYear]

    if (!current || !previous) return null

    let currentValue, previousValue
    switch (metric) {
      case "listeningTime":
        currentValue = current.totalListeningTime
        previousValue = previous.totalListeningTime
        break
      case "tracks":
        currentValue = current.totalTracks
        previousValue = previous.totalTracks
        break
      case "artists":
        currentValue = current.totalArtists
        previousValue = previous.totalArtists
        break
      case "albums":
        currentValue = current.totalAlbums
        previousValue = previous.totalAlbums
        break
      default:
        return null
    }

    const change = ((currentValue - previousValue) / previousValue) * 100
    return {
      change: change.toFixed(1),
      isPositive: change > 0,
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Spotify verileriniz yükleniyor...</p>
        </div>
      </div>
    )
  }

  const currentYearData = yearlyData[selectedYear]

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Music className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Spotify Stats</span>
              </div>

              {userProfile && (
                <div className="flex items-center gap-3 ml-8">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                    {userProfile.images?.[0]?.url ? (
                      <img
                        src={userProfile.images[0].url || "/placeholder.svg"}
                        alt={userProfile.display_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{userProfile.display_name}</p>
                    <p className="text-xs text-muted-foreground">{userProfile.followers?.total} takipçi</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
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

              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={() => setShowComparison(!showComparison)}>
                <ArrowUpDown className="w-4 h-4 mr-2" />
                Karşılaştır
              </Button>

              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Çıkış
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {currentYearData && (
          <Card className="mb-8 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-primary" />
                    {selectedYear} Müzik Özeti
                  </h2>
                  <p className="text-muted-foreground mt-1">Bu yıl boyunca dinleme alışkanlıklarınızın özeti</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">
                    {formatListeningTime(currentYearData.totalListeningTime)}
                  </p>
                  <p className="text-sm text-muted-foreground">Toplam dinleme süresi</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">En Çok Dinlenen Şarkı</p>
                  <p className="font-semibold">{currentYearData.topTrack.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {currentYearData.topTrack.artist} • {currentYearData.topTrack.plays} dinleme
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">En Çok Dinlenen Sanatçı</p>
                  <p className="font-semibold">{currentYearData.topArtist.name}</p>
                  <p className="text-sm text-muted-foreground">{currentYearData.topArtist.plays} dinleme</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">En Çok Dinlenen Albüm</p>
                  <p className="font-semibold">{currentYearData.topAlbum.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {currentYearData.topAlbum.artist} • {currentYearData.topAlbum.plays} dinleme
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border/50">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Favori türler:</span>
                  {currentYearData.genres.slice(0, 5).map((genre: string) => (
                    <Badge key={genre} variant="secondary" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {showComparison && currentYearData && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-chart-4" />
                Yıllık Karşılaştırma
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {["2023", "2022", "2021"].map((compareYear) => {
                  if (!yearlyData[compareYear]) return null

                  const listeningComparison = getYearComparison(selectedYear, compareYear, "listeningTime")
                  const tracksComparison = getYearComparison(selectedYear, compareYear, "tracks")
                  const artistsComparison = getYearComparison(selectedYear, compareYear, "artists")

                  return (
                    <Card key={compareYear} className="bg-muted/30">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-3">
                          {selectedYear} vs {compareYear}
                        </h4>

                        <div className="space-y-3">
                          {listeningComparison && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Dinleme Süresi</span>
                              <div
                                className={`flex items-center gap-1 text-sm font-medium ${
                                  listeningComparison.isPositive ? "text-green-500" : "text-red-500"
                                }`}
                              >
                                <TrendingUp
                                  className={`w-3 h-3 ${!listeningComparison.isPositive ? "rotate-180" : ""}`}
                                />
                                {listeningComparison.change}%
                              </div>
                            </div>
                          )}

                          {tracksComparison && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Şarkı Sayısı</span>
                              <div
                                className={`flex items-center gap-1 text-sm font-medium ${
                                  tracksComparison.isPositive ? "text-green-500" : "text-red-500"
                                }`}
                              >
                                <TrendingUp className={`w-3 h-3 ${!tracksComparison.isPositive ? "rotate-180" : ""}`} />
                                {tracksComparison.change}%
                              </div>
                            </div>
                          )}

                          {artistsComparison && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Sanatçı Sayısı</span>
                              <div
                                className={`flex items-center gap-1 text-sm font-medium ${
                                  artistsComparison.isPositive ? "text-green-500" : "text-red-500"
                                }`}
                              >
                                <TrendingUp
                                  className={`w-3 h-3 ${!artistsComparison.isPositive ? "rotate-180" : ""}`}
                                />
                                {artistsComparison.change}%
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Toplam Şarkı</p>
                  <p className="text-2xl font-bold">
                    {currentYearData ? currentYearData.totalTracks : topTracks.length}
                  </p>
                  {currentYearData && <p className="text-xs text-muted-foreground mt-1">{selectedYear} yılında</p>}
                </div>
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Music className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-2/20 to-chart-2/5 border-chart-2/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Favori Sanatçı</p>
                  <p className="text-2xl font-bold">
                    {currentYearData ? currentYearData.totalArtists : topArtists.length}
                  </p>
                  {currentYearData && <p className="text-xs text-muted-foreground mt-1">{selectedYear} yılında</p>}
                </div>
                <div className="w-12 h-12 bg-chart-2/20 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-chart-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-3/20 to-chart-3/5 border-chart-3/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Albüm Sayısı</p>
                  <p className="text-2xl font-bold">
                    {currentYearData ? currentYearData.totalAlbums : topAlbums.length}
                  </p>
                  {currentYearData && <p className="text-xs text-muted-foreground mt-1">{selectedYear} yılında</p>}
                </div>
                <div className="w-12 h-12 bg-chart-3/20 rounded-xl flex items-center justify-center">
                  <Disc3 className="w-6 h-6 text-chart-3" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-4/20 to-chart-4/5 border-chart-4/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Dinleme Saati</p>
                  <p className="text-2xl font-bold">
                    {currentYearData ? Math.floor(currentYearData.totalListeningTime / 60) : 247}h
                  </p>
                  {currentYearData && <p className="text-xs text-muted-foreground mt-1">{selectedYear} yılında</p>}
                </div>
                <div className="w-12 h-12 bg-chart-4/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-chart-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tracks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
            <TabsTrigger value="tracks">Şarkılar</TabsTrigger>
            <TabsTrigger value="artists">Sanatçılar</TabsTrigger>
            <TabsTrigger value="albums">Albümler</TabsTrigger>
            <TabsTrigger value="charts">Grafikler</TabsTrigger>
          </TabsList>

          <TabsContent value="tracks" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Music className="w-5 h-5 text-primary" />
                    En Çok Dinlenen Şarkılarınız
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => router.push("/analytics")}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Detaylı Analiz
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topTracks.slice(0, 10).map((track, index) => (
                    <div
                      key={track.id}
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-8 h-8 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">#{index + 1}</span>
                      </div>

                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                        {track.album.images?.[0]?.url ? (
                          <img
                            src={track.album.images[0].url || "/placeholder.svg"}
                            alt={track.album.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Music className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{track.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {track.artists.map((artist) => artist.name).join(", ")}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-medium">{formatDuration(track.duration_ms)}</p>
                        <p className="text-xs text-muted-foreground">{track.album.name}</p>
                      </div>

                      <Button variant="ghost" size="sm">
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="artists" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-chart-2" />
                  En Çok Dinlenen Sanatçılarınız
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {topArtists.slice(0, 9).map((artist, index) => (
                    <Card key={artist.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
                              {artist.images?.[0]?.url ? (
                                <img
                                  src={artist.images[0].url || "/placeholder.svg"}
                                  alt={artist.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <User className="w-8 h-8 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-primary-foreground">#{index + 1}</span>
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{artist.name}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {artist.genres.slice(0, 2).map((genre) => (
                                <Badge key={genre} variant="secondary" className="text-xs">
                                  {genre}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="albums" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Disc3 className="w-5 h-5 text-chart-3" />
                  En Çok Dinlenen Albümleriniz
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {topAlbums.map((album, index) => (
                    <Card key={album.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="relative">
                            <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted">
                              <img
                                src={album.images[0]?.url || "/placeholder.svg"}
                                alt={album.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute top-2 left-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-primary-foreground">#{index + 1}</span>
                            </div>
                          </div>

                          <div>
                            <p className="font-semibold truncate">{album.name}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {album.artists.map((artist) => artist.name).join(", ")}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(album.release_date).getFullYear()} • {album.play_count} dinleme
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ListeningTimeChart data={chartData.listeningTime} />
              <GenreDistributionChart data={chartData.genreDistribution} />
              <TopArtistsChart data={chartData.topArtistsChart} />
              <MonthlyActivityChart data={chartData.monthlyActivity} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
