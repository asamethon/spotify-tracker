"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Music, BarChart3, Calendar, TrendingUp, Play, Users } from "lucide-react"

export default function HomePage() {
  const handleSpotifyLogin = () => {
    // Spotify OAuth URL'si oluşturulacak
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
    const redirectUri = `${window.location.origin}/callback`
    const scopes = [
      "user-read-private",
      "user-read-email",
      "user-top-read",
      "user-read-recently-played",
      "user-read-playback-state",
    ].join(" ")

    const spotifyAuthUrl =
      `https://accounts.spotify.com/authorize?` +
      `client_id=${clientId}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `show_dialog=true`

    window.location.href = spotifyAuthUrl
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />

        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Music className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Spotify Stats</span>
          </div>

          <Button
            onClick={handleSpotifyLogin}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6"
          >
            <Play className="w-4 h-4 mr-2" />
            Spotify ile Giriş Yap
          </Button>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-balance leading-tight">
                  Müzik <span className="text-primary">İstatistiklerinizi</span> Keşfedin
                </h1>
                <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                  Spotify verilerinizi analiz edin. Her yıl için en çok dinlediğiniz şarkıları, albümleri ve sanatçıları
                  görün. Müzik zevkinizin evrimini takip edin.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleSpotifyLogin}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 text-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Hemen Başla
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-border hover:bg-secondary px-8 py-4 text-lg bg-transparent"
                >
                  Nasıl Çalışır?
                </Button>
              </div>
            </div>

            {/* Visual Element */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 animate-float">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Music className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">En Çok Dinlenen</p>
                      <p className="font-semibold">Şarkı</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-primary/30 rounded-full">
                      <div className="h-2 bg-primary rounded-full w-4/5" />
                    </div>
                    <p className="text-xs text-muted-foreground">2024: 847 dinleme</p>
                  </div>
                </Card>

                <Card
                  className="p-6 bg-card/50 backdrop-blur-sm border-border/50 animate-float"
                  style={{ animationDelay: "0.5s" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-chart-2/20 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-chart-2" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Favori</p>
                      <p className="font-semibold">Sanatçı</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-chart-2/30 rounded-full">
                      <div className="h-2 bg-chart-2 rounded-full w-3/5" />
                    </div>
                    <p className="text-xs text-muted-foreground">2024: 1.2k dinleme</p>
                  </div>
                </Card>

                <Card
                  className="p-6 bg-card/50 backdrop-blur-sm border-border/50 animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-chart-3/20 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-chart-3" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Toplam</p>
                      <p className="font-semibold">Dinleme</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-chart-3/30 rounded-full">
                      <div className="h-2 bg-chart-3 rounded-full w-full" />
                    </div>
                    <p className="text-xs text-muted-foreground">2024: 15.7k saat</p>
                  </div>
                </Card>

                <Card
                  className="p-6 bg-card/50 backdrop-blur-sm border-border/50 animate-float"
                  style={{ animationDelay: "1.5s" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-chart-4/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-chart-4" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Yıllık</p>
                      <p className="font-semibold">Trend</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-chart-4/30 rounded-full">
                      <div className="h-2 bg-chart-4 rounded-full w-2/3" />
                    </div>
                    <p className="text-xs text-muted-foreground">%23 artış</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Müzik Verilerinizi <span className="text-primary">Derinlemesine</span> Analiz Edin
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Spotify dinleme geçmişinizden detaylı istatistikler çıkarın ve müzik zevkinizin yıllar içindeki değişimini
            görün.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-colors">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Yıllık Karşılaştırma</h3>
            <p className="text-muted-foreground leading-relaxed">
              Her yıl için ayrı istatistikler görün. Müzik zevkinizin nasıl değiştiğini keşfedin.
            </p>
          </Card>

          <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-colors">
            <div className="w-12 h-12 bg-chart-2/20 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="w-6 h-6 text-chart-2" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Detaylı Grafikler</h3>
            <p className="text-muted-foreground leading-relaxed">
              Dinleme verilerinizi görsel grafiklerle analiz edin. Trendleri kolayca takip edin.
            </p>
          </Card>

          <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-colors">
            <div className="w-12 h-12 bg-chart-3/20 rounded-xl flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6 text-chart-3" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Kişisel İstatistikler</h3>
            <p className="text-muted-foreground leading-relaxed">
              En çok dinlediğiniz şarkı, albüm ve sanatçıları keşfedin. Dinleme sürelerinizi görün.
            </p>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-balance">
            Müzik Yolculuğunuzu <span className="text-primary">Keşfetmeye</span> Hazır mısınız?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Spotify hesabınızla giriş yapın ve müzik istatistiklerinizi görmeye başlayın.
          </p>
          <Button
            onClick={handleSpotifyLogin}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-12 py-4 text-lg"
          >
            <Play className="w-5 h-5 mr-2" />
            Spotify ile Başla
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <Music className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">Spotify Stats</span>
            </div>
            <p className="text-sm text-muted-foreground">Spotify Web API kullanılarak geliştirilmiştir.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
