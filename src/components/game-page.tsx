"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Lightbulb, RotateCcw, Pause, Play, ArrowUp, ArrowDown, ArrowRight } from "lucide-react"
import { useGame } from "@/components/game-context"

interface GamePageProps {
  level: number
  onNavigate: (page: string, level?: number) => void
}

interface Animal {
  x: number
  y: number
  type: "dog" | "cat"
  speed: number
  counter: number
}

export default function GamePage({ level, onNavigate }: GamePageProps) {
  const { completeLevel, settings } = useGame()
  const [gameState, setGameState] = useState<"playing" | "paused" | "completed" | "failed">("playing")
  const [timeLeft, setTimeLeft] = useState(30)
  const [carminePos, setCarminePos] = useState({ x: 1, y: 1 })
  const [showHint, setShowHint] = useState(false)
  const [hintPath, setHintPath] = useState<{ x: number; y: number }[]>([])
  const [hintsUsed, setHintsUsed] = useState(0)
  const [moves, setMoves] = useState(0)
  const [showMobileControls, setShowMobileControls] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [animals, setAnimals] = useState<Animal[]>([])
  const [, setFrameCount] = useState(0)

  const levelData = {
    1: {
      target: { x: 8, y: 8 },
      targetEmoji: "👵",
      item: "🍚",
      message: "Thank you for the rice, dear!",
      startPos: { x: 1, y: 1 },
    },
    2: {
      target: { x: 7, y: 2 },
      targetEmoji: "👨‍💼",
      item: "🍞",
      message: "Excellent! The town appreciates your service!",
      startPos: { x: 1, y: 1 },
    },
    3: {
      target: { x: 5, y: 7 },
      targetEmoji: "👨‍🍳",
      item: "🥕🥔",
      message: "Perfect! These vegetables will make a great dish!",
      startPos: { x: 2, y: 2 },
    },
    4: {
      target: { x: 3, y: 3 },
      targetEmoji: "👨‍⚕️",
      item: "💊",
      message: "Thank you! This medicine will help many patients!",
      startPos: { x: 8, y: 1 },
    },
    5: {
      target: { x: 6, y: 5 },
      targetEmoji: "👦",
      item: "🍱",
      message: "AHHH! My lunch! Thank you so much!",
      startPos: { x: 1, y: 8 },
    },
    6: {
      target: { x: 9, y: 1 },
      targetEmoji: "🏥",
      item: "🚑",
      message: "Emergency delivery completed! You are a life saver, Carmine!",
      startPos: { x: 0, y: 9 },
    },
    7: {
      target: { x: 2, y: 9 },
      targetEmoji: "👰",
      item: "💐",
      message: "Beautiful flowers! My wedding will be perfect thanks to you!",
      startPos: { x: 9, y: 0 },
    },
    8: {
      target: { x: 8, y: 3 },
      targetEmoji: "👨‍🚒",
      item: "🧯",
      message: "Fire equipment delivered! The city is safer thanks to Carmine!",
      startPos: { x: 0, y: 0 },
    },
  }

  const currentLevel = levelData[level as keyof typeof levelData] || levelData[1]
  const gridSize = 10

  const getObstacles = () => {
    const baseObstacles = [
      { x: 3, y: 4, type: "tree" },
      { x: 4, y: 4, type: "tree" },
      { x: 5, y: 4, type: "tree" },
      { x: 7, y: 6, type: "rock" },
      { x: 7, y: 7, type: "rock" },
      { x: 8, y: 6, type: "tree" },
    ]

    if (level >= 3) {
      baseObstacles.push(
        { x: 6, y: 1, type: "tree" },
        { x: 6, y: 2, type: "tree" },
        { x: 1, y: 5, type: "rock" },
        { x: 3, y: 6, type: "tree" },
      )
    }

    if (level >= 5) {
      baseObstacles.push(
        { x: 9, y: 4, type: "rock" },
        { x: 9, y: 5, type: "rock" },
        { x: 4, y: 9, type: "tree" },
        { x: 5, y: 2, type: "tree" },
        { x: 2, y: 3, type: "rock" },
      )
    }

    if (level >= 7) {
      baseObstacles.push(
        { x: 0, y: 6, type: "rock" },
        { x: 2, y: 0, type: "tree" },
        { x: 8, y: 9, type: "rock" },
        { x: 7, y: 4, type: "tree" },
        { x: 7, y: 5, type: "tree" },
        { x: 4, y: 6, type: "rock" },
        { x: 5, y: 6, type: "rock" },
      )
    }

    if (level === 8) {
      baseObstacles.push(
        { x: 2, y: 2, type: "tree" },
        { x: 3, y: 2, type: "rock" },
        { x: 3, y: 5, type: "rock" },
        { x: 9, y: 6, type: "rock" },
        { x: 9, y: 7, type: "rock" },
        { x: 5, y: 9, type: "rock" },
      )
    }

    return baseObstacles
  }

  const getBuildings = () => [
    { x: 8, y: 8, type: "house" },
    { x: 7, y: 2, type: "mansion" },
    { x: 5, y: 7, type: "restaurant" },
    { x: 3, y: 3, type: "clinic" },
    { x: 6, y: 5, type: "school" },
    { x: 9, y: 1, type: "hospital" },
    { x: 2, y: 9, type: "church" },
    { x: 8, y: 3, type: "fire-station" },
  ]

  const getAnimalsForLevel = (): Animal[] => {
    const animals: Animal[] = []
    const animalTypes: ("dog" | "cat")[] = ["dog", "cat"]

    const isValidPosition = (x: number, y: number) => {
    const isObstacle = obstacles.some(obs => obs.x === x && obs.y === y)
    const isBuilding = buildings.some(b => b.x === x && b.y === y)
    const isOnCarmine = (x === currentLevel.startPos.x && y === currentLevel.startPos.y)
    const isOnTarget = (x === currentLevel.target.x && y === currentLevel.target.y)
    return !isObstacle && !isBuilding && !isOnCarmine && !isOnTarget
  }
    
    if (level >= 1) {
    let x, y
    do {
      x = Math.floor(Math.random() * gridSize)
      y = Math.floor(Math.random() * gridSize)
    } while (!isValidPosition(x, y))
    
    animals.push({
      x,
      y,
      type: animalTypes[Math.floor(Math.random() * animalTypes.length)],
      speed: 3,
      counter: 0
    })
  }

    if (level >= 3) {
      let x, y
      do {
        x = Math.floor(Math.random() * gridSize)
        y = Math.floor(Math.random() * gridSize)
      } while (!isValidPosition(x, y))
      
      animals.push({
        x,
        y,
        type: animalTypes[Math.floor(Math.random() * animalTypes.length)],
        speed: level >= 6 ? 2 : 3,
        counter: 0
      })
    }

    if (level >= 6) {
      let x, y
      do {
        x = Math.floor(Math.random() * gridSize)
        y = Math.floor(Math.random() * gridSize)
      } while (!isValidPosition(x, y))

      animals.push({
        x,
        y,
        type: animalTypes[Math.floor(Math.random() * animalTypes.length)],
        speed: 2,
        counter: 0
      })
    }

    if (level === 8) {
      let x, y
      do {
        x = Math.floor(Math.random() * gridSize)
        y = Math.floor(Math.random() * gridSize)
      } while (!isValidPosition(x, y))

      animals.push({
        x,
        y,
        type: animalTypes[Math.floor(Math.random() * animalTypes.length)],
        speed: 3,
        counter: 0
      })
    }

    return animals.filter(animal => {
      const isObstacle = obstacles.some(obs => obs.x === animal.x && obs.y === animal.y)
      const isBuilding = buildings.some(b => b.x === animal.x && b.y === animal.y)
      const isOnCarmine = (animal.x === currentLevel.startPos.x && animal.y === currentLevel.startPos.y)
      return !isObstacle && !isBuilding && !isOnCarmine
    })
  }

  const getTimeLimit = () => {
    let baseTime
    switch (settings.difficulty) {
      case "easy":
        baseTime = 45
        break
      case "medium":
        baseTime = 30
        break
      case "hard":
        baseTime = 20
        break
      default:
        baseTime = 30
    }

    if (level >= 6) baseTime -= 5
    if (level === 8) baseTime -= 3

    return Math.max(10, baseTime)
  }

  const obstacles = getObstacles()
  const buildings = getBuildings()

  useEffect(() => {
    if (!initialized) {
      setInitialized(true)
    }

    setCarminePos(currentLevel.startPos)
    setTimeLeft(getTimeLimit())
    setGameState("playing")
    setHintsUsed(0)
    setMoves(0)
    setShowHint(false)
    setHintPath([])
    setAnimals(getAnimalsForLevel())

    const checkMobile = () => setShowMobileControls(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [level])

  useEffect(() => {
    if (gameState !== "playing") return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("failed")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState])

  useEffect(() => {
    if (gameState !== "playing") return

    const interval = setInterval(() => {
      setFrameCount(prev => prev + 1)
      
      setAnimals(prevAnimals => {
        return prevAnimals.map(animal => {
          if (animal.counter < animal.speed) {
            return {...animal, counter: animal.counter + 1}
          }

          const updatedAnimal = {...animal, counter: 0}

          const path = leeAlgorithm(
            {x: animal.x, y: animal.y},
            {x: carminePos.x, y: carminePos.y}
          )
          
          if (path.length > 0) {
            const maxSteps = level <= 2 ? path.length - 1 : path.length
            if (maxSteps > 0) {
              const nextStep = path[Math.min(1, maxSteps) - 1]
              const isObstacle = obstacles.some(obs => obs.x === nextStep.x && obs.y === nextStep.y)
              const isBuilding = buildings.some(b => b.x === nextStep.x && b.y === nextStep.y)
              
              if (!isObstacle && !isBuilding) {
                updatedAnimal.x = nextStep.x
                updatedAnimal.y = nextStep.y
              }
            }
          }
          if (level > 2 && updatedAnimal.x === carminePos.x && updatedAnimal.y === carminePos.y) {
            setGameState("failed")
          }

          return updatedAnimal
        })
      })
    }, 200)

    return () => clearInterval(interval)
  }, [gameState, carminePos.x, carminePos.y, level])

  useEffect(() => {
    if (carminePos.x === currentLevel.target.x && carminePos.y === currentLevel.target.y && gameState === "playing") {
      setGameState("completed")
      completeLevel(level, timeLeft, hintsUsed)
    }
  }, [carminePos.x, carminePos.y, currentLevel.target.x, currentLevel.target.y, gameState])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState !== "playing") return

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", " ", "Escape"].includes(e.key)) {
        e.preventDefault()
      }

      let newX = carminePos.x
      let newY = carminePos.y

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          newY = Math.max(0, carminePos.y - 1)
          break
        case "ArrowDown":
        case "s":
        case "S":
          newY = Math.min(gridSize - 1, carminePos.y + 1)
          break
        case "ArrowLeft":
        case "a":
        case "A":
          newX = Math.max(0, carminePos.x - 1)
          break
        case "ArrowRight":
        case "d":
        case "D":
          newX = Math.min(gridSize - 1, carminePos.x + 1)
          break
        case " ":
          handleHint()
          return
        case "Escape":
          setGameState((prev) => (prev === "paused" ? "playing" : "paused"))
          return
      }

      const isObstacle = obstacles.some((obs) => obs.x === newX && obs.y === newY) || 
                        buildings.some((b) => b.x === newX && b.y === newY && 
                        !(b.x === currentLevel.target.x && b.y === currentLevel.target.y))
      
      const isAnimal = animals.some(a => a.x === newX && a.y === newY)
      
      if (!isObstacle && !isAnimal && (newX !== carminePos.x || newY !== carminePos.y)) {
        setCarminePos({ x: newX, y: newY })
        setMoves((prev) => prev + 1)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [gameState, carminePos.x, carminePos.y])


