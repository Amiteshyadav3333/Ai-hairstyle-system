'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface CameraProps {
  onCapture: (imageData: string) => void
  isScanning: boolean
}

export default function Camera({ onCapture, isScanning }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    startCamera()
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: 1280, 
          height: 720,
          facingMode: 'user'
        }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setStream(mediaStream)
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.')
    }
  }

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    ctx.drawImage(video, 0, 0)
    
    const imageData = canvas.toDataURL('image/jpeg', 0.8)
    onCapture(imageData)
  }

  if (error) {
    return (
      <div className="glass-dark rounded-2xl p-8 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={startCamera} className="btn-neon">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="glass rounded-2xl p-4 mb-6">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-auto rounded-xl"
        />
        
        {/* Face detection overlay */}
        <div className="absolute inset-4 pointer-events-none">
          <div className="relative w-full h-full">
            <motion.div
              animate={isScanning ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 border-2 border-neon-blue rounded-xl"
              style={{
                boxShadow: isScanning ? '0 0 20px rgba(0, 245, 255, 0.5)' : 'none'
              }}
            />
            
            {/* Corner markers */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-neon-blue"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-neon-blue"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-neon-blue"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-neon-blue"></div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={captureImage}
          disabled={isScanning}
          className="btn-neon text-xl px-8 py-4"
        >
          {isScanning ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-neon-blue mr-3"></div>
              Analyzing...
            </div>
          ) : (
            'Capture & Analyze'
          )}
        </motion.button>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}