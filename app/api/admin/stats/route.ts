import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { verifyToken } from '../../../../lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 })
    }

    // Get total counts
    const [totalUsers, totalScans] = await Promise.all([
      prisma.user.count(),
      prisma.scan.count()
    ])

    // Get today's scans
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayScans = await prisma.scan.count({
      where: {
        timestamp: {
          gte: today
        }
      }
    })

    // Get average score
    const avgScoreResult = await prisma.result.aggregate({
      _avg: {
        score: true
      }
    })

    // Get popular hairstyles
    const popularHairstyles = await prisma.result.groupBy({
      by: ['hairstyleName'],
      _count: {
        hairstyleName: true
      },
      orderBy: {
        _count: {
          hairstyleName: 'desc'
        }
      },
      take: 5
    })

    // Get recent scans
    const recentScans = await prisma.scan.findMany({
      select: {
        id: true,
        timestamp: true,
        faceShape: true,
        skinTone: true
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 10
    })

    const stats = {
      totalUsers,
      totalScans,
      todayScans,
      avgScore: Math.round(avgScoreResult._avg.score || 0),
      popularHairstyles: popularHairstyles.map(item => ({
        name: item.hairstyleName,
        count: item._count.hairstyleName
      })),
      recentScans
    }

    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}