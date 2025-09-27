import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get("time_range") || "medium_term"
    const limit = searchParams.get("limit") || "20"

    const cookieStore = await cookies()
    const accessToken = cookieStore.get("spotify_access_token")?.value

    if (!accessToken) {
      return NextResponse.json({ error: "No access token" }, { status: 401 })
    }

    const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch top tracks")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Top tracks fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch top tracks" }, { status: 500 })
  }
}
