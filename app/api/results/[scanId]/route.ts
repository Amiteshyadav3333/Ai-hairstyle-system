import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { scanId: string } }
) {
  try {
    const { scanId } = params

    const results = await prisma.result.findMany({
      where: { scanId },
      orderBy: { score: 'desc' }
    })

    if (!results.length) {
      return NextResponse.json({ 
        success: false, 
        error: 'No results found' 
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      results
    })

  } catch (error) {
    console.error('Results API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}