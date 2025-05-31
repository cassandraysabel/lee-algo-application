"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trophy, Clock, Star } from "lucide-react"
import { useGame } from "@/components/game-context"

interface LeaderboardPageProps {
  onNavigate: (page: string) => void
}

export default function LeaderboardPage({ onNavigate }: LeaderboardPageProps) {
  const { gameStats, completedLevels } = useGame()

  const levelNames = {
    1: "Grandma's Rice",
    2: "Mayor's Bread",
    3: "Restaurant Veggies",
    4: "Clinic Medicine",
    5: "Elmor's Lunch",
    6: "Hospital Emergency",
    7: "Wedding Flowers",
    8: "Fire Station Rush",
  }

  const getBestTimes = () => {
    return Object.entries(gameStats.bestTimes)
      .map(([level, time]) => ({
        level: Number.parseInt(level),
        time: Number.parseInt(time.toString()),
        name: levelNames[Number.parseInt(level) as keyof typeof levelNames] || `Level ${level}`,
      }))
      .sort((a, b) => b.time - a.time)
  }

  const getPersonalStats = () => {
    const totalLevels = Object.keys(levelNames).length
    const completionRate = (completedLevels.length / totalLevels) * 100
    const averageTime = gameStats.totalTime / gameStats.totalDeliveries || 0

    return {
      completionRate: Math.round(completionRate),
      averageTime: Math.round(averageTime),
      efficiency:
        gameStats.totalDeliveries > 0 ? Math.round((gameStats.perfectRuns / gameStats.totalDeliveries) * 100) : 0,
    }
  }

  const bestTimes = getBestTimes()
  const personalStats = getPersonalStats()

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-300 to-orange-400 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 mb-6 bg-white/90 backdrop-blur-sm relative">
          <Button variant="ghost" size="sm" onClick={() => onNavigate("landing")} className="absolute top-4 left-4 p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-orange-800 mb-2 flex items-center justify-center gap-2">
              <Trophy className="w-8 h-8" />
              Leaderboard
            </h2>
            <p className="text-gray-600">Your personal best times and achievements</p>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Personal Stats */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Personal Stats
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">Completion Rate</span>
                <Badge className="bg-blue-100 text-blue-800">{personalStats.completionRate}%</Badge>
              </div>

              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium">Average Delivery Time</span>
                <Badge className="bg-green-100 text-green-800">{personalStats.averageTime}s</Badge>
              </div>

              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="font-medium">Efficiency Rate</span>
                <Badge className="bg-purple-100 text-purple-800">{personalStats.efficiency}%</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{gameStats.totalDeliveries}</div>
                  <div className="text-sm text-gray-600">Total Deliveries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{gameStats.perfectRuns}</div>
                  <div className="text-sm text-gray-600">Perfect Runs</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Best Times */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Best Times
            </h3>

            {bestTimes.length > 0 ? (
              <div className="space-y-3">
                {bestTimes.map((record, index) => (
                  <div
                    key={record.level}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      index === 0 ? "bg-yellow-50 border border-yellow-200" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {index === 0 && <Trophy className="w-4 h-4 text-yellow-600" />}
                      <div>
                        <div className="font-medium">Level {record.level}</div>
                        <div className="text-sm text-gray-600">{record.name}</div>
                      </div>
                    </div>
                    <Badge className={index === 0 ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}>
                      {record.time}s left
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No completed levels yet!</p>
                <p className="text-sm">Start playing to see your best times here.</p>
              </div>
            )}
          </Card>
        </div>

        {/* Global Rankings Placeholder */}
        <Card className="mt-6 p-6 bg-white/90 backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-4">Global Rankings</h3>
          <div className="text-center py-8 text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="font-medium">Coming Soon!</p>
            <p className="text-sm">Global leaderboards will be available in a future update.</p>
            <p className="text-sm">Keep practicing to be ready for the competition!</p>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="mt-6 flex gap-4 justify-center">
          <Button onClick={() => onNavigate("levels")} className="bg-orange-600 hover:bg-orange-700">
            Play More Levels
          </Button>
          <Button onClick={() => onNavigate("achievements")} variant="outline">
            View Achievements
          </Button>
        </div>
      </div>
    </div>
  )
}
