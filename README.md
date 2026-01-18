# AI HairStyle Mirror 💇‍♀️✨

A complete AI-powered hairstyle recommendation system with face analysis, built with Next.js 14, Prisma, and modern UI.

## 🎯 Features

- **Real-time Face Analysis** - Detects face shape, skin tone, and hair type
- **AI Hairstyle Recommendations** - Personalized suggestions based on facial features
- **Instant Preview Generation** - Fast overlay system + optional AI generation
- **Responsive Design** - Works on mobile, tablet, laptop, and big screens
- **Kiosk Mode** - Full-screen mode for salon displays
- **Admin Dashboard** - Analytics and user management
- **History Tracking** - Save and review past scans

## 🚀 Quick Start

### 1. Setup Project
```bash
# Clone and setup
git clone <your-repo>
cd ai-hairstyle-mirror

# Run setup script
./setup.sh
```

### 2. Environment Variables
Update `.env` with your values:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/hairstyle_mirror"
NEXTAUTH_SECRET="your-secret-key-here"
CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
JWT_SECRET="your-jwt-secret"
```

### 3. Start Development
```bash
npm run dev
```

Visit `http://localhost:3000`

## 📱 Pages & Features

### Home Page (`/`)
- Modern glassmorphism design
- Kiosk mode toggle
- Feature showcase
- Quick access to all functions

### Scan Page (`/scan`)
- Live camera preview
- Face detection overlay
- One-click capture & analysis
- Real-time instructions

### Results Page (`/result`)
- Hairstyle recommendations
- Match scores and reasons
- Download & share options
- Preview gallery

### History Page (`/history`)
- Past scan results
- User statistics
- Quick result access

### Admin Dashboard (`/admin`)
- Login: `admin@hairstyle.com` / `admin123`
- User analytics
- Popular hairstyles
- Recent activity

## 🏗️ Architecture

```
├── app/                    # Next.js 14 App Router
│   ├── api/               # API Routes
│   │   ├── scan/          # Face analysis endpoint
│   │   ├── results/       # Results fetching
│   │   ├── history/       # Scan history
│   │   └── admin/         # Admin authentication
│   ├── scan/              # Camera & scanning
│   ├── result/            # Results display
│   ├── history/           # History viewer
│   └── admin/             # Admin dashboard
├── components/            # Reusable components
├── lib/                   # Utilities
│   ├── prisma.ts         # Database client
│   ├── face-analyzer.ts  # AI analysis logic
│   ├── cloudinary.ts     # Image upload
│   └── auth.ts           # JWT authentication
├── prisma/               # Database schema
└── public/               # Static assets
```

## 🎨 UI/UX Design

### Design System
- **Glassmorphism** - Frosted glass effects
- **Neon Accents** - Cyan/purple/pink highlights
- **Smooth Animations** - Framer Motion powered
- **Responsive Layout** - Mobile-first approach

### Color Palette
```css
--neon-blue: #00f5ff
--neon-purple: #bf00ff
--neon-pink: #ff0080
--neon-green: #00ff88
```

### Components
- Glass cards with backdrop blur
- Neon borders and glows
- Animated buttons and transitions
- Responsive grid layouts

## 🤖 AI Implementation

### Face Analysis Pipeline
1. **Camera Capture** - High-quality image capture
2. **Face Detection** - MediaPipe/OpenCV integration
3. **Feature Extraction** - Face shape, skin tone analysis
4. **Recommendation Engine** - Rule-based + ML scoring
5. **Preview Generation** - Overlay system + AI options

### Hairstyle Recommendation Logic
```typescript
// Face shape detection
const faceShape = analyzeFaceShape(landmarks)

// Get recommendations based on shape
const recommendations = getRecommendations({
  faceShape,
  skinTone,
  hairType,
  gender
})

// Score and rank suggestions
const rankedResults = rankByCompatibility(recommendations)
```

### Preview Generation Options

**Option A: Fast Overlay (Default)**
- Pre-made hairstyle PNGs
- Landmark-based positioning
- Instant results (<1 second)

**Option B: AI Generation (Premium)**
- Stable Diffusion API
- High-quality realistic results
- 5-15 seconds processing

