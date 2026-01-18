'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, Scan, TrendingUp, Calendar } from 'lucide-react'
import Link from 'next/link'

interface AdminStats {
  totalScans: number
  totalUsers: number
  todayScans: number
  avgScore: number
  popularHairstyles: Array<{
    name: string
    count: number
  }>
  recentScans: Array<{
    id: string
    timestamp: string
    faceShape: string
    skinTone: string
  }>
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [credentials, setCredentials] = useState({ email: '', password: '' })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      setIsAuthenticated(true)
      fetchStats()
    } else {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })

      const data = await response.json()
      
      if (data.success) {
        localStorage.setItem('adminToken', data.token)
        setIsAuthenticated(true)
        fetchStats()
      } else {
        alert('Invalid credentials')
      }
    } catch (error) {
      alert('Login failed')
    }
  }

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      const data = await response.json()
      
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    setIsAuthenticated(false)
    setStats(null)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-dark rounded-2xl p-8 w-full max-w-md"
        >
          <h1 className="text-2xl font-bold neon-text text-center mb-8">
            Admin Login
          </h1>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-white/70 mb-2">Email</label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                className="w-full glass rounded-xl px-4 py-3 text-white placeholder-white/50 border-0 focus:neon-border"
                placeholder="admin@example.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-white/70 mb-2">Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full glass rounded-xl px-4 py-3 text-white placeholder-white/50 border-0 focus:neon-border"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button type="submit" className="btn-neon w-full">
              Login
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link href="/" className="text-white/70 hover:text-white">
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="glass-dark rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mx-auto mb-4"></div>
          <p className="text-white">Loading dashboard...</p>
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
            Admin Dashboard
          </h1>
          
          <button onClick={logout} className="glass rounded-xl px-4 py-2 text-white hover:bg-white/20">
            Logout
          </button>
        </motion.div>

        {stats && (
          <>
            {/* Stats Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-4 gap-6 mb-8"
            >
              <div className="glass-dark rounded-xl p-6 text-center">
                <Users className="mx-auto mb-3 text-neon-blue" size={32} />
                <div className="text-3xl font-bold neon-text">{stats.totalUsers}</div>
                <div className="text-white/70">Total Users</div>
              </div>
              
              <div className="glass-dark rounded-xl p-6 text-center">
                <Scan className="mx-auto mb-3 text-neon-purple" size={32} />
                <div className="text-3xl font-bold neon-text">{stats.totalScans}</div>
                <div className="text-white/70">Total Scans</div>
              </div>
              
              <div className="glass-dark rounded-xl p-6 text-center">
                <Calendar className="mx-auto mb-3 text-neon-green" size={32} />
                <div className="text-3xl font-bold neon-text">{stats.todayScans}</div>
                <div className="text-white/70">Today's Scans</div>
              </div>
              
              <div className="glass-dark rounded-xl p-6 text-center">
                <TrendingUp className="mx-auto mb-3 text-neon-pink" size={32} />
                <div className="text-3xl font-bold neon-text">{stats.avgScore}%</div>
                <div className="text-white/70">Avg Match Score</div>
              </div>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Popular Hairstyles */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="text-xl font-semibold text-white mb-6">Popular Hairstyles</h3>
                <div className="space-y-4">
                  {stats.popularHairstyles.map((style, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-white">{style.name}</span>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-white/20 rounded-full mr-3">
                          <div 
                            className="h-full bg-neon-blue rounded-full"
                            style={{ width: `${(style.count / stats.popularHairstyles[0].count) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-neon-blue font-semibold">{style.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Recent Scans */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="text-xl font-semibold text-white mb-6">Recent Scans</h3>
                <div className="space-y-4">
                  {stats.recentScans.map((scan, index) => (
                    <div key={scan.id} className="glass-dark rounded-xl p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-white font-medium">
                            {new Date(scan.timestamp).toLocaleString()}
                          </div>
                          <div className="text-white/70 text-sm mt-1">
                            {scan.faceShape} face • {scan.skinTone} skin
                          </div>
                        </div>
                        <Link href={`/result?scanId=${scan.id}`}>
                          <button className="text-neon-blue hover:text-neon-blue/80 text-sm">
                            View →
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}