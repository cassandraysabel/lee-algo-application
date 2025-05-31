"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Volume2, VolumeX, Grid3X3, Eye, Keyboard } from "lucide-react"
import { useGame } from "@/components/game-context"

interface SettingsPageProps {
  onNavigate: (page: string) => void
}

export default function SettingsPage({ onNavigate }: SettingsPageProps) {
  const { settings, updateSettings, gameStats } = useGame()

  const handleDifficultyChange = (difficulty: "easy" | "medium" | "hard") => {
    updateSettings({ difficulty })
  }

  const clearData = () => {
    if (confirm("Are you sure you want to clear all game data? This cannot be undone.")) {
      localStorage.removeItem("carmines-quest-data")
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-300 to-blue-400 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="p-6 mb-6 bg-white/90 backdrop-blur-sm relative">
          <Button variant="ghost" size="sm" onClick={() => onNavigate("landing")} className="absolute top-4 left-4 p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-purple-800 mb-2">Settings</h2>
            <p className="text-gray-600">Customize your game experience</p>
          </div>
        </Card>

        <div className="space-y-4">
          {/* Controls Information */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Keyboard className="w-5 h-5" />
              Controls
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium mb-1">Movement:</p>
                  <p>Arrow Keys or WASD</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium mb-1">Hint:</p>
                  <p>Space Bar</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium mb-1">Pause/Resume:</p>
                  <p>ESC Key</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium mb-1">Mobile:</p>
                  <p>On-screen buttons</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Note: Both Arrow Keys and WASD can be used for movement to prevent conflicts with scrolling.
              </p>
            </div>
          </Card>

          {/* Audio Settings */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              Audio
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sound Effects</p>
                <p className="text-sm text-gray-600">Enable game sounds and music</p>
              </div>
              <Switch
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
              />
            </div>
          </Card>

          {/* Difficulty Settings */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4">Difficulty</h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">Choose your challenge level</p>

              <div className="grid gap-3">
                {[
                  { id: "easy", label: "Easy", time: "45s", description: "More time, perfect for beginners" },
                  { id: "medium", label: "Medium", time: "30s", description: "Standard challenge" },
                  { id: "hard", label: "Hard", time: "20s", description: "For experienced players" },
                ].map((diff) => (
                  <div
                    key={diff.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      settings.difficulty === diff.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleDifficultyChange(diff.id as "easy" | "medium" | "hard")}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{diff.label}</span>
                          <Badge variant="outline">{diff.time}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{diff.description}</p>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          settings.difficulty === diff.id ? "bg-purple-500 border-purple-500" : "border-gray-300"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Display Settings */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Display
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium flex items-center gap-2">
                    <Grid3X3 className="w-4 h-4" />
                    Show Grid Lines
                  </p>
                  <p className="text-sm text-gray-600">Display grid borders for easier navigation</p>
                </div>
                <Switch
                  checked={settings.showGrid}
                  onCheckedChange={(checked) => updateSettings({ showGrid: checked })}
                />
              </div>
            </div>
          </Card>

          {/* Game Statistics */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4">Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{gameStats.totalDeliveries}</div>
                <div className="text-sm text-gray-600">Total Deliveries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{Math.round(gameStats.totalTime / 60)}m</div>
                <div className="text-sm text-gray-600">Time Played</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{gameStats.perfectRuns}</div>
                <div className="text-sm text-gray-600">Perfect Runs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{gameStats.hintsUsed}</div>
                <div className="text-sm text-gray-600">Hints Used</div>
              </div>
            </div>
          </Card>

          {/* Data Management */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4">Data Management</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Your game progress is automatically saved locally on your device.</p>
              <Button onClick={clearData} variant="destructive" className="w-full">
                Clear All Data
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
