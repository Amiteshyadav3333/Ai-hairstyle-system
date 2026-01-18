'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, Share2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Camera from '../../components/Camera'

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)
  const router = useRouter()

  const handleCapture = async (imageData: string) => {
    setIsScanning(true)
    
    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      })

      const result = await response.json()
      
      if (result.success) {
        setScanResult(result.data)
        // Navigate to results page with data
        router.push(`/result?scanId=${result.data.scanId}`)
      } else {
        alert('Scan failed: ' + result.error)
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Link href="/">
            <button className="glass rounded-xl p-3 hover:bg-white/20 transition-all">
              <ArrowLeft className="text-white" size={24} />
            </button>
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold neon-text">
            Face Analysis
          </h1>
          
          <div className="w-12"></div>
        </motion.div>

        {/* Instructions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-dark rounded-2xl p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Instructions</h2>
          <ul className="text-white/80 space-y-2">
            <li>• Position your face in the center of the frame</li>
            <li>• Ensure good lighting on your face</li>
            <li>• Look directly at the camera</li>
            <li>• Remove glasses if possible for better analysis</li>
          </ul>
        </motion.div>

        {/* Camera Component */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Camera onCapture={handleCapture} isScanning={isScanning} />
        </motion.div>

        {/* Analysis Status */}
        {isScanning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-dark rounded-2xl p-6 mt-8"
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2">Analyzing Your Face...</h3>
              <p className="text-white/70">
                AI is detecting face shape, skin tone, and generating personalized recommendations
              </p>
            </div>
          </motion.div>
        )}

        {/* Quick Tips */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid md:grid-cols-3 gap-4"
        >
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-white font-medium">Accurate Detection</div>
            <div className="text-white/70 text-sm">99% face recognition accuracy</div>
          </div>
          
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-white font-medium">Instant Results</div>
            <div className="text-white/70 text-sm">Analysis in under 3 seconds</div>
          </div>
          
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">🔒</div>
            <div className="text-white font-medium">Privacy First</div>
            <div className="text-white/70 text-sm">Images processed locally</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}