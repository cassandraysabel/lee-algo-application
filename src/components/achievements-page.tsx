"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Award, Lock, CheckCircle } from "lucide-react"
import { useGame } from "@/components/game-context"

interface AchievementPageProps {
  onNavigate: (page: string) => void
}

export default function AchievementsPage({ onNavigate }: AchievementPageProps) {
  const { gameStats, completedLevels } = useGame()

  const achievements = [
    {
      id: "first-delivery",
      title: "First Delivery",
      description: "Complete your first delivery mission",
      icon: "🚚",
      condition: () => gameStats.totalDeliveries >= 1,
      unlocked: gameStats.achievements.includes("first-delivery"),
    },
    {
      id: "speed-demon",
      title: "Speed Demon",
      description: "Complete a level with more than 25 seconds remaining",
      icon: "⚡",
      condition: () => Object.values(gameStats.bestTimes).some((time) => time > 25),
      unlocked: gameStats.achievements.includes("speed-demon"),
    },
    {
      id: "no-hints",
      title: "Independent Navigator",
      description: "Complete a level without using any hints",
      icon: "🧭",
      condition: () => gameStats.totalDeliveries > gameStats.hintsUsed,
      unlocked: gameStats.achievements.includes("no-hints"),
    },
    {
      id: "all-levels",
      title: "Master Deliverer",
      description: "Complete all available levels",
      icon: "👑",
      condition: () => completedLevels.length >= 5,
      unlocked: gameStats.achievements.includes("all-levels"),
    },
    {
      id: "perfect-streak",
      title: "Perfect Streak",
      description: "Complete 3 perfect runs (no hints, 20+ seconds left)",
      icon: "🌟",
      condition: () => gameStats.perfectRuns >= 3,
      unlocked: gameStats.achievements.includes("perfect-streak"),
    },
    {
      id: "time-master",
      title: "Time Master",
      description: "Achieve best times on all levels",
      icon: "⏰",
      condition: () => Object.keys(gameStats.bestTimes).length >= 5,
      unlocked: gameStats.achievements.includes("time-master"),
    },
    {
      id: "delivery-veteran",
      title: "Delivery Veteran",
      description: "Complete 25 total deliveries",
      icon: "🎖️",
      condition: () => gameStats.totalDeliveries >= 25,
      unlocked: gameStats.achievements.includes("delivery-veteran"),
    },
    {
      id: "efficiency-expert",
      title: "Efficiency Expert",
      description: "Maintain 80% perfect run rate over 10 deliveries",
      icon: "📊",
      condition: () => gameStats.totalDeliveries >= 10 && gameStats.perfectRuns / gameStats.totalDeliveries >= 0.8,
      unlocked: gameStats.achievements.includes("efficiency-expert"),
    },
    {
      id: "explorer",
      title: "Town Explorer",
      description: "Use hints on 5 different levels",
      icon: "🗺️",
      condition: () => gameStats.hintsUsed >= 5,
      unlocked: gameStats.achievements.includes("explorer"),
    },
  ]

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalCount = achievements.length
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-300 to-purple-400 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 mb-6 bg-white/90 backdrop-blur-sm relative">
          <Button variant="ghost" size="sm" onClick={() => onNavigate("landing")} className="absolute top-4 left-4 p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-purple-800 mb-2 flex items-center justify-center gap-2">
              <Award className="w-8 h-8" />
              Achievements
            </h2>
            <p className="text-gray-600 mb-4">Track your progress and unlock rewards</p>

            <div className="flex items-center justify-center gap-4">
              <Badge className="bg-purple-100 text-purple-800 text-lg px-4 py-2">
                {unlockedCount} / {totalCount} Unlocked
              </Badge>
              <Badge className="bg-indigo-100 text-indigo-800 text-lg px-4 py-2">
                {completionPercentage}% Complete
              </Badge>
            </div>
          </div>
        </Card>

        {/* Progress Bar */}
        <Card className="p-4 mb-6 bg-white/90 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Progress:</span>
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <span className="text-sm font-medium">{completionPercentage}%</span>
          </div>
        </Card>

        {/* Achievements*/}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement) => {
            const isUnlocked = achievement.unlocked
            const canUnlock = achievement.condition() && !isUnlocked

            return (
              <Card
                key={achievement.id}
                className={`p-6 transition-all ${
                  isUnlocked
                    ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg"
                    : canUnlock
                      ? "bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200 animate-pulse"
                      : "bg-gray-100 border-gray-200"
                }`}
              >
                <div className="text-center space-y-3">
                  <div className="relative">
                    <div className={`text-4xl ${!isUnlocked && !canUnlock ? "grayscale opacity-50" : ""}`}>
                      {achievement.icon}
                    </div>
                    {isUnlocked && (
                      <CheckCircle className="absolute -top-1 -right-1 w-6 h-6 text-green-600 bg-white rounded-full" />
                    )}
                    {!isUnlocked && !canUnlock && (
                      <Lock className="absolute -top-1 -right-1 w-6 h-6 text-gray-400 bg-white rounded-full" />
                    )}
                  </div>

                  <div>
                    <h3
                      className={`font-bold text-lg ${!isUnlocked && !canUnlock ? "text-gray-500" : "text-gray-800"}`}
                    >
                      {achievement.title}
                    </h3>
                    <p className={`text-sm ${!isUnlocked && !canUnlock ? "text-gray-400" : "text-gray-600"}`}>
                      {achievement.description}
                    </p>
                  </div>

                  {isUnlocked && <Badge className="bg-green-100 text-green-800">✅ Unlocked!</Badge>}

                  {canUnlock && (
                    <Badge className="bg-yellow-100 text-yellow-800 animate-bounce">🎉 Ready to unlock!</Badge>
                  )}

                  {!isUnlocked && !canUnlock && <Badge className="bg-gray-100 text-gray-600">🔒 Locked</Badge>}
                </div>
              </Card>
            )
          })}
        </div>

        {/* Categories */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card className="p-4 bg-white/90 backdrop-blur-sm text-center">
            <div className="text-2xl mb-2">🏆</div>
            <h3 className="font-bold">Completion</h3>
            <p className="text-sm text-gray-600">
              {
                achievements.filter(
                  (a) => ["first-delivery", "all-levels", "delivery-veteran"].includes(a.id) && a.unlocked,
                ).length
              }{" "}
              / 3
            </p>
          </Card>

          <Card className="p-4 bg-white/90 backdrop-blur-sm text-center">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-bold">Speed & Skill</h3>
            <p className="text-sm text-gray-600">
              {
                achievements.filter(
                  (a) =>
                    ["speed-demon", "no-hints", "perfect-streak", "efficiency-expert"].includes(a.id) && a.unlocked,
                ).length
              }{" "}
              / 4
            </p>
          </Card>

          <Card className="p-4 bg-white/90 backdrop-blur-sm text-center">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-bold">Special</h3>
            <p className="text-sm text-gray-600">
              {achievements.filter((a) => ["time-master", "explorer"].includes(a.id) && a.unlocked).length} / 2
            </p>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button onClick={() => onNavigate("levels")} className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3">
            Continue Playing to Unlock More!
          </Button>
        </div>
      </div>
    </div>
  )
}
