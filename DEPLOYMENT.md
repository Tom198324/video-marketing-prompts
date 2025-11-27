# Deployment Guide - Video Marketing Prompts

This guide explains how to deploy this project in a new Manus group.

## 📦 Archive Contents

The archive `prompts-video-marketing-complete.zip` (707 KB) contains:

### Source Code
- `client/` - React frontend application (TypeScript + Tailwind CSS 4)
- `server/` - Express + tRPC backend (TypeScript)
- `drizzle/` - Database schema and migrations
- `shared/` - Shared types and constants

### Official SDKs
- `sdk/javascript/` - npm TypeScript SDK
- `sdk/python/` - PyPI Python SDK

### Documentation
- `README.md` - Complete French documentation
- `README.en.md` - Complete English documentation
- `DEPLOYMENT.md` - This file (deployment guide)
- `todo.md` - Feature development history

### Prompts Collection
- `prompts_package_v4/` - 50 JSON prompts + CSV index + README
- `client/public/prompts_enriched_v4.zip` - Downloadable prompts archive

### Configuration
- `package.json` - npm dependencies
- `pnpm-lock.yaml` - pnpm lock file
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite configuration
- `drizzle.config.ts` - Drizzle ORM configuration
- `vitest.config.ts` - Test configuration

## 🚀 Deployment in a New Manus Group

### Step 1: Extract the Archive

```bash
unzip prompts-video-marketing-complete.zip -d prompts-video-marketing
cd prompts-video-marketing
```

### Step 2: Install Dependencies

```bash
pnpm install
```

If pnpm is not installed:
```bash
npm install -g pnpm
```

### Step 3: Database Configuration

The database schema is defined in `drizzle/schema.ts`. It contains:

#### `prompts` Table
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `title` (VARCHAR(255), NOT NULL)
- `category` (VARCHAR(100), NOT NULL)
- `duration` (INT, NOT NULL) - Duration in seconds
- `visualStyle` (VARCHAR(100))
- `promptJson` (TEXT, NOT NULL) - Full prompt JSON
- `createdAt` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

#### `user` Table
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `openId` (VARCHAR(255), UNIQUE, NOT NULL)
- `name` (VARCHAR(255))
- `email` (VARCHAR(255))
- `avatar` (TEXT)
- `role` (ENUM: 'admin', 'user', DEFAULT 'user')
- `createdAt` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### Step 4: Push the Schema to the Database

```bash
pnpm db:push
```

This command will:
1. Generate migrations from `drizzle/schema.ts`
2. Apply migrations to the database

### Step 5: Import the Prompts

Run the import script:

```bash
node scripts/update_prompts_db.mjs
```

This script will:
1. Read the 50 JSON files from `prompts_package_v4/prompts/`
2. Insert each prompt into the `prompts` table
3. Display an import summary

### Step 6: Start the Development Server

```bash
pnpm dev
```

The server starts at `http://localhost:3000`

### Step 7: Verify the Deployment

1. **Home Page**: `http://localhost:3000/`
   - Verify that statistics are displayed (50 prompts, 28 categories, etc.)
   - Test downloading the v4.0 ZIP

2. **Explorer**: `http://localhost:3000/explorer`
   - Verify that all 50 prompts are listed
   - Test search and category filters

3. **Generator**: `http://localhost:3000/generator`
   - Select a prompt
   - Check some variation parameters
   - Generate 3 variations
   - Verify that the variations are different

4. **Documentation**: `http://localhost:3000/documentation`
   - Verify that all tabs are displayed
   - Test the "LLM API" tab

## 🔧 Environment Variables Configuration

The following environment variables are automatically injected by Manus:

### Database
- `DATABASE_URL` - MySQL/TiDB connection URL

### Authentication
- `JWT_SECRET` - Secret for signing session cookies
- `OAUTH_SERVER_URL` - Manus OAuth server URL
- `VITE_OAUTH_PORTAL_URL` - Login portal URL (frontend)
- `VITE_APP_ID` - OAuth application ID
- `OWNER_OPEN_ID` - Owner's Open ID
- `OWNER_NAME` - Owner's name

### Built-in APIs
- `BUILT_IN_FORGE_API_URL` - Manus APIs URL (LLM, storage, etc.)
- `BUILT_IN_FORGE_API_KEY` - Server-side API key
- `VITE_FRONTEND_FORGE_API_KEY` - Frontend API key
- `VITE_FRONTEND_FORGE_API_URL` - API URL for frontend

### Analytics
- `VITE_ANALYTICS_ENDPOINT` - Analytics endpoint
- `VITE_ANALYTICS_WEBSITE_ID` - Site ID for analytics
- `VITE_APP_LOGO` - Application logo URL
- `VITE_APP_TITLE` - Application title

