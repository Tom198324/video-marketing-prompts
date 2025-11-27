# Video Marketing Prompts - Professional Collection

<div align="center">

[![npm version](https://img.shields.io/npm/v/@prompts-video-marketing/sdk?style=flat-square&logo=npm&color=CB3837)](https://www.npmjs.com/package/@prompts-video-marketing/sdk)
[![npm downloads](https://img.shields.io/npm/dm/@prompts-video-marketing/sdk?style=flat-square&logo=npm&color=CB3837)](https://www.npmjs.com/package/@prompts-video-marketing/sdk)
[![PyPI version](https://img.shields.io/pypi/v/prompts-video-marketing?style=flat-square&logo=pypi&color=3776AB)](https://pypi.org/project/prompts-video-marketing/)
[![PyPI downloads](https://img.shields.io/pypi/dm/prompts-video-marketing?style=flat-square&logo=pypi&color=3776AB)](https://pypi.org/project/prompts-video-marketing/)
[![Python versions](https://img.shields.io/pypi/pyversions/prompts-video-marketing?style=flat-square&logo=python&color=3776AB)](https://pypi.org/project/prompts-video-marketing/)

[![Build Status](https://img.shields.io/github/actions/workflow/status/your-org/prompts-video-marketing/ci.yml?style=flat-square&logo=github)](https://github.com/your-org/prompts-video-marketing/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/github/license/your-org/prompts-video-marketing?style=flat-square&color=green)](./LICENSE)
[![Documentation](https://img.shields.io/badge/docs-available-brightgreen?style=flat-square&logo=readthedocs)](https://your-site.manus.space/documentation)

[![Stars](https://img.shields.io/github/stars/your-org/prompts-video-marketing?style=flat-square&logo=github)](https://github.com/your-org/prompts-video-marketing/stargazers)
[![Issues](https://img.shields.io/github/issues/your-org/prompts-video-marketing?style=flat-square&logo=github)](https://github.com/your-org/prompts-video-marketing/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](https://github.com/your-org/prompts-video-marketing/pulls)

**[🇫🇷 Version française](./README.md)** | **🇬🇧 English version**

</div>

---

A complete collection of 50 professional JSON prompts to generate 20-second marketing videos with **Sora 2**, **Veo 3**, and **Runway Gen-3**.

## 🎯 Features

### 📚 Collection of 50 Professional Prompts

- **50 structured JSON prompts** ready to use
- **28 marketing categories** (Product Launch, Brand Story, Tutorial, etc.)
- **24 different cinematic styles**
- **20-second duration** optimized for social media

### 🎨 AI Variation Generator

Automatically generate prompt variations with artificial intelligence:

- **8 modifiable parameters**: character, location, cinematic style, equipment, lighting, actions, audio, technical specifications
- **Batch generation**: create 1 to 5 variations in a single request
- **Intuitive navigation**: compare variations side-by-side with the original prompt
- **Easy export**: copy or download generated prompts

### 📦 Official SDKs

Integrate the API into your applications with our official SDKs:

#### JavaScript/TypeScript SDK

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
  variations: { subject: true, location: true },
  count: 3,
});
```

**Features**:
- Complete TypeScript types
- Automatic retry logic with exponential backoff
- Error and timeout handling
- 4 methods: `generateVariation`, `getPrompts`, `getPromptById`, `getPromptsByCategory`

📖 [Complete JavaScript/TypeScript documentation](./sdk/javascript/README.md)

#### Python SDK

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
        "variations": {"subject": True, "location": True},
        "count": 3,
    })
```

**Features**:
- Complete Python type hints
- Context manager support
- Retry logic with exponential backoff
- Async examples and environment variables

📖 [Complete Python documentation](./sdk/python/README.md)

### 🔌 Integrated LLM API

Use the LLM API to generate intelligent variations:

- **AI Models**: Access to the best language models
- **Strict JSON Schema**: Guarantees validity of generated prompts
- **Multi-language**: Code examples in cURL, Python, JavaScript, Go, PHP, Ruby
- **Third-party integrations**: Use the API from any application

📖 [Complete LLM API documentation](https://your-site.manus.space/documentation)

## 🚀 Quick Start

### 1. Explore prompts

Browse the collection of 50 professional prompts organized by category:

```
https://your-site.manus.space/explorer
```

### 2. Download ZIP archive

Download the complete collection with:
- 50 individual JSON files (prompt_01.json to prompt_50.json)
- Detailed CSV index with 9 columns
- Complete README with documentation

```
https://your-site.manus.space/ → Download ZIP v4.0 (212 KB)
```

### 3. Generate variations

Use the AI generator to create custom variations:

```
https://your-site.manus.space/generator
```

## 📁 Project Structure

```
prompts-video-marketing/
├── client/                    # React frontend application
│   ├── src/
│   │   ├── pages/            # Pages (Home, Explorer, Generator, Documentation)
│   │   ├── components/       # Reusable components
│   │   └── lib/              # tRPC configuration
├── server/                    # Express + tRPC backend
│   ├── routers.ts            # tRPC procedures (prompts, generator)
│   ├── db.ts                 # Database helpers
│   └── _core/                # LLM, auth, storage
├── sdk/                       # Official SDKs
│   ├── javascript/           # npm TypeScript SDK
│   └── python/               # PyPI Python SDK
├── drizzle/                   # Database schema
└── prompts_package_v4/       # Prompts collection
    ├── prompts/              # 50 JSON files
    ├── index.csv             # Detailed index
    └── README.md             # Documentation
```

## 🛠️ Technologies Used

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS 4** for design
- **tRPC** for type-safe API
- **Wouter** for routing
- **Sonner** for notifications

### Backend
- **Express 4** with TypeScript
- **tRPC 11** for procedures
- **Drizzle ORM** for database
- **Integrated LLM API** for AI generation

### SDKs
- **TypeScript** with strict types
- **Python** with type hints
- **Automatic retry logic**
- **Complete documentation**

## 📖 Documentation

### User Guides

- [JSON Prompt Structure](https://your-site.manus.space/documentation) - Format and sections
- [Sora 2 Guide](https://your-site.manus.space/documentation) - Optimization for OpenAI Sora
- [Veo 3 Guide](https://your-site.manus.space/documentation) - Optimization for Google Veo
- [Runway Gen-3 Guide](https://your-site.manus.space/documentation) - Optimization for Runway
- [Customization](https://your-site.manus.space/documentation) - Adapt prompts

### Developer Documentation

- [LLM API](https://your-site.manus.space/documentation) - Integration and examples
- [JavaScript/TypeScript SDK](./sdk/javascript/README.md) - Installation and usage
- [Python SDK](./sdk/python/README.md) - Installation and usage
- [tRPC Endpoints](./server/routers.ts) - Backend API

## 🎨 Usage Examples

### Generate 3 variations with JavaScript

```javascript
const client = new PromptsVideoMarketingClient({
  baseURL: 'https://your-site.manus.space',
});

const result = await client.generateVariation({
  promptId: 1,
  variations: {
    subject: true,
    location: true,
    style: true,
  },
  count: 3,
});

result.variations.forEach((variation, index) => {
  console.log(`Variation ${index + 1}:`);
  console.log('Character:', variation.data.subject.identity);
  console.log('Location:', variation.data.scene.location);
  console.log('Style:', variation.data.shot.camera_movement);
});
```

### Generate variations with Python

```python
from prompts_video_marketing import PromptsVideoMarketingClient

with PromptsVideoMarketingClient(
    base_url="https://your-site.manus.space"
) as client:
    result = client.generate_variation({
        "prompt_id": 1,
        "variations": {
            "subject": True,
            "location": True,
            "style": True,
        },
        "count": 3,
    })
    
    for i, variation in enumerate(result["variations"], 1):
        print(f"Variation {i}:")
        print(f"Character: {variation['data']['subject']['identity']}")
        print(f"Location: {variation['data']['scene']['location']}")
```

## 🔐 Authentication

SDKs support API key authentication:

```typescript
// JavaScript/TypeScript
const client = new PromptsVideoMarketingClient({
  baseURL: 'https://your-site.manus.space',
  apiKey: 'your-api-key',
});
```

```python
# Python
client = PromptsVideoMarketingClient(
    base_url="https://your-site.manus.space",
    api_key="your-api-key",
)
```

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the project
2. Create a branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT

## 🆘 Support

For any questions or issues:

- 📖 Check the [complete documentation](https://your-site.manus.space/documentation)
- 💬 Open a [GitHub issue](https://github.com/your-org/prompts-video-marketing/issues)
- 📧 Contact us at contact@prompts-video-marketing.com

## 🎯 Roadmap

### Upcoming Features

- [ ] **Webhooks for asynchronous generation** - Receive notifications when generation is complete
- [ ] **API key authentication system** - Manage your API keys with quotas and statistics
- [ ] **Variation history** - Save and review your generated variations
- [ ] **Favorites system** - Mark your favorite prompts
- [ ] **Custom export** - Create custom exports (JSON, CSV, or PDF with professional formatting)

---

**Created with ❤️ for video content creators**
