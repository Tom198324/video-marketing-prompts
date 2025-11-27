# Video Marketing Prompts SDK (JavaScript/TypeScript)

Official SDK for the Video Marketing Prompts API. Automatically generate video prompt variations for Sora 2, Veo 3, and Runway Gen-3 using artificial intelligence.

## 📦 Installation

```bash
npm install @prompts-video-marketing/sdk
# or
yarn add @prompts-video-marketing/sdk
# or
pnpm add @prompts-video-marketing/sdk
```

## 🚀 Quick Start

```typescript
import { PromptsVideoMarketingClient } from '@prompts-video-marketing/sdk';

// Create a client instance
const client = new PromptsVideoMarketingClient({
  baseURL: 'https://your-site.manus.space',
  apiKey: 'your-api-key', // Optional
  timeout: 30000, // 30 seconds (default)
  retries: 3, // Number of attempts (default)
});

// Generate variations of a prompt
const result = await client.generateVariation({
  promptId: 1,
  variations: {
    subject: true,
    location: true,
    style: true,
  },
  count: 3, // Generate 3 variations
});

console.log(`Generated ${result.variations.length} variations!`);
result.variations.forEach((variation, index) => {
  console.log(`Variation ${index + 1}:`, variation.data);
});
```

## 📚 Documentation

### Client Configuration

```typescript
interface SDKConfig {
  baseURL: string;        // Base URL of the API
  apiKey?: string;        // API Key (optional)
  timeout?: number;       // Timeout in ms (default: 30000)
  retries?: number;       // Number of attempts (default: 3)
}
```

### Available Methods

#### `generateVariation(options)`

Generates variations of an existing prompt.

```typescript
const result = await client.generateVariation({
  promptId: 1,
  variations: {
    subject: true,      // Modify the character
    location: true,     // Modify the location
    style: true,        // Modify the cinematic style
    equipment: false,   // Do not modify the equipment
    lighting: false,    // Do not modify the lighting
    action: false,      // Do not modify the actions
    audio: false,       // Do not modify the audio
    technical: false,   // Do not modify the technical specs
  },
  count: 3, // Generate 3 variations (1-5)
});
```

#### `getPrompts()`

Retrieves the list of all available prompts.

```typescript
const { prompts, total } = await client.getPrompts();
console.log(`${total} prompts available`);
```

#### `getPromptById(id)`

Retrieves a specific prompt by its ID.

```typescript
const prompt = await client.getPromptById(1);
console.log(prompt.title);
console.log(JSON.parse(prompt.promptJson));
```

#### `getPromptsByCategory(category)`

Searches prompts by category.

```typescript
const { prompts } = await client.getPromptsByCategory('Product Launch');
console.log(`${prompts.length} prompts in this category`);
```

## 🔄 Automatic Error Handling

The SDK includes automatic error handling with **retry logic**:

- **Exponential backoff**: Increasing delay between attempts (1s, 2s, 4s...)
- **Automatic retry**: On timeout, network errors, or 5xx server errors
- **Configurable timeout**: Set your own timeout

```typescript
try {
  const result = await client.generateVariation({
    promptId: 1,
    variations: { subject: true },
  });
} catch (error) {
  console.error('Error after 3 attempts:', error.message);
}
```

## 📝 TypeScript Types

The SDK is fully typed with TypeScript. All types are exported:

```typescript
import type {
  SDKConfig,
  VariationParams,
  GenerateVariationOptions,
  PromptData,
  GeneratedVariation,
  GenerateVariationResult,
  Prompt,
  PromptsListResult,
  APIError,
} from '@prompts-video-marketing/sdk';
```

## 🌐 Usage Examples

### Node.js (CommonJS)

```javascript
const { PromptsVideoMarketingClient } = require('@prompts-video-marketing/sdk');

const client = new PromptsVideoMarketingClient({
  baseURL: 'https://your-site.manus.space',
});

async function main() {
  const result = await client.generateVariation({
    promptId: 1,
    variations: { subject: true, location: true },
    count: 2,
  });
  
  console.log(result);
}

main();
```

### TypeScript (ESM)

```typescript
import { PromptsVideoMarketingClient } from '@prompts-video-marketing/sdk';

const client = new PromptsVideoMarketingClient({
  baseURL: 'https://your-site.manus.space',
  apiKey: process.env.API_KEY,
});

const result = await client.generateVariation({
  promptId: 1,
  variations: { subject: true },
});
```

### Batch Generation

```typescript
// Generate 5 variations in a single request
const result = await client.generateVariation({
  promptId: 1,
  variations: {
    subject: true,
    location: true,
    style: true,
  },
  count: 5,
});

// Iterate through all variations
result.variations.forEach((variation, index) => {
  console.log(`\n=== Variation ${index + 1} ===`);
  console.log('Character:', variation.data.subject.identity);
  console.log('Location:', variation.data.scene.location);
  console.log('Style:', variation.data.shot.camera_movement);
});
```

## 🔒 Authentication

If your API requires authentication, provide your API key:

```typescript
const client = new PromptsVideoMarketingClient({
  baseURL: 'https://your-site.manus.space',
  apiKey: 'your-secret-api-key',
});
```

The key will be automatically added in the header `Authorization: Bearer <apiKey>`.

## 📄 License

MIT

## 🤝 Support

For any questions or issues, consult the full documentation at [your-site.manus.space/documentation](https://your-site.manus.space/documentation).

---