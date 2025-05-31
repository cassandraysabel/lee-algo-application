"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft} from "lucide-react"
import { useGame } from "@/components/game-context"

interface LevelSelectionProps {
  onNavigate: (page: string, level?: number) => void
}

export default function LevelSelection({ onNavigate }: LevelSelectionProps) {
  const { completedLevels, gameStats} = useGame()

  const levels = [
    { id: 1, title: "Deliver rice to grandma's house", emoji: "🍚", target: "👵", difficulty: "Easy" },
    { id: 2, title: "Bring bread to the mayor's house", emoji: "🍞", target: "👨‍💼", difficulty: "Easy" },
    { id: 3, title: "Deliver carrots and potato to the resto", emoji: "🥕🥔", target: "👨‍🍳", difficulty: "Medium" },
    { id: 4, title: "Deliver medicine to the clinic", emoji: "💊", target: "👨‍⚕️", difficulty: "Medium" },
    { id: 5, title: "Bring little Elmor his lunch", emoji: "🍱", target: "👦", difficulty: "Hard" },
    { id: 6, title: "Emergency delivery to the hospital", emoji: "🚑", target: "🏥", difficulty: "Hard" },
    { id: 7, title: "Deliver flowers to the wedding", emoji: "💐", target: "👰", difficulty: "Expert" },
    { id: 8, title: "Rush delivery to the fire station", emoji: "🧯", target: "👨‍🚒", difficulty: "Expert" },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-orange-100 text-orange-800"
      case "Expert":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-orange-400 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="p-6 mb-6 bg-white/90 backdrop-blur-sm relative">
          <Button variant="ghost" size="sm" onClick={() => onNavigate("landing")} className="absolute top-4 left-4 p-2">
            <ArrowLeft className="w-4 h-4 text-black" />
          </Button>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-orange-800 mb-2">Level Selection</h2>
            <p className="text-gray-600 mb-4">Choose your delivery mission!</p>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {levels.map((level) => {
            const isLocked = level.id > 1 && !completedLevels.includes(level.id - 1)
            const isCompleted = completedLevels.includes(level.id)
            const bestTime = gameStats.bestTimes[level.id]

            return (
              <Card
                key={level.id}
                className={`p-6 cursor-pointer transition-all hover:scale-105 ${
                  isLocked
                    ? "bg-gray-300 cursor-not-allowed"
                    : isCompleted
                      ? "bg-green-100 border-green-400"
                      : "bg-white hover:bg-blue-50"
                }`}
                onClick={() => !isLocked && onNavigate("game", level.id)}
              >
                <div className="text-center space-y-3">
                  <div className="flex justify-between items-start">
                    <Badge className={getDifficultyColor(level.difficulty)}>{level.difficulty}</Badge>
                    {isCompleted && <div className="text-green-600">✅</div>}
                  </div>

                  <div className="text-4xl">{isLocked ? "🔒" : level.emoji}</div>
                  <h3 className="font-bold text-lg">Level {level.id}</h3>
                  <p className="text-sm text-gray-600 min-h-[2.5rem]">{level.title}</p>
                  <div className="text-2xl">{level.target}</div>

                  {bestTime && <div className="text-xs text-blue-600 font-medium">Best: {bestTime}s remaining</div>}
                </div>
              </Card>
            )
          })}
        </div>

        {/* Stats Summary */}
        <Card className="mt-6 p-4 bg-white/90 backdrop-blur-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">{gameStats.totalDeliveries}</div>
              <div className="text-sm text-gray-600">Total Deliveries</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{completedLevels.length}</div>
              <div className="text-sm text-gray-600">Levels Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{gameStats.perfectRuns}</div>
              <div className="text-sm text-gray-600">Perfect Runs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{gameStats.achievements.length}</div>
              <div className="text-sm text-gray-600">Achievements</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
