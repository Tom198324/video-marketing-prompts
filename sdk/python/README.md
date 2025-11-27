# Video Marketing Prompts SDK (Python)

Official SDK for the Video Marketing Prompts API. Automatically generate video prompt variations for Sora 2, Veo 3, and Runway Gen-3 using artificial intelligence.

## 📦 Installation

```bash
pip install prompts-video-marketing
```

## 🚀 Quick Start

```python
from prompts_video_marketing import PromptsVideoMarketingClient

# Create a client instance
client = PromptsVideoMarketingClient(
    base_url="https://your-site.manus.space",
    api_key="your-api-key",  # Optional
    timeout=30,  # 30 seconds (default)
    retries=3,  # Number of attempts (default)
)

# Generate variations of a prompt
result = client.generate_variation({
    "prompt_id": 1,
    "variations": {
        "subject": True,
        "location": True,
        "style": True,
    },
    "count": 3,  # Generate 3 variations
})

print(f"Generated {len(result['variations'])} variations!")
for i, variation in enumerate(result["variations"], 1):
    print(f"Variation {i}:", variation["data"])
```

## 📚 Documentation

### Client Configuration

```python
client = PromptsVideoMarketingClient(
    base_url="https://your-site.manus.space",  # Base URL of the API
    api_key="your-api-key",  # API Key (optional)
    timeout=30,  # Timeout in seconds (default: 30)
    retries=3,  # Number of attempts (default: 3)
)
```

### Available Methods

#### `generate_variation(options)`

Generates variations of an existing prompt.

```python
result = client.generate_variation({
    "prompt_id": 1,
    "variations": {
        "subject": True,      # Modify the character
        "location": True,     # Modify the location
        "style": True,        # Modify the cinematic style
        "equipment": False,   # Do not modify the equipment
        "lighting": False,    # Do not modify the lighting
        "action": False,      # Do not modify the actions
        "audio": False,       # Do not modify the audio
        "technical": False,   # Do not modify the technical specs
    },
    "count": 3,  # Generate 3 variations (1-5)
})
```

#### `get_prompts()`

Retrieves the list of all available prompts.

```python
result = client.get_prompts()
print(f"{result['total']} prompts available")
for prompt in result["prompts"]:
    print(f"- {prompt['title']} ({prompt['category']})")
```

#### `get_prompt_by_id(id)`

Retrieves a specific prompt by its ID.

```python
prompt = client.get_prompt_by_id(1)
print(prompt["title"])
print(json.loads(prompt["prompt_json"]))
```

#### `get_prompts_by_category(category)`

Searches prompts by category.

```python
result = client.get_prompts_by_category("Product Launch")
print(f"{len(result['prompts'])} prompts in this category")
```

## 🔄 Automatic Error Handling

The SDK includes automatic error handling with **retry logic**:

- **Exponential backoff**: Increasing delay between attempts (2s, 4s, 8s...)
- **Automatic retry**: On timeout, network errors, or 5xx server errors
- **Configurable timeout**: Set your own timeout

```python
from prompts_video_marketing import APIError

try:
    result = client.generate_variation({
        "prompt_id": 1,
        "variations": {"subject": True},
    })
except APIError as e:
    print(f"Error after 3 attempts: [{e.code}] {e.message}")
except Exception as e:
    print(f"Network error: {e}")
```

## 📝 Types and Type Hints

The SDK is fully typed with Python type hints:

```python
from prompts_video_marketing import (
    VariationParams,
    GenerateVariationOptions,
    PromptData,
    GeneratedVariation,
    GenerateVariationResult,
    Prompt,
    PromptsListResult,
    APIError,
)
```

## 🌐 Usage Examples

### Context Manager

```python
with PromptsVideoMarketingClient(
    base_url="https://your-site.manus.space"
) as client:
    result = client.generate_variation({
        "prompt_id": 1,
        "variations": {"subject": True, "location": True},
        "count": 2,
    })
    print(result)
# The session is automatically closed
```

### Batch Generation

```python
# Generate 5 variations in a single request
result = client.generate_variation({
    "prompt_id": 1,
    "variations": {
        "subject": True,
        "location": True,
        "style": True,
    },
    "count": 5,
})

# Iterate over all variations
for i, variation in enumerate(result["variations"], 1):
    data = variation["data"]
    print(f"\n=== Variation {i} ===")
    print(f"Character: {data['subject']['identity']}")
    print(f"Location: {data['scene']['location']}")
    print(f"Style: {data['shot']['camera_movement']}")
```

### Asynchronous Script

```python
import asyncio
from concurrent.futures import ThreadPoolExecutor

async def generate_multiple_variations():
    """Generates variations for multiple prompts in parallel."""
    client = PromptsVideoMarketingClient(
        base_url="https://your-site.manus.space"
    )
    
    prompt_ids = [1, 2, 3, 4, 5]
    
    with ThreadPoolExecutor(max_workers=3) as executor:
        loop = asyncio.get_event_loop()
        tasks = [
            loop.run_in_executor(
                executor,
                client.generate_variation,
                {"prompt_id": pid, "variations": {"subject": True}, "count": 2}
            )
            for pid in prompt_ids
        ]
        results = await asyncio.gather(*tasks)
    
    client.close()
    return results

# Run
results = asyncio.run(generate_multiple_variations())
print(f"Generated {len(results)} batches of variations")
```

### Usage with Environment Variables

```python
import os
from prompts_video_marketing import PromptsVideoMarketingClient

client = PromptsVideoMarketingClient(
    base_url=os.getenv("PROMPTS_API_URL"),
    api_key=os.getenv("PROMPTS_API_KEY"),
)

result = client.generate_variation({
    "prompt_id": 1,
    "variations": {"subject": True},
})
```

## 🔒 Authentication

If your API requires authentication, provide your API key:

```python
client = PromptsVideoMarketingClient(
    base_url="https://your-site.manus.space",
    api_key="your-secret-api-key",
)
```

The key will be automatically added in the `Authorization: Bearer <apiKey>` header.

## 🧪 Tests

```bash
# Install development dependencies
pip install -e ".[dev]"

# Run tests
pytest

# Check types
mypy prompts_video_marketing

# Format code
black prompts_video_marketing
```

## 📄 License

MIT

## 🤝 Support

For any questions or issues, consult the full documentation at [your-site.manus.space/documentation](https://your-site.manus.space/documentation).

---