"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface GameStats {
  totalDeliveries: number
  totalTime: number
  bestTimes: Record<number, number>
  achievements: string[]
  hintsUsed: number
  perfectRuns: number
}

interface GameContextType {
  completedLevels: number[]
  gameStats: GameStats
  settings: {
    soundEnabled: boolean
    difficulty: "easy" | "medium" | "hard"
    showGrid: boolean
  }
  completeLevel: (level: number, timeRemaining: number, hintsUsed: number) => void
  updateSettings: (newSettings: Partial<GameContextType["settings"]>) => void
  unlockAchievement: (achievement: string) => void
  resetGameProgress: () => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [completedLevels, setCompletedLevels] = useState<number[]>([])
  const [gameStats, setGameStats] = useState<GameStats>({
    totalDeliveries: 0,
    totalTime: 0,
    bestTimes: {},
    achievements: [],
    hintsUsed: 0,
    perfectRuns: 0,
  })
  const [settings, setSettings] = useState<{
    soundEnabled: boolean
    difficulty: "easy" | "medium" | "hard"
    showGrid: boolean
  }>({
    soundEnabled: true,
    difficulty: "medium",
    showGrid: true,
  })

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("carmines-quest-data")
    if (savedData) {
      const data = JSON.parse(savedData)
      setCompletedLevels(data.completedLevels || [])
      setGameStats(data.gameStats || gameStats)
      setSettings(data.settings || settings)
    }
  }, [])

  // Save data to localStorage
  useEffect(() => {
    const dataToSave = {
      completedLevels,
      gameStats,
      settings,
    }
    localStorage.setItem("carmines-quest-data", JSON.stringify(dataToSave))
  }, [completedLevels, gameStats, settings])

  const completeLevel = (level: number, timeRemaining: number, hintsUsed: number) => {
    // Immediately update the completedLevels state
    setCompletedLevels((prev) => {
      // Only add the level if it's not already in the array
      if (!prev.includes(level)) {
        const newCompletedLevels = [...prev, level]
        // Immediately save to localStorage
        const dataToSave = {
          completedLevels: newCompletedLevels,
          gameStats,
          settings,
        }
        localStorage.setItem("carmines-quest-data", JSON.stringify(dataToSave))
        return newCompletedLevels
      }
      return prev
    })

    setGameStats((prev) => {
      const newStats = {
        ...prev,
        totalDeliveries: prev.totalDeliveries + 1,
        totalTime: prev.totalTime + (30 - timeRemaining),
        hintsUsed: prev.hintsUsed + hintsUsed,
      }

      // Update best time for level
      const currentBest = prev.bestTimes[level]
      if (!currentBest || timeRemaining > currentBest) {
        newStats.bestTimes = { ...prev.bestTimes, [level]: timeRemaining }
      }

      // Check perfect run (no hints, fast completion)
      if (hintsUsed === 0 && timeRemaining > 20) {
        newStats.perfectRuns = prev.perfectRuns + 1
      }

      return newStats
    })

    // Check for achievements
    checkAchievements(level, timeRemaining, hintsUsed)
  }

  const checkAchievements = (level: number, timeRemaining: number, hintsUsed: number) => {
    const newAchievements: string[] = []

    if (level === 1 && !gameStats.achievements.includes("first-delivery")) {
      newAchievements.push("first-delivery")
    }

    if (hintsUsed === 0 && !gameStats.achievements.includes("no-hints")) {
      newAchievements.push("no-hints")
    }

    if (timeRemaining > 25 && !gameStats.achievements.includes("speed-demon")) {
      newAchievements.push("speed-demon")
    }

    if (completedLevels.length === 4 && !gameStats.achievements.includes("all-levels")) {
      newAchievements.push("all-levels")
    }

    if (newAchievements.length > 0) {
      setGameStats((prev) => ({
        ...prev,
        achievements: [...prev.achievements, ...newAchievements],
      }))
    }
  }

  const updateSettings = (newSettings: Partial<GameContextType["settings"]>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  const unlockAchievement = (achievement: string) => {
    setGameStats((prev) => {
      if (!prev.achievements.includes(achievement)) {
        return {
          ...prev,
          achievements: [...prev.achievements, achievement],
        }
      }
      return prev
    })
  }

  const resetGameProgress = () => {
    // Reset all game progress but keep settings
    setCompletedLevels([])
    setGameStats({
      totalDeliveries: 0,
      totalTime: 0,
      bestTimes: {},
      achievements: [],
      hintsUsed: 0,
      perfectRuns: 0,
    })

    // Save the reset state to localStorage
    const dataToSave = {
      completedLevels: [],
      gameStats: {
        totalDeliveries: 0,
        totalTime: 0,
        bestTimes: {},
        achievements: [],
        hintsUsed: 0,
        perfectRuns: 0,
      },
      settings,
    }
    localStorage.setItem("carmines-quest-data", JSON.stringify(dataToSave))
  }

  return (
    <GameContext.Provider
      value={{
        completedLevels,
        gameStats,
        settings,
        completeLevel,
        updateSettings,
        unlockAchievement,
        resetGameProgress,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
