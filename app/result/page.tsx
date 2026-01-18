'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, Share2, Star, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'

interface Result {
  id: string
  hairstyleName: string
  imageUrl: string
  overlayUrl: string
  score: number
  reason: string
}

export default function ResultPage() {
  const [results, setResults] = useState<Result[]>([])
  const [selectedResult, setSelectedResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const scanId = searchParams.get('scanId')

  useEffect(() => {
    if (scanId) {
      fetchResults()
    }
  }, [scanId])

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/results/${scanId}`)
      const data = await response.json()
      
      if (data.success) {
        setResults(data.results)
        setSelectedResult(data.results[0])
      }
    } catch (error) {
      console.error('Failed to fetch results:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadImage = () => {
    if (!selectedResult) return
    
    const link = document.createElement('a')
    link.href = selectedResult.imageUrl
    link.download = `hairstyle-${selectedResult.hairstyleName}.jpg`
    link.click()
  }

  const shareResult = async () => {
    if (!selectedResult) return
    
    if (navigator.share) {
      await navigator.share({
        title: `My new hairstyle: ${selectedResult.hairstyleName}`,
        text: selectedResult.reason,
        url: selectedResult.imageUrl
      })
    } else {
      navigator.clipboard.writeText(selectedResult.imageUrl)
      alert('Image URL copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="glass-dark rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mx-auto mb-4"></div>
          <p className="text-white">Loading your results...</p>
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
          <Link href="/scan">
            <button className="glass rounded-xl p-3 hover:bg-white/20 transition-all">
              <ArrowLeft className="text-white" size={24} />
            </button>
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold neon-text">
            Your Perfect Hairstyles
          </h1>
          
          <div className="flex gap-2">
            <button onClick={downloadImage} className="glass rounded-xl p-3 hover:bg-white/20 transition-all">
              <Download className="text-white" size={20} />
            </button>
            <button onClick={shareResult} className="glass rounded-xl p-3 hover:bg-white/20 transition-all">
              <Share2 className="text-white" size={20} />
            </button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Main Preview */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {selectedResult && (
              <div className="glass rounded-2xl p-6">
                <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                  <Image
                    src={selectedResult.imageUrl}
                    alt={selectedResult.hairstyleName}
                    fill
                    className="object-cover"
                  />
                  {/* Overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {selectedResult.hairstyleName}
                  </h2>
                  
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex items-center bg-neon-blue/20 rounded-full px-4 py-2">
                      <Star className="text-neon-blue mr-2" size={16} />
                      <span className="text-neon-blue font-semibold">
                        {selectedResult.score}% Match
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-white/80 leading-relaxed">
                    {selectedResult.reason}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadImage}
                className="btn-neon flex-1"
              >
                <Download className="mr-2" size={20} />
                Download
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={shareResult}
                className="btn-neon flex-1"
              >
                <Share2 className="mr-2" size={20} />
                Share
              </motion.button>
            </div>
          </motion.div>

          {/* Recommendations List */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Sparkles className="mr-2 text-neon-purple" />
              All Recommendations
            </h3>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {results.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedResult(result)}
                  className={`glass rounded-xl p-4 cursor-pointer transition-all hover:bg-white/20 ${
                    selectedResult?.id === result.id ? 'neon-border' : ''
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                      <Image
                        src={result.imageUrl}
                        alt={result.hairstyleName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{result.hairstyleName}</h4>
                      <div className="flex items-center mt-1">
                        <Star className="text-neon-blue mr-1" size={14} />
                        <span className="text-neon-blue text-sm">{result.score}% Match</span>
                      </div>
                      <p className="text-white/70 text-sm mt-1 line-clamp-2">
                        {result.reason}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Try Again */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link href="/scan">
            <button className="btn-neon">
              Try Another Scan
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}