**Note**: No manual configuration is needed; all these variables are automatically available in the Manus environment.

## 📝 Available Scripts

```bash
# Development
pnpm dev              # Start the development server

# Build
pnpm build            # Compile the project for production

# Tests
pnpm test             # Run unit tests (vitest)

# Database
pnpm db:push          # Push schema to the database
pnpm db:studio        # Open Drizzle Studio (GUI)

# Linting
pnpm lint             # Check code with ESLint
```

## 🗄️ Database Structure

### Relationship Diagram

```
┌─────────────────┐
│     prompts     │
├─────────────────┤
│ id (PK)         │
│ title           │
│ category        │
│ duration        │
│ visualStyle     │
│ promptJson      │
│ createdAt       │
└─────────────────┘

┌─────────────────┐
│      user       │
├─────────────────┤
│ id (PK)         │
│ openId (UNIQUE) │
│ name            │
│ email           │
│ avatar          │
│ role            │
│ createdAt       │
└─────────────────┘
```

### Sample Data

**`prompts` Table**:
```json
{
  "id": 1,
  "title": "Premium Smartphone Launch",
  "category": "Product Launch",
  "duration": 20,
  "visualStyle": "Medium Close-Up",
  "promptJson": "{\"subject\":{\"identity\":\"Caucasian man...\"},...}",
  "createdAt": "2024-11-27T00:00:00.000Z"
}
```

**`user` Table**:
```json
{
  "id": 1,
  "openId": "user_abc123",
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "https://...",
  "role": "admin",
  "createdAt": "2024-11-27T00:00:00.000Z"
}
```

## 🔌 API and SDK

### Available tRPC Endpoints

#### `prompts.getAll`
Fetches all prompts with pagination and filters.

```typescript
const result = await trpc.prompts.getAll.query({
  category: "Product Launch", // Optional
  search: "smartphone",        // Optional
});
```

#### `prompts.getById`
Fetches a prompt by its ID.

```typescript
const prompt = await trpc.prompts.getById.query({ id: 1 });
```

#### `prompts.getByCategory`
Fetches prompts by category.

```typescript
const prompts = await trpc.prompts.getByCategory.query({
  category: "Product Launch"
});
```

#### `generator.generateVariation`
Generates variations of a prompt.

```typescript
const result = await trpc.generator.generateVariation.mutate({
  promptId: 1,
  variations: {
    subject: true,
    location: true,
    style: true,
  },
  count: 3,
});
```

### Using the SDKs

#### JavaScript/TypeScript

```bash
npm install @prompts-video-marketing/sdk
```

```typescript
import { PromptsVideoMarketingClient } from '@prompts-video-marketing/sdk';

const client = new PromptsVideoMarketingClient({
  baseURL: 'https://your-site.manus.space',
});

const result = await client.generateVariation({
  promptId: 1,
  variations: { subject: true },
  count: 3,
});
```

#### Python

```bash
pip install prompts-video-marketing
```

```python
from prompts_video_marketing import PromptsVideoMarketingClient

with PromptsVideoMarketingClient(
    base_url="https://your-site.manus.space"
) as client:
    result = client.generate_variation({
        "prompt_id": 1,
        "variations": {"subject": True},
        "count": 3,
    })
```

## 🧪 Tests

The project includes unit tests with Vitest:

### Existing Tests

- `server/auth.logout.test.ts` - Authentication tests
- `server/generator.test.ts` - Variation generator tests

### Running Tests

```bash
pnpm test
```

### Adding New Tests

Create a `*.test.ts` file in the `server/` folder:

```typescript
import { describe, it, expect } from 'vitest';
import { appRouter } from './routers';

describe('My test', () => {
  it('should work', async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });
    
    const result = await caller.prompts.getAll();
    expect(result.prompts).toBeDefined();
  });
});
```

## 📚 Additional Documentation

- **README.md** - Complete French documentation
- **README.en.md** - Complete English documentation
- **sdk/javascript/README.md** - JavaScript SDK documentation
- **sdk/python/README.md** - Python SDK documentation
- **Website** - Interactive documentation at `/documentation`

## 🆘 Troubleshooting

### Error: "Cannot find module"

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Error: "Database connection failed"

Verify that `DATABASE_URL` is correctly configured in Manus environment variables.

### Error: "Port 3000 already in use"

```bash
# Find the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use another port
PORT=3001 pnpm dev
```

### Prompts Do Not Display

1. Verify the database is created: `pnpm db:push`
2. Import prompts: `node scripts/update_prompts_db.mjs`
3. Check the browser console for errors

## 📞 Support

For any questions or issues:

- 📖 Consult the [full documentation](https://your-site.manus.space/documentation)
- 💬 Open an issue on GitHub
- 📧 Contact contact@prompts-video-marketing.com

---

**Happy deployment! 🚀**

---