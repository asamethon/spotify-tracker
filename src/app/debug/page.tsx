"use client"

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Debug Information</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-card rounded-lg border">
            <h2 className="font-semibold mb-2">Environment Variables</h2>
            <div className="space-y-2 text-sm">
              <div>
                <strong>NEXT_PUBLIC_SPOTIFY_CLIENT_ID:</strong>{" "}
                {process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ? "✅ Set" : "❌ Not set"}
              </div>
              <div>
                <strong>Client ID Value:</strong>{" "}
                {process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "undefined"}
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-card rounded-lg border">
            <h2 className="font-semibold mb-2">Current URL Info</h2>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Origin:</strong> {typeof window !== 'undefined' ? window.location.origin : 'Server-side'}
              </div>
              <div>
                <strong>Expected Callback:</strong> {typeof window !== 'undefined' ? `${window.location.origin}/callback` : 'Server-side'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
