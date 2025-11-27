# Video Marketing Prompts - English Version

## Project Overview

This is the complete English version of the Video Marketing Prompts web application. All content, documentation, and user-facing text has been translated from French to English while maintaining the exact same functionality and structure.

## What Was Translated

### Frontend Components (React + TypeScript)
- **Home.tsx** - Landing page with hero section, features, and call-to-action
- **Prompts.tsx** - Browse and explore prompts page
- **PromptDetail.tsx** - Individual prompt detail page with full JSON display
- **Generator.tsx** - AI-powered variation generator interface
- **Documentation.tsx** - Complete documentation page with guides
- **Gallery.tsx** - Gallery/showcase page
- **NotFound.tsx** - 404 error page

### Backend Files (Express + tRPC)
- **routers.ts** - tRPC procedures with translated error messages and descriptions
- **db.ts** - Database helper functions with English comments

### SDK Documentation
- **sdk/javascript/README.md** - JavaScript/TypeScript SDK documentation
- **sdk/python/README.md** - Python SDK documentation

### Shared Files
- **shared/types.ts** - TypeScript type definitions with English comments
- **shared/const.ts** - Application constants with English labels

### Documentation
- **README.md** - Main project documentation (now points to English version)
- **DEPLOYMENT.md** - Deployment instructions
- **todo.md** - Project todo list
- **drizzle/schema.ts** - Database schema with English comments

## Technology Stack

### Frontend
- React 19 with TypeScript
- Tailwind CSS 4 for styling
- tRPC for type-safe API
- Wouter for routing
- Sonner for notifications

### Backend
- Express 4 with TypeScript
- tRPC 11 for procedures
- Drizzle ORM for database
- Integrated LLM API for AI generation

### SDKs
- JavaScript/TypeScript SDK with full type support
- Python SDK with type hints
- Automatic retry logic with exponential backoff

## Key Features

1. **50 Professional JSON Prompts** - Ready-to-use prompts for Sora 2, Veo 3, and Runway Gen-3
2. **AI Variation Generator** - Generate custom variations with 8 modifiable parameters
3. **Official SDKs** - JavaScript/TypeScript and Python SDKs for API integration
4. **Comprehensive Documentation** - User guides and developer documentation
5. **Export Functionality** - Download prompts as ZIP archive

## Project Structure

```
video-marketing-english/
├── client/                    # React frontend application
│   ├── src/
│   │   ├── pages/            # All pages (translated to English)
│   │   ├── components/       # Reusable UI components
│   │   └── lib/              # tRPC and utility configurations
├── server/                    # Express + tRPC backend
│   ├── routers.ts            # API procedures (translated)
│   ├── db.ts                 # Database helpers (translated)
│   └── _core/                # Core backend functionality
├── sdk/                       # Official SDKs
│   ├── javascript/           # npm TypeScript SDK (docs translated)
│   └── python/               # PyPI Python SDK (docs translated)
├── drizzle/                   # Database schema and migrations
├── shared/                    # Shared types and constants (translated)
└── README.md                 # Main documentation (English)
```

## Installation & Setup

### Prerequisites
- Node.js 22.13.0 or higher
- pnpm package manager
- MySQL database

### Installation Steps

1. Install dependencies:
```bash
cd video-marketing-english
pnpm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials and API keys
```

3. Run database migrations:
```bash
pnpm drizzle-kit push
```

4. Start development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:5000`

## Translation Quality

All translations were performed using GPT-4.1-mini with specific instructions to:
- Maintain exact code structure and functionality
- Translate all user-facing text to natural, professional English
- Preserve all technical terms, URLs, and code syntax
- Keep formatting and indentation identical
- Ensure consistency across all files

## Files Unchanged

The following files remain unchanged as they contain only code or configuration:
- All UI component files in `client/src/components/ui/`
- Configuration files (tsconfig.json, vite.config.ts, etc.)
- Package files (package.json, pnpm-lock.yaml)
- Build and test configurations

## Next Steps

1. **Review translations** - Check that all text reads naturally in English
2. **Test functionality** - Ensure all features work correctly
3. **Update branding** - Customize for your specific use case
4. **Deploy** - Follow DEPLOYMENT.md for production deployment

## Support

For questions or issues:
- Check the complete documentation in README.md
- Review the DEPLOYMENT.md guide
- Refer to SDK documentation in sdk/javascript/README.md and sdk/python/README.md

---

**Created with ❤️ for video content creators**
