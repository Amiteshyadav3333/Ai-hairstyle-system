'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Sparkles, Users, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [kioskMode, setKioskMode] = useState(false)

  const toggleKioskMode = () => {
    if (!kioskMode) {
      document.documentElement.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
    setKioskMode(!kioskMode)
  }

  return (
    <div className={`min-h-screen p-4 ${kioskMode ? 'kiosk-mode p-8' : ''}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl md:text-8xl font-bold neon-text mb-4 animate-glow">
            AI HairStyle Mirror
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8">
            Discover your perfect hairstyle with AI-powered face analysis
          </p>
        </motion.header>

        {/* Main Action */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-16"
        >
          <Link href="/scan">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-neon text-2xl md:text-3xl px-12 py-6 mb-8 animate-pulse-neon"
            >
              <Camera className="inline-block mr-4" size={32} />
              Start Face Scan
            </motion.button>
          </Link>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href="/history">
              <button className="btn-neon">
                <Users className="inline-block mr-2" size={20} />
                View History
              </button>
            </Link>
            
            <Link href="/admin">
              <button className="btn-neon">
                <BarChart3 className="inline-block mr-2" size={20} />
                Admin Panel
              </button>
            </Link>
            
            <button onClick={toggleKioskMode} className="btn-neon">
              <Sparkles className="inline-block mr-2" size={20} />
              {kioskMode ? 'Exit' : 'Kiosk'} Mode
            </button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8"
        >
          <div className="card-glass text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon-blue/20 flex items-center justify-center">
              <Camera className="text-neon-blue" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Instant Analysis</h3>
            <p className="text-white/70">AI analyzes your face shape, skin tone, and features in seconds</p>
          </div>

          <div className="card-glass text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon-purple/20 flex items-center justify-center">
              <Sparkles className="text-neon-purple" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Smart Recommendations</h3>
            <p className="text-white/70">Get personalized hairstyle suggestions based on your unique features</p>
          </div>

          <div className="card-glass text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon-green/20 flex items-center justify-center">
              <Users className="text-neon-green" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Preview & Save</h3>
            <p className="text-white/70">See realistic previews and save your favorite looks</p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="glass-dark rounded-2xl p-8">
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold neon-text">10K+</div>
                <div className="text-white/70">Scans Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold neon-text">95%</div>
                <div className="text-white/70">Accuracy Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold neon-text">50+</div>
                <div className="text-white/70">Hairstyles</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}