// -------------------------- LEE ALGORITHM APPLICATION -------------------------------------//

  const leeAlgorithm = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const grid = Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill(-1))
    const queue: { x: number; y: number; dist: number }[] = []

    obstacles.forEach((obs) => {
      if (obs.x < gridSize && obs.y < gridSize) {
        grid[obs.y][obs.x] = -2
      }
    })

    buildings.forEach((b) => {
      if (b.x < gridSize && b.y < gridSize && 
          !(b.x === currentLevel.target.x && b.y === currentLevel.target.y)) {
        grid[b.y][b.x] = -2
      }
    })

    grid[start.y][start.x] = 0
    queue.push({ x: start.x, y: start.y, dist: 0 })

    const directions = [
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: 0, y: -1 },
      { x: -1, y: 0 },
    ]

    while (queue.length > 0) {
      const current = queue.shift()!

      if (current.x === end.x && current.y === end.y) {
        break
      }

      directions.forEach((dir) => {
        const newX = current.x + dir.x
        const newY = current.y + dir.y

        if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize && grid[newY][newX] === -1) {
          grid[newY][newX] = current.dist + 1
          queue.push({ x: newX, y: newY, dist: current.dist + 1 })
        }
      })
    }

    const path: { x: number; y: number }[] = []
    let current = { x: end.x, y: end.y }

    while (current.x !== start.x || current.y !== start.y) {
      path.unshift(current)
      const currentDist = grid[current.y][current.x]

      let found = false
      directions.forEach((dir) => {
        if (found) return
        const newX = current.x + dir.x
        const newY = current.y + dir.y

        if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize && grid[newY][newX] === currentDist - 1) {
          current = { x: newX, y: newY }
          found = true
        }
      })

      if (!found) break
    }

    return path
  }

  const handleHint = () => {
    if (showHint) return

    const path = leeAlgorithm(carminePos, currentLevel.target)
    setHintPath(path)
    setShowHint(true)
    setHintsUsed((prev) => prev + 1)

    setTimeout(() => {
      setShowHint(false)
      setHintPath([])
    }, 3000)
  }

  const resetLevel = () => {
    setGameState("playing")
    setTimeLeft(getTimeLimit())
    setCarminePos(currentLevel.startPos)
    setHintsUsed(0)
    setMoves(0)
    setShowHint(false)
    setHintPath([])
    setAnimals(getAnimalsForLevel())
  }

  const togglePause = () => {
    setGameState((prev) => (prev === "paused" ? "playing" : "paused"))
  }

  const moveCharacter = (direction: "up" | "down" | "left" | "right") => {
    if (gameState !== "playing") return

    let newX = carminePos.x
    let newY = carminePos.y

    switch (direction) {
      case "up":
        newY = Math.max(0, carminePos.y - 1)
        break
      case "down":
        newY = Math.min(gridSize - 1, carminePos.y + 1)
        break
      case "left":
        newX = Math.max(0, carminePos.x - 1)
        break
      case "right":
        newX = Math.min(gridSize - 1, carminePos.x + 1)
        break
    }

    const isObstacle = obstacles.some((obs) => obs.x === newX && obs.y === newY) || 
                      buildings.some((b) => b.x === newX && b.y === newY && 
                      !(b.x === currentLevel.target.x && b.y === currentLevel.target.y))
    
    const isAnimal = animals.some(a => a.x === newX && a.y === newY)
    
    if (!isObstacle && !isAnimal && (newX !== carminePos.x || newY !== carminePos.y)) {
      setCarminePos({ x: newX, y: newY })
      setMoves((prev) => prev + 1)
    }
  }

  const getObstacleEmoji = (type: string) => {
    switch (type) {
      case "tree":
        return "🌲"
      case "rock":
        return "🪨"
      default:
        return "🚧"
    }
  }

  const getBuildingEmoji = (type: string) => {
    switch (type) {
      case "house":
        return "🏠"
      case "mansion":
        return "🏛️"
      case "restaurant":
        return "🍽️"
      case "clinic":
        return "🏥"
      case "school":
        return "🏫"
      case "hospital":
        return "🏥"
      case "church":
        return "⛪"
      case "fire-station":
        return "🚒"
      default:
        return "🏢"
    }
  }

  const renderGrid = () => {
    const cells = []

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const isCarmine = carminePos.x === x && carminePos.y === y
        const isTarget = currentLevel.target.x === x && currentLevel.target.y === y
        const obstacle = obstacles.find((obs) => obs.x === x && obs.y === y)
        const building = buildings.find((b) => b.x === x && b.y === y)
        const animal = animals.find(a => a.x === x && a.y === y)
        const isObstacle = !!obstacle
        const isBuilding = !!building && !isTarget
        const isHintPath = showHint && hintPath.some((pos) => pos.x === x && pos.y === y)

        let cellContent = ""
        let cellClass = ""

        if (animal) {
          cellContent = animal.type === "dog" ? "🐕" : "🐈"
          cellClass = "z-5 animate-bounce"
        } else if (isCarmine) {
          cellContent = "👧"
          cellClass = "z-10"
        } else if (isTarget) {
          cellContent = currentLevel.targetEmoji
          cellClass = "z-5"
        } else if (isObstacle) {
          cellContent = getObstacleEmoji(obstacle.type)
          cellClass = "bg-gray-600 text-white"
        } else if (isBuilding) {
          cellContent = getBuildingEmoji(building.type)
          cellClass = "bg-gray-600 text-white"
        }

        cells.push(
          <div
            key={`${x}-${y}`}
            className={`w-10 h-10 md:w-12 md:h-12 border flex items-center justify-center text-xl md:text-2xl transition-all ${
              settings.showGrid ? "border-gray-300" : "border-transparent"
            } ${
              isObstacle || isBuilding
                ? "bg-gray-600"
                : isHintPath
                  ? "bg-yellow-300 animate-pulse shadow-lg"
                  : "bg-green-100 hover:bg-green-200"
            } ${cellClass}`}
          >
            {cellContent}
          </div>,
        )
      }
    }

    return cells
  }

  const MobileControls = () => (
    <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto mt-4">
      <div className="col-start-2">
        <Button variant="outline" size="lg" className="w-full aspect-square" onClick={() => moveCharacter("up")}>
          <ArrowUp className="w-6 h-6" />
        </Button>
      </div>
      <div className="col-start-1">
        <Button variant="outline" size="lg" className="w-full aspect-square" onClick={() => moveCharacter("left")}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
      </div>
      <div className="col-start-2">
        <Button variant="outline" size="lg" className="w-full aspect-square" onClick={() => moveCharacter("down")}>
          <ArrowDown className="w-6 h-6" />
        </Button>
      </div>
      <div className="col-start-3">
        <Button variant="outline" size="lg" className="w-full aspect-square" onClick={() => moveCharacter("right")}>
          <ArrowRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  )

  if (gameState === "completed") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-300 to-blue-400 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md w-full bg-white/90 backdrop-blur-sm">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-800 mb-4">Delivery Complete!</h2>
          <div className="text-4xl mb-4">{currentLevel.targetEmoji}</div>
          <p className="text-lg mb-4">&ldquo;{currentLevel.message}&rdquo;</p>

          <div className="bg-blue-50 p-4 rounded-lg mb-6 space-y-2">
            <div className="flex justify-between">
              <span>Time Remaining:</span>
              <span className="font-bold">{timeLeft}s</span>
            </div>
            <div className="flex justify-between">
              <span>Moves Made:</span>
              <span className="font-bold">{moves}</span>
            </div>
            <div className="flex justify-between">
              <span>Hints Used:</span>
              <span className="font-bold">{hintsUsed}</span>
            </div>
            {hintsUsed === 0 && timeLeft > 20 && (
              <Badge className="w-full bg-yellow-100 text-yellow-800">Perfect Run! 🌟</Badge>
            )}
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => {
                const nextLevel = level + 1
                if (nextLevel <= 8) {
                  onNavigate("game", nextLevel)
                } else {
                  onNavigate("levels")
                }
              }}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {level < 8 ? "Next Level" : "Continue"}
            </Button>
            <Button onClick={resetLevel} variant="outline" className="w-full">
              Play Again
            </Button>
            <Button onClick={() => onNavigate("levels")} variant="outline" className="w-full">
              Level Selection
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (gameState === "failed") {
    if (animals.some(a => a.x === carminePos.x && a.y === carminePos.y)) {
      const caughtBy = animals.find(a => a.x === carminePos.x && a.y === carminePos.y)
      return (
        <div className="min-h-screen bg-gradient-to-b from-red-300 to-orange-400 flex items-center justify-center p-4">
          <Card className="p-8 text-center max-w-md w-full bg-white/90 backdrop-blur-sm">
            <div className="text-6xl mb-4">
              {caughtBy?.type === "dog" ? "🐕" : "🐈"}
            </div>
            <h2 className="text-2xl font-bold text-red-800 mb-4">
              Oh no! The {caughtBy?.type} caught you!
            </h2>
            <p className="text-lg mb-6">Don&apos;t worry, Carmine! Let&apos;s try again!</p>
            <div className="space-y-3">
              <Button onClick={resetLevel} className="w-full bg-red-600 hover:bg-red-700">
                Try Again
              </Button>
              <Button onClick={() => onNavigate("levels")} variant="outline" className="w-full">
                Level Selection
              </Button>
            </div>
          </Card>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-red-300 to-orange-400 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md w-full bg-white/90 backdrop-blur-sm">
          <div className="text-6xl mb-4">⏰</div>
          <h2 className="text-2xl font-bold text-red-800 mb-4">Time&apos;s Up!</h2>
          <p className="text-lg mb-6">Don&apos;t worry, Carmine! Let&apos;s try again!</p>
          <div className="space-y-3">
            <Button onClick={resetLevel} className="w-full bg-red-600 hover:bg-red-700">
              Try Again
            </Button>
            <Button onClick={() => onNavigate("levels")} variant="outline" className="w-full">
              Level Selection
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-green-300 p-2 md:p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="p-4 mb-4 bg-white/90 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => onNavigate("levels")}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h2 className="text-xl font-bold">Level {level}</h2>
                <p className="text-sm text-gray-600">
                  Deliver {currentLevel.item} to {currentLevel.targetEmoji}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${timeLeft <= 10 ? "text-red-600 animate-pulse" : "text-green-600"}`}>
                {timeLeft}s
              </div>
              <div className="text-sm text-gray-600">Time Left</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 mb-4 bg-white/90 backdrop-blur-sm">
          {gameState === "paused" && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-lg">
              <Card className="p-6 text-center">
                <h3 className="text-xl font-bold mb-4">Game Paused</h3>
                <Button onClick={togglePause}>Resume</Button>
              </Card>
            </div>
          )}
          <div className="grid grid-cols-10 gap-1 max-w-fit mx-auto relative">{renderGrid()}</div>
          {showMobileControls && <MobileControls />}
        </Card>

        <Card className="p-4 mb-4 bg-white/90 backdrop-blur-sm">
          <div className="text-sm text-gray-600 flex flex-wrap gap-3 justify-center">
            <span className="flex items-center gap-1">👧 Carmine</span>
            <span className="flex items-center gap-1">🌲 Tree</span>
            <span className="flex items-center gap-1">🪨 Rock</span>
            <span className="flex items-center gap-1">🏠 Building</span>
            <span className="flex items-center gap-1">{currentLevel.targetEmoji} Destination</span>
            <span className="flex items-center gap-1">🐕 Dog</span>
            <span className="flex items-center gap-1">🐈 Cat</span>
          </div>
        </Card>

        <Card className="p-4 bg-white/90 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="space-y-1 text-center md:text-left">
              <p className="text-sm text-gray-600">
                Use <span className="font-medium">Arrow keys</span> or <span className="font-medium">WASD</span> to move
                • Space for hint • ESC to pause
              </p>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>Moves: {moves}</span>
                <span>Hints: {hintsUsed}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleHint} disabled={showHint} className="bg-yellow-500 hover:bg-yellow-600">
                <Lightbulb className="w-4 h-4 mr-1" />
                Hint
              </Button>
              <Button onClick={togglePause} variant="outline">
                {gameState === "paused" ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </Button>
              <Button onClick={resetLevel} variant="outline">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}