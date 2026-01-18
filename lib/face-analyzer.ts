export interface FaceAnalysis {
  faceShape: 'oval' | 'round' | 'square' | 'heart' | 'diamond'
  skinTone: 'fair' | 'medium' | 'olive' | 'dark'
  hairType: 'straight' | 'wavy' | 'curly'
  gender: 'male' | 'female' | 'unisex'
  beardStyle?: string
}

export interface HairstyleRecommendation {
  name: string
  score: number
  reason: string
  overlayPath: string
  category: 'short' | 'medium' | 'long'
}

export class FaceAnalyzer {
  static analyzeFaceShape(landmarks: any[]): FaceAnalysis['faceShape'] {
    // Simplified face shape detection based on landmarks
    const faceWidth = Math.abs(landmarks[454].x - landmarks[234].x)
    const faceHeight = Math.abs(landmarks[10].y - landmarks[152].y)
    const jawWidth = Math.abs(landmarks[172].x - landmarks[397].x)
    
    const ratio = faceHeight / faceWidth
    const jawRatio = jawWidth / faceWidth
    
    if (ratio > 1.3) return 'oval'
    if (ratio < 1.1 && jawRatio > 0.8) return 'round'
    if (jawRatio > 0.9) return 'square'
    if (ratio > 1.2 && jawRatio < 0.7) return 'heart'
    return 'diamond'
  }

  static analyzeSkinTone(imageData: ImageData): FaceAnalysis['skinTone'] {
    let r = 0, g = 0, b = 0, count = 0
    
    for (let i = 0; i < imageData.data.length; i += 4) {
      r += imageData.data[i]
      g += imageData.data[i + 1]
      b += imageData.data[i + 2]
      count++
    }
    
    r /= count
    g /= count
    b /= count
    
    const brightness = (r + g + b) / 3
    
    if (brightness > 200) return 'fair'
    if (brightness > 150) return 'medium'
    if (brightness > 100) return 'olive'
    return 'dark'
  }

  static getHairstyleRecommendations(analysis: FaceAnalysis): HairstyleRecommendation[] {
    const recommendations: HairstyleRecommendation[] = []
    
    // Face shape based recommendations
    const shapeRecommendations = {
      oval: [
        { name: 'Classic Bob', score: 95, reason: 'Perfect for oval faces - maintains natural proportions' },
        { name: 'Long Layers', score: 90, reason: 'Enhances your balanced facial features' },
        { name: 'Pixie Cut', score: 85, reason: 'Shows off your well-proportioned face shape' }
      ],
      round: [
        { name: 'Long Layered Cut', score: 95, reason: 'Elongates round face shape beautifully' },
        { name: 'Side-Swept Bangs', score: 90, reason: 'Creates vertical lines to slim face' },
        { name: 'Asymmetrical Bob', score: 85, reason: 'Adds angles to soften roundness' }
      ],
      square: [
        { name: 'Soft Waves', score: 95, reason: 'Softens strong jawline perfectly' },
        { name: 'Layered Lob', score: 90, reason: 'Balances angular features' },
        { name: 'Curtain Bangs', score: 85, reason: 'Frames face and softens edges' }
      ],
      heart: [
        { name: 'Chin-Length Bob', score: 95, reason: 'Balances wider forehead with fuller bottom' },
        { name: 'Side Part Waves', score: 90, reason: 'Perfect for heart-shaped faces' },
        { name: 'Textured Lob', score: 85, reason: 'Adds width at jawline' }
      ],
      diamond: [
        { name: 'Full Fringe', score: 95, reason: 'Balances narrow forehead and chin' },
        { name: 'Shoulder Length', score: 90, reason: 'Widens narrow chin area' },
        { name: 'Voluminous Curls', score: 85, reason: 'Adds width where needed' }
      ]
    }

    const baseRecs = shapeRecommendations[analysis.faceShape]
    
    baseRecs.forEach((rec, index) => {
      recommendations.push({
        ...rec,
        overlayPath: `/hairstyles/${analysis.faceShape}/${rec.name.toLowerCase().replace(/\s+/g, '-')}.png`,
        category: index === 0 ? 'short' : index === 1 ? 'medium' : 'long'
      })
    })

    return recommendations.sort((a, b) => b.score - a.score)
  }
}