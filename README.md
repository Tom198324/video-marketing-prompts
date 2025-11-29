# 🎬 Video Marketing Prompts

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/Tom198324/video-marketing-prompts?style=social)](https://github.com/Tom198324/video-marketing-prompts/stargazers)
[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://videomarkup-qhqquten.manus.space)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

> **Professional collection of 50 video marketing prompts for Sora 2, Veo 3, and Runway Gen-3 with AI-powered customizer and validation tools**

[🚀 Live Demo](https://videomarkup-qhqquten.manus.space) | [📖 Documentation](https://videomarkup-qhqquten.manus.space/documentation) | [🎯 Templates](https://videomarkup-qhqquten.manus.space/templates)

</div>

---

## ✨ Overview

A comprehensive platform for creating, optimizing, and validating professional video marketing prompts. Built with React, TypeScript, tRPC, and powered by advanced LLM technology. Transform your video marketing with AI-generated prompts that achieve **cinematic excellence**.

### 🎯 Key Highlights

- **50 Professional Prompts**: Curated collection covering 7 industry sectors and 24 visual styles
- **AI-Powered Tools**: Customizer, Validator, and Optimizer with LLM integration
- **Quality System**: Gold/Silver/Bronze badges based on strict coherence scoring (0-10 scale)
- **Industry Templates**: 6 pre-built templates across 5 industries
- **Complete Documentation**: 7-tab LLM API guide with integration examples
- **Collaboration Features**: Share, comment, and track version history

---

## 📚 Features

### 🎨 Core Tools

#### 1. **Customizer Pro** - AI-Powered Prompt Generation
Create professional prompts with our 9-section methodology:

- **Mandatory Fields**: Prompt Name, Video Objectives (200+ chars), Tone & Atmosphere
- **Optional Sections**: Character, Location, Cinematography, Action
- **AI-Generated**: Equipment, Lighting, Audio, Technical Specifications
- **LLM Integration**: Structured JSON output following industry best practices
- **Save to Library**: Organize with folders and tags

```typescript
// Example: Generate custom prompt
const result = await trpc.customizer.generatePrompt.mutate({
  name: "Premium Coffee Launch",
  objectives: "Showcase artisan coffee beans with sensory-rich visuals...",
  tone: {
    primary: "Elegant",
    secondary: "Warm",
    moodKeywords: ["artisanal", "premium", "authentic"],
    emotionalArc: "Calm curiosity → Sensory satisfaction"
  },
  character: { age: 35, gender: "female", ethnicity: "Caucasian" },
  location: { environment: "Modern café", timeOfDay: "Morning" }
});
```

#### 2. **Validator** - Ultra-Demanding Quality Evaluation
Strict LLM-powered evaluation with automatic penalty detection:

- **8-Section Analysis**: Shot, Subject, Action, Scene, Cinematography, Audio, Visual Rules, Technical
- **Automatic Penalties**:
  - -5 pts: Generic sequences ("zoom in", "fade out")
  - -3 pts: Narrative incoherence
  - -3 pts: Vague technical terms
  - -2 pts: Missing emotional progression
  - -2 pts: Clichés and overused tropes
- **Quality Recommendations**: Excellent (9-10) / Good (7-8) / Mediocre (5-6) / Poor (<5)
- **Export Reports**: PDF and Markdown formats

#### 3. **Optimizer** - Transform Mediocre into Excellence
Improve existing prompts with AI-powered suggestions:

- **Before/After Comparison**: Visual score improvements
- **Priority Improvements**: Section-by-section recommendations
- **Average Improvement**: +70% coherence score increase
- **Success Stories**: 37 prompts optimized from 5.24/10 to 8.92/10

#### 4. **Quality Badge System**
Visual quality indicators based on coherence scores:

- 🥇 **Gold (9-10)**: Exceptional cinematic quality, zero penalties
- 🥈 **Silver (7-8)**: Professional quality, minor improvements needed
- 🥉 **Bronze (5-6)**: Acceptable quality, optimization recommended
- ⚪ **No Badge (<5)**: Requires significant improvement

### 📖 Documentation

#### **LLM API Documentation** (7 Tabs)
Complete guide for API integration:

1. **Overview**: Introduction and capabilities
2. **Authentication**: API keys setup and security
3. **Quick Start**: Complete examples for Sora 2, Veo 3, Runway Gen-3
4. **Advanced Usage**: Streaming, error handling, retry logic, batch processing
5. **Best Practices**: Prompt engineering tips and optimization
6. **API Reference**: JSON structure, parameters, response format, error codes
7. **Integration**: Node.js/TypeScript, Python, cURL, Express.js examples

#### **Tone Guide** (120+ Tones)
Comprehensive documentation across 10 categories:

- **Emotional**: Joyful, Melancholic, Nostalgic, Romantic, Suspenseful
- **Energy**: Energetic, Calm, Intense, Playful, Serene
- **Aesthetic**: Cinematic, Minimalist, Vintage, Futuristic, Elegant
- **Brand**: Aspirational, Authentic, Bold, Professional, Luxurious
- **Narrative**: Documentary, Storytelling, Testimonial, Educational
- **Visual**: Hyperrealistic, Stylized, Monochrome, Vibrant, Soft
- **Cultural**: Urban, Rural, Cosmopolitan, Traditional, Contemporary
- **Technical**: Slow-Motion, Time-Lapse, POV, Aerial, Macro
- **Seasonal**: Spring, Summer, Autumn, Winter
- **Mood**: Inspirational, Mysterious, Whimsical, Dramatic, Peaceful

### 🏭 Industry Templates

6 pre-built templates across 5 industries:

1. **E-commerce**
   - Premium Product Reveal
   - Dynamic Sale Promotion

2. **Real Estate**
   - Luxury Home Walkthrough

3. **SaaS**
   - Product Feature Showcase

4. **Restaurant**
   - Signature Dish Presentation

5. **Fashion**
   - Runway-Style Fashion Showcase

Each template includes:
- Smart placeholder extraction
- Auto-fill suggestions
- Customization dialog
- Save to library functionality

### 🎯 Prompts Library

Browse and filter 50 professional prompts:

**Filters:**
- **Industry Sector**: Consumer Electronics, Health & Beauty, Food & Beverage, Fashion & Apparel, Automotive, Fitness & Wellness, Travel & Hospitality
- **Visual Style**: 24 unique styles (Hyperrealistic Cinematic, Elegant Luxe, etc.)
- **Quality Score**: Gold (9+), Silver (7+), Bronze (5+)
- **Duration**: ≤10s, ≤15s, ≤20s, ≤30s

**Features:**
- Search by title or description
- Compare 2-3 prompts side-by-side
- View detailed specifications
- Download as JSON
- Add to favorites

### 🖼️ Visual Gallery

Explore example videos with:
- Thumbnail previews
- Dynamic filtering (sector, style)
- Duration badges
- Direct links to prompt details
- Real-time data from database

---

## 🚀 Quick Start

### Prerequisites

- Node.js 22.13.0 or higher
- pnpm package manager
- MySQL/TiDB database (or SQLite for development)

### Installation

```bash
# Clone the repository
git clone https://github.com/Tom198324/video-marketing-prompts.git
cd video-marketing-prompts

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials and API keys

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`

### Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL=mysql://user:password@host:port/database

# Authentication
JWT_SECRET=your-jwt-secret
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://login.manus.im

# LLM API
BUILT_IN_FORGE_API_KEY=your-api-key
BUILT_IN_FORGE_API_URL=https://api.manus.im/forge

# App Configuration
VITE_APP_TITLE=Video Marketing Prompts
VITE_APP_LOGO=/logo.svg
```

---

## 📖 Usage Guide

### 1. Browse Prompts Library

Navigate to **Production → Prompts Library**:

```
https://videomarkup-qhqquten.manus.space/production
```

- Filter by sector, style, quality, duration
- Click any prompt to view full details
- Compare multiple prompts side-by-side
- Download prompts as JSON

### 2. Create Custom Prompts

Use **Prompts Studio → Customizer**:

```
https://videomarkup-qhqquten.manus.space/prompts-studio
```

**Step-by-step:**
1. Enter **Prompt Name** and **Video Objectives** (minimum 200 characters)
2. Configure **Tone & Atmosphere** (mandatory):
   - Primary tone (e.g., "Elegant")
   - Secondary tone (e.g., "Warm")
   - Mood keywords (e.g., "artisanal, premium, authentic")
   - Emotional arc (e.g., "Calm curiosity → Sensory satisfaction")
3. Fill optional sections:
   - **Character**: Age, gender, ethnicity, clothing, expression
   - **Location**: Environment, time of day, weather, lighting
   - **Cinematography**: Camera angles, movements, framing
   - **Action**: Main movements, timing, tracking
4. Click **Generate with AI** to auto-fill:
   - **Equipment**: Camera system, lens, stabilization
   - **Lighting**: Setup, color temperature, intensity
   - **Audio**: Foley sounds, music, synchronization
   - **Technical**: Resolution, color space, bit depth
5. Review structured JSON output
6. **Save to My Prompts** with tags

### 3. Validate Custom Prompts

Use **Prompts Studio → Validator**:

```
https://videomarkup-qhqquten.manus.space/validator
```

**Process:**
1. Paste your JSON prompt
2. Click **Validate Prompt**
3. Review detailed analysis:
   - Overall quality score (0-10)
   - 8-section breakdown with strengths/weaknesses
   - Automatic penalties detected
   - Priority improvements
4. Get recommendation:
   - **Excellent (9-10)**: Ready for production
   - **Good (7-8)**: Minor tweaks recommended
   - **Mediocre (5-6)**: Optimization needed
   - **Poor (<5)**: Major improvements required
5. Export report as PDF or Markdown

### 4. Optimize Existing Prompts

Use **Prompts Studio → Optimizer**:

```
https://videomarkup-qhqquten.manus.space/optimize
```

**Workflow:**
1. Select a prompt from dropdown (or paste custom JSON)
2. Click **Analyze Prompt**
3. View coherence evaluation:
   - Current score and issues
   - Section-by-section analysis
   - Priority improvements
4. Click **Generate Optimized Version**
5. Compare before/after scores
6. Download optimized prompt

### 5. Use Industry Templates

Navigate to **Templates**:

```
https://videomarkup-qhqquten.manus.space/templates
```

**Steps:**
1. Filter by industry (All / E-commerce / Real Estate / SaaS / Restaurant / Fashion)
2. Click **Use This Template** on desired template
3. Customize placeholders in dialog:
   - Product name
   - Key features
   - Target audience
   - Brand values
4. Auto-fill suggestions provided
5. Save to your library

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 19 with TypeScript
- Tailwind CSS 4 (OKLCH color format)
- Wouter (routing)
- Lucide Icons
- shadcn/ui components
- Sonner (toast notifications)

**Backend:**
- Express 4
- tRPC 11 (end-to-end type safety)
- Drizzle ORM
- MySQL/TiDB database
- Superjson (Date serialization)

**AI Integration:**
- LLM API for prompt generation
- Structured JSON output with json_schema
- Ultra-demanding evaluation system
- Automatic penalty detection

### Project Structure

```
video-marketing-prompts/
├── client/
│   ├── src/
│   │   ├── pages/                    # Page components
│   │   │   ├── Home.tsx              # Landing page
│   │   │   ├── Production.tsx        # Main production page (tabs)
│   │   │   ├── Gallery.tsx           # Visual gallery
│   │   │   ├── PromptsStudio.tsx     # Prompts Studio (tabs)
│   │   │   ├── Customizer.tsx        # AI-powered customizer
│   │   │   ├── Validator.tsx         # Strict validation
│   │   │   ├── Optimize.tsx          # Prompt optimizer
│   │   │   ├── ToneExamples.tsx      # Tone comparisons
│   │   │   ├── Templates.tsx         # Industry templates
│   │   │   ├── MyPrompts.tsx         # User library
│   │   │   ├── PromptDetail.tsx      # Detailed prompt view
│   │   │   └── Documentation.tsx     # Complete docs
│   │   ├── components/               # Reusable UI components
│   │   │   ├── Header.tsx            # Global navigation
│   │   │   ├── ToneSelector.tsx      # Tone selection UI
│   │   │   ├── LLMAPIDocumentation.tsx
│   │   │   └── ui/                   # shadcn/ui components
│   │   └── lib/
│   │       └── trpc.ts               # tRPC client
├── server/
│   ├── routers.ts                    # tRPC procedures
│   ├── db.ts                         # Database queries
│   ├── _core/                        # Framework code
│   │   ├── llm.ts                    # LLM integration
│   │   ├── context.ts                # tRPC context
│   │   └── index.ts                  # Server entry
│   └── *.test.ts                     # Unit tests
├── drizzle/
│   └── schema.ts                     # Database schema
├── shared/
│   └── promptStructure.ts            # Tone definitions
└── README.md                         # This file
```

---

## 🎨 Prompt Methodology

### 9-Section Structure

Every professional prompt follows this structure:

#### 1. **Tone & Atmosphere** (Mandatory)
- Primary tone (e.g., "Elegant")
- Secondary tone (e.g., "Warm")
- Mood keywords (comma-separated)
- Emotional arc (progression throughout video)
- Visual style reference (optional)

#### 2. **Character** (Optional)
- Age, gender, ethnicity
- Clothing and style
- Expression and emotion
- Activity and posture

#### 3. **Location** (Optional)
- Environment type
- Time of day
- Weather conditions
- Lighting conditions
- Atmosphere description

#### 4. **Cinematography** (Optional)
- Camera angles
- Camera movements
- Framing and composition
- Shot types

#### 5. **Equipment** (AI-Generated)
- Camera system
- Lens specifications
- Stabilization equipment
- Accessories

#### 6. **Lighting** (AI-Generated)
- Lighting setup
- Color temperature
- Intensity and shadows
- Light direction

#### 7. **Action** (Optional)
- Main movements
- Timing and pacing
- Camera tracking
- Subject interactions

#### 8. **Audio** (AI-Generated)
- Foley sounds
- Music style
- Audio synchronization
- Ambient sounds

#### 9. **Technical Specifications** (AI-Generated)
- Resolution (4K, 8K)
- Color space (Rec. 2020, DCI-P3)
- Bit depth (10-bit, 12-bit)
- Frame rate (24fps, 30fps, 60fps)
- Duration

### Quality Scoring System

Prompts are evaluated on a **0-10 scale** using ultra-demanding criteria:

**Score Ranges:**
- **9-10 (Gold)**: Exceptional cinematic quality, zero penalties, world-class execution
- **7-8 (Silver)**: Professional quality, minor improvements needed, strong foundation
- **5-6 (Bronze)**: Acceptable quality, significant improvements recommended
- **<5 (No Badge)**: Requires major optimization, multiple issues detected

**Evaluation Criteria (8 Sections):**
1. **Shot** (12.5%): Camera system, lens, composition, movement precision
2. **Subject** (12.5%): Identity clarity, appearance detail, expression authenticity
3. **Action** (12.5%): Timing precision, movement specificity, tracking quality
4. **Scene** (12.5%): Location detail, atmosphere richness, environmental coherence
5. **Cinematography** (12.5%): Lighting sophistication, depth of field, visual hierarchy
6. **Audio** (12.5%): Foley specificity, music integration, synchronization
7. **Visual Rules** (12.5%): Realism, continuity, frame purity, quality standards
8. **Technical Specifications** (12.5%): Resolution, color space, bit depth, format

**Automatic Penalties:**
- **-5 points**: Generic sequences ("zoom in", "fade out", "slow motion")
- **-3 points**: Narrative incoherence (disconnected actions, no progression)
- **-3 points**: Vague technical terms ("good lighting", "nice colors")
- **-2 points**: Missing emotional progression (flat emotional arc)
- **-2 points**: Clichés and overused tropes
- **-2 points**: Imprecise timing (no specific durations)

---

## 📊 Database Schema

### Core Tables

#### **prompts** (50 professional prompts)
```sql
CREATE TABLE prompts (
  id INTEGER PRIMARY KEY,
  promptNumber INTEGER UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  promptJson TEXT NOT NULL,  -- 9-section structure
  category TEXT,
  industrySector TEXT,
  visualStyle TEXT,
  durationSeconds INTEGER,
  qualityScore REAL,         -- 0-10 scale
  createdAt INTEGER,
  updatedAt INTEGER
);
```

#### **userPrompts** (User-created prompts)
```sql
CREATE TABLE userPrompts (
  id INTEGER PRIMARY KEY,
  userId TEXT NOT NULL,
  title TEXT NOT NULL,
  promptJson TEXT NOT NULL,
  folderId INTEGER,
  tags TEXT,                 -- JSON array
  qualityScore REAL,
  createdAt INTEGER,
  updatedAt INTEGER
);
```

#### **templates** (Industry templates)
```sql
CREATE TABLE templates (
  id INTEGER PRIMARY KEY,
  industry TEXT NOT NULL,
  useCase TEXT NOT NULL,
  templateJson TEXT NOT NULL,
  previewImage TEXT,
  createdAt INTEGER
);
```

#### **Collaboration Tables**

**promptShares** (Sharing permissions)
```sql
CREATE TABLE promptShares (
  id INTEGER PRIMARY KEY,
  promptId INTEGER NOT NULL,
  sharedWithUserId TEXT NOT NULL,
  permission TEXT NOT NULL,  -- 'view' | 'edit'
  sharedAt INTEGER
);
```

**promptComments** (User comments)
```sql
CREATE TABLE promptComments (
  id INTEGER PRIMARY KEY,
  promptId INTEGER NOT NULL,
  userId TEXT NOT NULL,
  commentText TEXT NOT NULL,
  createdAt INTEGER
);
```

**promptVersions** (Revision history)
```sql
CREATE TABLE promptVersions (
  id INTEGER PRIMARY KEY,
  promptId INTEGER NOT NULL,
  versionNumber INTEGER NOT NULL,
  promptJson TEXT NOT NULL,
  createdBy TEXT NOT NULL,
  createdAt INTEGER
);
```

---

## 🔧 API Reference

### tRPC Procedures

#### **Prompts**

```typescript
// Get all 50 professional prompts
prompts.list(): Promise<Prompt[]>

// Get specific prompt by number
prompts.getByNumber(promptNumber: number): Promise<Prompt>

// Search and filter prompts
prompts.search({
  query?: string,
  sector?: string,
  style?: string,
  minQualityScore?: number,
  maxDuration?: number
}): Promise<Prompt[]>

// Compare multiple prompts
prompts.getMultiple(promptNumbers: number[]): Promise<Prompt[]>
```

#### **Customizer**

```typescript
// Generate custom prompt with LLM
customizer.generatePrompt({
  name: string,
  objectives: string,  // min 200 chars
  tone: {
    primary: string,
    secondary?: string,
    moodKeywords: string,
    emotionalArc: string,
    visualStyleReference?: string
  },
  character?: {
    age: number,
    gender: string,
    ethnicity: string,
    clothing?: string,
    expression?: string
  },
  location?: {
    environment: string,
    timeOfDay: string,
    weather?: string,
    lighting?: string
  },
  cinematography?: {
    cameraAngle: string,
    cameraMovement: string,
    framing: string
  },
  action?: {
    mainMovement: string,
    timing: string,
    tracking: string
  }
}): Promise<{
  promptJson: string,
  sections: {
    tone: object,
    character: object,
    location: object,
    cinematography: object,
    equipment: object,    // AI-generated
    lighting: object,     // AI-generated
    action: object,
    audio: object,        // AI-generated
    technical: object     // AI-generated
  }
}>
```

#### **Validator**

```typescript
// Validate custom prompt with strict evaluation
validator.validateCustomPrompt({
  promptJson: string
}): Promise<{
  qualityScore: number,  // 0-10
  recommendation: "Excellent" | "Good" | "Mediocre" | "Poor",
  penalties: Array<{
    type: string,
    points: number,
    reason: string
  }>,
  analysis: {
    shot: { score: number, strengths: string[], weaknesses: string[] },
    subject: { score: number, strengths: string[], weaknesses: string[] },
    action: { score: number, strengths: string[], weaknesses: string[] },
    scene: { score: number, strengths: string[], weaknesses: string[] },
    cinematography: { score: number, strengths: string[], weaknesses: string[] },
    audio: { score: number, strengths: string[], weaknesses: string[] },
    visualRules: { score: number, strengths: string[], weaknesses: string[] },
    technical: { score: number, strengths: string[], weaknesses: string[] }
  },
  improvements: string[]
}>

// Batch validation
validator.validateBatchPrompts({
  prompts: Array<{ id: string, promptJson: string }>
}): Promise<{
  results: Array<ValidationResult>,
  summary: {
    totalPrompts: number,
    averageScore: number,
    excellentCount: number,
    goodCount: number,
    mediocreCount: number,
    poorCount: number
  }
}>
```

#### **My Prompts**

```typescript
// Save prompt to user library
myPrompts.saveFromCustomizer({
  title: string,
  promptJson: string,
  tags: string[],
  folderId?: number
}): Promise<{ id: number }>

// Get user's prompts
myPrompts.getUserPrompts(): Promise<UserPrompt[]>

// Update prompt
myPrompts.updatePrompt({
  id: number,
  title?: string,
  tags?: string[],
  folderId?: number
}): Promise<{ success: boolean }>

// Delete prompt
myPrompts.deletePrompt({ id: number }): Promise<{ success: boolean }>

// Share prompt
myPrompts.sharePrompt({
  promptId: number,
  sharedWithEmail: string,
  permission: "view" | "edit"
}): Promise<{ success: boolean }>

// Add comment
myPrompts.addComment({
  promptId: number,
  commentText: string
}): Promise<{ id: number }>

// Get version history
myPrompts.getVersions({ promptId: number }): Promise<PromptVersion[]>
```

#### **Templates**

```typescript
// Get all templates
templates.list(): Promise<Template[]>

// Get templates by industry
templates.getByIndustry({
  industry: "E-commerce" | "Real Estate" | "SaaS" | "Restaurant" | "Fashion"
}): Promise<Template[]>

// Get specific template
templates.getById({ id: number }): Promise<Template>
```

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test gallery.test.ts

# Watch mode
pnpm test --watch

# Coverage report
pnpm test --coverage
```

### Test Coverage

**Current Test Suite: 51+ Unit Tests**

- **Gallery Data Integration** (19 tests)
  - Real database query verification
  - Description extraction logic
  - Loading and empty states
  - Filtering logic (sector, style, combined)

- **Customizer LLM Generation** (14 tests)
  - Prompt generation workflow
  - Validation of mandatory fields
  - LLM integration
  - Save to library functionality

- **Validator Evaluation** (4 tests)
  - Strict evaluation system
  - Penalty detection
  - Quality score calculation
  - Recommendation logic

- **Tone Data Structure** (14 tests)
  - Tone definitions
  - Category organization
  - Validation rules
  - Integration with customizer

**Test Results:**
```
✓ server/gallery.test.ts (19 tests) 11ms
✓ server/customizer.test.ts (14 tests) 23ms
✓ server/validator.test.ts (4 tests) 8ms
✓ server/tone.test.ts (14 tests) 6ms

Test Files  4 passed (4)
Tests  51 passed (51)
Duration  348ms
```

---

## 🚢 Deployment

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Docker Deployment

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
```

### Environment Configuration

Create `.env.production`:

```env
NODE_ENV=production
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=your-production-secret
BUILT_IN_FORGE_API_KEY=your-production-api-key
VITE_APP_TITLE=Video Marketing Prompts
```

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Tom198324

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

### Development Workflow

1. **Fork the repository**
   ```bash
   gh repo fork Tom198324/video-marketing-prompts
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow TypeScript best practices
   - Add unit tests for new features
   - Update documentation

4. **Run tests**
   ```bash
   pnpm test
   pnpm typecheck
   ```

5. **Commit your changes**
   ```bash
   git commit -m 'feat: Add amazing feature'
   ```

6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**
   - Describe your changes
   - Link related issues
   - Wait for review

### Code Style

- Use TypeScript strict mode
- Follow ESLint configuration
- Use Prettier for formatting
- Write descriptive commit messages (Conventional Commits)

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

---

## 📧 Contact & Support

### Get Help

- 📖 **Documentation**: [https://videomarkup-qhqquten.manus.space/documentation](https://videomarkup-qhqquten.manus.space/documentation)
- 💬 **GitHub Issues**: [https://github.com/Tom198324/video-marketing-prompts/issues](https://github.com/Tom198324/video-marketing-prompts/issues)
- 🐛 **Bug Reports**: Use GitHub Issues with `bug` label
- 💡 **Feature Requests**: Use GitHub Issues with `enhancement` label

### Connect

- **GitHub**: [@Tom198324](https://github.com/Tom198324)
- **Project**: [video-marketing-prompts](https://github.com/Tom198324/video-marketing-prompts)
- **Live Demo**: [https://videomarkup-qhqquten.manus.space](https://videomarkup-qhqquten.manus.space)

---

## 🙏 Acknowledgments

This project was built with amazing open-source tools and services:

- **[Manus](https://manus.im)** - Platform for building and deploying web applications
- **[React](https://react.dev)** - UI library
- **[TypeScript](https://www.typescriptlang.org)** - Type-safe JavaScript
- **[tRPC](https://trpc.io)** - End-to-end type safety
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com)** - Beautiful UI components
- **[Lucide](https://lucide.dev)** - Icon library
- **[Drizzle ORM](https://orm.drizzle.team)** - TypeScript ORM
- **[Vitest](https://vitest.dev)** - Unit testing framework

Special thanks to the video AI community for inspiration and feedback.

---

## 📈 Roadmap

### 🚀 Upcoming Features

#### Q1 2025
- [ ] **Video Generation Integration**
  - Sora 2 API integration
  - Veo 3 API integration
  - Runway Gen-3 API integration
  - Real-time generation status tracking

- [ ] **Advanced Collaboration**
  - Real-time co-editing
  - Team workspaces
  - Role-based permissions
  - Activity feed

#### Q2 2025
- [ ] **Analytics Dashboard**
  - Prompt performance metrics
  - Quality score trends
  - Usage statistics
  - Export analytics reports

- [ ] **Mobile App**
  - React Native iOS app
  - React Native Android app
  - Offline mode
  - Push notifications

#### Q3 2025
- [ ] **API Enhancements**
  - Rate limiting and quotas
  - Webhook support for async generation
  - API key management dashboard
  - Usage billing integration

- [ ] **Multi-Language Support**
  - French localization
  - Spanish localization
  - German localization
  - Chinese localization

#### Q4 2025
- [ ] **Enterprise Features**
  - SSO authentication
  - Custom branding
  - Dedicated support
  - SLA guarantees

### 💡 Feature Ideas

Vote for features you'd like to see:
- [ ] AI-powered video editing suggestions
- [ ] Prompt marketplace (buy/sell templates)
- [ ] Integration with video editing tools (Premiere Pro, Final Cut)
- [ ] Voice-to-prompt conversion
- [ ] Image-to-prompt analysis
- [ ] Automated A/B testing for prompts
- [ ] Custom tone creation tool
- [ ] Prompt performance prediction

**Submit your ideas**: [GitHub Discussions](https://github.com/Tom198324/video-marketing-prompts/discussions)

---

## 📊 Project Stats

<div align="center">

![GitHub repo size](https://img.shields.io/github/repo-size/Tom198324/video-marketing-prompts)
![GitHub code size](https://img.shields.io/github/languages/code-size/Tom198324/video-marketing-prompts)
![GitHub last commit](https://img.shields.io/github/last-commit/Tom198324/video-marketing-prompts)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/Tom198324/video-marketing-prompts)

</div>

**Project Metrics:**
- **50 Professional Prompts**: Covering 7 industries and 24 styles
- **120+ Tones**: Organized in 10 categories
- **6 Industry Templates**: Pre-built for common use cases
- **9-Section Methodology**: Comprehensive prompt structure
- **51+ Unit Tests**: Ensuring code quality
- **7-Tab Documentation**: Complete API guide

---

## 🌟 Show Your Support

If you find this project useful, please consider:

- ⭐ **Star this repository** on GitHub
- 🐛 **Report bugs** and suggest features
- 📖 **Share** with your network
- 🤝 **Contribute** to the codebase
- 💬 **Join discussions** in GitHub Discussions

---

<div align="center">

**Built with ❤️ by [Tom198324](https://github.com/Tom198324)**

[⬆ Back to Top](#-video-marketing-prompts)

</div>
