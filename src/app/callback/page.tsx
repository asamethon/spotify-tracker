"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, Music } from "lucide-react"

export default function CallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get("code")
    const error = searchParams.get("error")

    if (error) {
      router.push("/?error=access_denied")
      return
    }

    if (code) {
      // Redirect to API route for token exchange
      window.location.href = `/api/auth/spotify?code=${code}`
    } else {
      router.push("/?error=no_code")
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center animate-pulse-spotify">
            <Music className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Spotify ile Bağlanıyor...</h1>
          <p className="text-muted-foreground">Hesabınız doğrulanıyor, lütfen bekleyin.</p>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm text-muted-foreground">İşleniyor...</span>
        </div>
      </div>
    </div>
  )
}
