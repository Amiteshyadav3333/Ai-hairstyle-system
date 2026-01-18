'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, User, Eye } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface HistoryItem {
  id: string
  timestamp: string
  faceShape: string
  skinTone: string
  hairType: string
  user: {
    name: string | null
  }
  results: Array<{
    hairstyleName: string
    imageUrl: string
    score: number
  }>
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/history')
      const data = await response.json()
      
      if (data.success) {
        setHistory(data.history)
      }
    } catch (error) {
      console.error('Failed to fetch history:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="glass-dark rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mx-auto mb-4"></div>
          <p className="text-white">Loading history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
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
            Scan History
          </h1>
          
          <div className="w-12"></div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <div className="glass-dark rounded-xl p-6 text-center">
            <div className="text-3xl font-bold neon-text">{history.length}</div>
            <div className="text-white/70">Total Scans</div>
          </div>
          
          <div className="glass-dark rounded-xl p-6 text-center">
            <div className="text-3xl font-bold neon-text">
              {history.reduce((acc, item) => acc + item.results.length, 0)}
            </div>
            <div className="text-white/70">Hairstyles Generated</div>
          </div>
          
          <div className="glass-dark rounded-xl p-6 text-center">
            <div className="text-3xl font-bold neon-text">
              {Math.round(history.reduce((acc, item) => 
                acc + (item.results[0]?.score || 0), 0) / history.length) || 0}%
            </div>
            <div className="text-white/70">Avg Match Score</div>
          </div>
        </motion.div>

        {/* History List */}
        <div className="space-y-6">
          {history.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-dark rounded-2xl p-12 text-center"
            >
              <Calendar className="mx-auto mb-4 text-white/50" size={48} />
              <h3 className="text-xl font-semibold text-white mb-2">No Scans Yet</h3>
              <p className="text-white/70 mb-6">Start your first face scan to see results here</p>
              <Link href="/scan">
                <button className="btn-neon">Start First Scan</button>
              </Link>
            </motion.div>
          ) : (
            history.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Scan Info */}
                  <div className="lg:w-1/3">
                    <div className="flex items-center mb-4">
                      <User className="text-neon-blue mr-2" size={20} />
                      <span className="text-white font-medium">
                        {item.user.name || 'Anonymous User'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/70">Date:</span>
                        <span className="text-white">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Face Shape:</span>
                        <span className="text-white capitalize">{item.faceShape}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Skin Tone:</span>
                        <span className="text-white capitalize">{item.skinTone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Hair Type:</span>
                        <span className="text-white capitalize">{item.hairType}</span>
                      </div>
                    </div>
                  </div>

                  {/* Results Preview */}
                  <div className="lg:w-2/3">
                    <h4 className="text-white font-medium mb-4">Generated Hairstyles</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {item.results.slice(0, 3).map((result, idx) => (
                        <div key={idx} className="glass-dark rounded-xl p-3">
                          <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                            <Image
                              src={result.imageUrl}
                              alt={result.hairstyleName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="text-center">
                            <div className="text-white text-sm font-medium truncate">
                              {result.hairstyleName}
                            </div>
                            <div className="text-neon-blue text-xs">
                              {result.score}% match
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* View Details Button */}
                <div className="mt-6 text-center">
                  <Link href={`/result?scanId=${item.id}`}>
                    <button className="btn-neon">
                      <Eye className="mr-2" size={16} />
                      View Full Results
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}