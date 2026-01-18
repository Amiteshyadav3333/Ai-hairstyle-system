# Hairstyle Overlay Images

This directory contains PNG overlay images for different face shapes and hairstyles.

## Directory Structure

```
public/hairstyles/
├── oval/
│   ├── classic-bob.png
│   ├── long-layers.png
│   └── pixie-cut.png
├── round/
│   ├── long-layered-cut.png
│   ├── side-swept-bangs.png
│   └── asymmetrical-bob.png
├── square/
│   ├── soft-waves.png
│   ├── layered-lob.png
│   └── curtain-bangs.png
├── heart/
│   ├── chin-length-bob.png
│   ├── side-part-waves.png
│   └── textured-lob.png
└── diamond/
    ├── full-fringe.png
    ├── shoulder-length.png
    └── voluminous-curls.png
```

## Image Requirements

- **Format**: PNG with transparency
- **Size**: 512x512px minimum
- **Quality**: High resolution for scaling
- **Background**: Transparent
- **Positioning**: Centered for face alignment

## Creating Overlay Images

1. Use professional hairstyle photos
2. Remove background (use tools like Remove.bg)
3. Resize to consistent dimensions
4. Optimize for web (use tools like TinyPNG)
5. Test alignment with face landmarks

## AI Generation Alternative

For higher quality results, you can use AI image generation:

```javascript
const generateHairstyle = async (originalImage, style) => {
  const prompt = `
    Generate a realistic hairstyle makeover photo.
    Keep the person's face identity SAME.
    Apply hairstyle: ${style}.
    Natural hair blending, realistic lighting, sharp details, salon quality.
    Match skin tone and face shape.
    No distortion, no extra face, no blur.
    Background clean studio. 4K.
  `
  
  // Use Stable Diffusion API or similar
  return await generateImage(originalImage, prompt)
}
```

## Usage in Application

The overlay images are automatically loaded based on face analysis results:

```typescript
const overlayPath = `/hairstyles/${faceShape}/${styleName.toLowerCase().replace(/\s+/g, '-')}.png`
```