## 📊 Database Schema

```sql
-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT,
  gender TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Scans table
CREATE TABLE scans (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  face_shape TEXT NOT NULL,
  skin_tone TEXT NOT NULL,
  hair_type TEXT NOT NULL,
  beard_style TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Results table
CREATE TABLE results (
  id TEXT PRIMARY KEY,
  scan_id TEXT REFERENCES scans(id),
  hairstyle_name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  overlay_url TEXT,
  score FLOAT NOT NULL,
  reason TEXT NOT NULL
);

-- Admins table
CREATE TABLE admins (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);
```

## 🚀 Deployment

### Vercel (Frontend + API)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

### Railway (Database)
1. Create PostgreSQL database on Railway
2. Copy connection string to `DATABASE_URL`
3. Run `npx prisma db push` to create tables

### Cloudinary (Image Storage)
1. Create Cloudinary account
2. Get API credentials
3. Add to environment variables

### Performance Optimizations

**Frontend**
- Image optimization with Next.js
- Lazy loading components
- Code splitting by routes
- Service worker caching

**Backend**
- Database query optimization
- Image compression
- CDN for static assets
- API response caching

**AI Processing**
- WebAssembly for face detection
- Worker threads for heavy processing
- Progressive image loading
- Batch processing for multiple faces

## 📱 Kiosk Mode Setup

### Big Screen Display
1. Open application in browser
2. Click "Kiosk Mode" button
3. Application enters fullscreen
4. Optimized UI for large displays

### Hardware Requirements
- **Camera**: 1080p webcam or better
- **Display**: 32"+ touchscreen recommended
- **Processing**: Modern CPU for real-time analysis
- **Internet**: Stable connection for AI APIs

### Kiosk Configuration
```javascript
// Auto-start kiosk mode
const isKioskDevice = window.screen.width > 1920
if (isKioskDevice) {
  document.documentElement.requestFullscreen()
}

// Prevent right-click and shortcuts
document.addEventListener('contextmenu', e => e.preventDefault())
document.addEventListener('keydown', e => {
  if (e.key === 'F12' || (e.ctrlKey && e.shiftKey)) {
    e.preventDefault()
  }
})
```

## 🔒 Security & Privacy

### Data Protection
- Images processed locally when possible
- Automatic image deletion after 24 hours
- No facial data stored permanently
- GDPR compliant data handling

### Authentication
- JWT-based admin authentication
- Bcrypt password hashing
- Rate limiting on API endpoints
- Input validation and sanitization

### Privacy Features
```typescript
// Auto-delete old scans
const cleanupOldScans = async () => {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  
  await prisma.scan.deleteMany({
    where: {
      timestamp: { lt: oneDayAgo }
    }
  })
}
```

## 🎯 Performance Benchmarks

- **Face Detection**: <500ms
- **Analysis & Recommendations**: <2s
- **Overlay Generation**: <1s
- **AI Generation**: 5-15s
- **Page Load**: <2s
- **Mobile Performance**: 90+ Lighthouse score

## 🛠️ Development

### Local Development
```bash
# Start development server
npm run dev

# Database operations
npm run db:push      # Push schema changes
npm run db:generate  # Generate Prisma client
npm run db:studio    # Open Prisma Studio

# Linting and formatting
npm run lint
```

### Testing
```bash
# Run tests
npm test

# E2E testing
npm run test:e2e
```

## 📈 Scaling Considerations

### High Traffic Optimization
- Redis caching for frequent queries
- CDN for global image delivery
- Load balancing for API endpoints
- Database read replicas

### Multi-tenant Support
- Salon-specific branding
- Custom hairstyle libraries
- Usage analytics per salon
- White-label deployment options

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: Check this README
- **Issues**: GitHub Issues
- **Email**: support@hairstylemirror.com

---

**Built with ❤️ for modern salons and beauty professionals**# Facedetectionhairstyle
# Facedetectionhairstyle
# Facedetectionhairstyle
# Facedetectionhairstyle
# Facedetectionhairstyle
# Ai-hairstyle-system
deploy test
