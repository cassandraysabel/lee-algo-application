"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

interface IntroPageProps {
  onNavigate: (page: string) => void
}

export default function IntroPage({ onNavigate }: IntroPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-300 to-blue-400 flex items-center justify-center p-4">
      <Card className="p-8 text-center max-w-lg w-full bg-white/90 backdrop-blur-sm relative">
        <Button variant="ghost" size="sm" onClick={() => onNavigate("landing")} className="absolute top-4 left-4 p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>

        <div className="mb-6">
          <div className="text-8xl mb-4">👧</div>
          <h2 className="text-3xl font-bold text-orange-800 mb-4">Meet Carmine!</h2>
        </div>

        <div className="space-y-4 text-md text-gray-700 mb-8">
          <p>Hi there! I&apos;m Carmine, and I help my village by delivering groceries to everyone!</p>
          <p>
            if you get stuck, just press the Hint button and I&apos;ll show you the shortest path!
          </p>

          <div className="bg-orange-50 p-4 rounded-lg text-sm">
            <h3 className="font-bold mb-2">🎮 How to Play:</h3>
            <ul className="text-left space-y-1">
              <li>• Use arrow keys to move around</li>
              <li>• Avoid obstacles (🚧) and dogs!</li>
              <li>• Reach your destination before time runs out</li>
              <li>• Press Hint— or the spacebar if you need help</li>
            </ul>
          </div>
        </div>

        <Button onClick={() => onNavigate("levels")} className="w-full text-lg py-3 bg-orange-600 hover:bg-orange-700">
          Let&apos;s Go! 🛒
        </Button>
      </Card>
    </div>
  )
}
