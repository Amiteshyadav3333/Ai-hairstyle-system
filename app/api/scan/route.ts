import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { FaceAnalyzer } from '../../../lib/face-analyzer'
import { uploadToCloudinary } from '../../../lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()
    
    if (!image) {
      return NextResponse.json({ success: false, error: 'No image provided' })
    }

    // Convert base64 to buffer
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    // Mock upload result for testing (replace with real Cloudinary later)
    const uploadResult = {
      secure_url: 'https://via.placeholder.com/800x800/1a1a1a/00f5ff?text=Face+Scan'
    }
    
    // Simulate face analysis (in production, use MediaPipe/OpenCV)
    const mockAnalysis = {
      faceShape: 'oval' as const,
      skinTone: 'medium' as const,
      hairType: 'wavy' as const,
      gender: 'unisex' as const
    }

    // Get hairstyle recommendations
    const recommendations = FaceAnalyzer.getHairstyleRecommendations(mockAnalysis)

    // Create user and scan records
    const user = await prisma.user.create({
      data: {
        name: null,
        gender: mockAnalysis.gender
      }
    })

    const scan = await prisma.scan.create({
      data: {
        userId: user.id,
        faceShape: mockAnalysis.faceShape,
        skinTone: mockAnalysis.skinTone,
        hairType: mockAnalysis.hairType,
        beardStyle: null
      }
    })

    // Save recommendations as results
    const results = await Promise.all(
      recommendations.map(rec => 
        prisma.result.create({
          data: {
            scanId: scan.id,
            hairstyleName: rec.name,
            imageUrl: uploadResult.secure_url,
            overlayUrl: rec.overlayPath,
            score: rec.score,
            reason: rec.reason
          }
        })
      )
    )

    return NextResponse.json({
      success: true,
      data: {
        scanId: scan.id,
        analysis: mockAnalysis,
        recommendations: results,
        originalImage: uploadResult.secure_url
      }
    })

  } catch (error) {
    console.error('Scan API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}