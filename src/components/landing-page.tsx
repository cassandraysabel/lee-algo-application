"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Settings, Trophy, Award } from "lucide-react"
import { useGame } from "@/components/game-context"

interface LandingPageProps {
  onNavigate: (page: string) => void
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [showAnimation, setShowAnimation] = useState(true)
  const { resetGameProgress, completedLevels } = useGame()
  const hasSavedGame = completedLevels.length > 0

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleStartNewGame = () => {
    resetGameProgress()
    onNavigate("intro")
  }

  const handleContinueGame = () => {
    onNavigate("levels")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-200 via-orange-300 to-orange-400 flex items-center justify-center p-4">
      {/* Navigation Icons */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => onNavigate("settings")} className="p-2">
          <Settings className="w-4 h-4  text-orange-800" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onNavigate("leaderboard")} className="p-2">
          <Trophy className="w-4 h-4  text-orange-800" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onNavigate("achievements")} className="p-2">
          <Award className="w-4 h-4 text-orange-800"/>
        </Button>
      </div>

      <Card className="p-8 text-center max-w-md w-full bg-white/90 backdrop-blur-sm relative">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-orange-800 mb-4">Carmine&apos;s Quest</h1>

          {showAnimation ? (
            <div className="space-y-4">
              <div className="text-6xl animate-bounce">🚚</div>
              <div className="text-2xl animate-pulse">🏠➡️🏪➡️🏥</div>
              <p className="text-lg text-gray-600 animate-fade-in">Help Carmine deliver groceries around town!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-6xl">👧</div>
              <p className="text-lg text-gray-600">Guide Carmine through the town to make deliveries on time!</p>
            </div>
          )}
        </div>

        {!showAnimation && (
          <div className="space-y-3">
            <Button onClick={handleStartNewGame} className="w-full text-lg py-3 bg-orange-600 hover:bg-orange-700">
              Start Adventure
            </Button>

            {hasSavedGame && (
              <Button onClick={handleContinueGame} variant="outline" className="w-full">
                Continue Game
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
