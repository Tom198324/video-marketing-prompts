# Video Platform API Research

## Summary

Research conducted on Nov 28, 2025 to determine API availability for Sora, Veo, and Runway Gen-3.

## Findings

### 1. OpenAI Sora
- **Status**: ❌ No public API available
- **Access**: Limited to invite-only Sora app (sora.com) and restricted Azure OpenAI preview for enterprises
- **Details**: 
  - Sora 2 was released Sep 30, 2025
  - Can generate videos up to 1080p, 20 seconds long
  - Some third-party proxy APIs exist (CometAPI, MuAPI) but not official
  - Not recommended for integration due to lack of official API

### 2. Google Veo 3.1
- **Status**: ✅ **Public API Available** (Gemini API)
- **Access**: Available through Gemini API with API key
- **Model**: `veo-3.1-generate-preview` (and `veo-3.1-fast-generate-preview`)
- **Capabilities**:
  - Text-to-video generation
  - Image-to-video generation
  - Video extension (extend previous videos by 7 seconds)
  - Reference images (up to 3 images)
  - First/last frame interpolation
  - **Native audio generation** (dialogue, SFX, ambient noise)
- **Specifications**:
  - Resolution: 720p & 1080p
  - Duration: 4, 6, or 8 seconds
  - Aspect ratio: 16:9 or 9:16
  - Frame rate: 24fps
- **API Documentation**: https://ai.google.dev/gemini-api/docs/video
- **SDKs**: Python, JavaScript, Go, REST API
- **Pricing**: Available at https://ai.google.dev/gemini-api/docs/pricing#veo-3.1

### 3. Runway Gen-3 & Gen-4
- **Status**: ✅ **Public API Available**
- **Access**: Runway Developer account required
- **Models**: 
  - `gen4_turbo` (latest)
  - `gen4_image` (image generation)
  - Veo 3.1 (also available through Runway)
- **Capabilities**:
  - Text-to-video
  - Image-to-video
  - Text-to-image
  - Text-to-speech
- **API Documentation**: https://docs.dev.runwayml.com/
- **SDK**: @runwayml/sdk (Node.js)
- **Example**:
  ```typescript
  import RunwayML from '@runwayml/sdk';
  const client = new RunwayML();
  const task = await client.imageToVideo.create({
    model: 'gen4_turbo',
    promptImage: 'https://...',
    promptText: 'A timelapse on a sunny day',
    ratio: '1280:720',
    duration: 5,
  }).waitForTaskOutput();
  ```

## Recommendation

**Integrate with Google Veo 3.1 API** for the following reasons:

1. ✅ **Official public API** with comprehensive documentation
2. ✅ **Native audio generation** - perfect for marketing videos
3. ✅ **Multiple input modes** - text, image, video extension
4. ✅ **Reference images** - maintain brand consistency
5. ✅ **Well-documented** with Python, JavaScript, Go SDKs
6. ✅ **Competitive pricing** and rate limits
7. ✅ **Advanced features** - video extension, interpolation, reference images

**Alternative**: Runway Gen-4 API is also viable but:
- Requires separate developer account
- Less comprehensive documentation
- No native audio generation mentioned
- Primarily focused on image-to-video

**Not Recommended**: OpenAI Sora
- No official public API
- Only third-party proxies available
- Unreliable for production use

## Implementation Plan

Use Google Veo 3.1 API through Gemini API:
1. Install Google GenAI SDK: `@google/genai`
2. Use Gemini API key (request from user via webdev_request_secrets)
3. Implement text-to-video generation with our validated prompts
4. Support video extension for longer content
5. Add reference images for brand consistency
