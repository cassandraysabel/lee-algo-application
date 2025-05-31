"use client"

import { useState, useEffect } from "react"
import LandingPage from "@/components/landing-page"
import IntroPage from "@/components/intro-card"
import LevelSelection from "@/components/level-selection"
import GamePage from "@/components/game-page"
import SettingsPage from "@/components/settings"
import LeaderboardPage from "@/components/leaderboard"
import AchievementsPage from "@/components/achievements-page"
import { GameProvider } from "@/components/game-context"

export default function App() {
  const [currentPage, setCurrentPage] = useState("landing")
  const [selectedLevel, setSelectedLevel] = useState(1)

  const navigateTo = (page: string, level?: number) => {
    setCurrentPage(page)
    if (level) setSelectedLevel(level)
  }
  useEffect(() => {
    if (currentPage === "levels") {
      const timer = setTimeout(() => {
        setCurrentPage((prev) => (prev === "levels" ? "levels-refresh" : "levels"))
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [currentPage])

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage onNavigate={navigateTo} />
      case "intro":
        return <IntroPage onNavigate={navigateTo} />
      case "levels":
      case "levels-refresh":
        return <LevelSelection onNavigate={navigateTo} />
      case "game":
        return <GamePage level={selectedLevel} onNavigate={navigateTo} />
      case "settings":
        return <SettingsPage onNavigate={navigateTo} />
      case "leaderboard":
        return <LeaderboardPage onNavigate={navigateTo} />
      case "achievements":
        return <AchievementsPage onNavigate={navigateTo} />
      default:
        return <LandingPage onNavigate={navigateTo} />
    }
  }

  return (
    <GameProvider>
      <div className="min-h-screen">{renderCurrentPage()}</div>
    </GameProvider>
  )
}
