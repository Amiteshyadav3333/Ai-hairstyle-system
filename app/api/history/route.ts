import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const history = await prisma.scan.findMany({
      include: {
        user: {
          select: { name: true }
        },
        results: {
          select: {
            hairstyleName: true,
            imageUrl: true,
            score: true
          },
          orderBy: { score: 'desc' }
        }
      },
      orderBy: { timestamp: 'desc' },
      take: 50 // Limit to last 50 scans
    })

    return NextResponse.json({
      success: true,
      history
    })

  } catch (error) {
    console.error('History API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}