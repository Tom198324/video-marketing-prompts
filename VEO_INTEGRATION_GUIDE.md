# Google Veo 3.1 Video Generation Integration Guide

This document provides a complete implementation guide for integrating Google Veo 3.1 video generation into the Video Marketing Prompts platform.

## Overview

Google Veo 3.1 is the recommended video generation platform because it offers:
- Official public API through Gemini API
- Native audio generation (dialogue, sound effects, ambient noise)
- Multiple input modes (text-to-video, image-to-video, video extension)
- Reference images for brand consistency
- Comprehensive documentation and SDKs

## Prerequisites

### 1. Google Gemini API Key

Users need to obtain a Google Gemini API key:
1. Visit https://aistudio.google.com/apikey
2. Sign in with Google account
3. Create a new API key
4. Copy the key for use in the application

### 2. Install Google GenAI SDK

```bash
cd /home/ubuntu/video-marketing-prompts
pnpm add @google/genai
```

Or use the manual HTTP approach (already implemented in `server/veoVideoGeneration.ts`).

## Implementation Steps

### Step 1: Request API Key from User

Use the `webdev_request_secrets` tool to request the Gemini API key:

```typescript
// This will create a secrets input card for the user
webdev_request_secrets({
  message: "To enable video generation with Google Veo 3.1, please provide your Gemini API key. You can obtain one for free at https://aistudio.google.com/apikey",
  secrets: [{
    key: "GEMINI_API_KEY",
    description: "Google Gemini API key for Veo 3.1 video generation"
  }]
});
```

### Step 2: Add Video Generation Procedure

Add a new tRPC procedure in `server/routers.ts`:

```typescript
import { 
  startVideoGeneration, 
  pollVideoGenerationStatus,
  downloadGeneratedVideo,
  convertJsonPromptToVeoPrompt 
} from "./veoVideoGeneration";
import { storagePut } from "./storage";
import { env } from "./_core/env";

// In the generator router:
generateVideo: protectedProcedure
  .input(z.object({
    promptId: z.number().optional(),
    customPrompt: z.object({
      title: z.string(),
      prompt: z.any(),
    }).optional(),
    config: z.object({
      aspectRatio: z.enum(["16:9", "9:16"]).optional(),
      durationSeconds: z.enum([4, 6, 8]).optional(),
      resolution: z.enum(["720p", "1080p"]).optional(),
    }).optional(),
  }))
  .mutation(async ({ ctx, input }) => {
    // Get the prompt (either from database or custom)
    let promptData;
    let title;
    
    if (input.promptId) {
      const dbPrompt = await db.getPromptById(input.promptId);
      if (!dbPrompt) throw new TRPCError({ code: "NOT_FOUND", message: "Prompt not found" });
      promptData = dbPrompt.prompt;
      title = dbPrompt.title;
    } else if (input.customPrompt) {
      promptData = input.customPrompt.prompt;
      title = input.customPrompt.title;
    } else {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Either promptId or customPrompt required" });
    }
    
    // Convert JSON prompt to natural language for Veo
    const veoPrompt = convertJsonPromptToVeoPrompt(promptData);
    
    // Start video generation
    const { operationName } = await startVideoGeneration(
      env.GEMINI_API_KEY,
      veoPrompt,
      input.config || {}
    );
    
    // Store the operation in database for tracking
    const videoGeneration = await db.createVideoGeneration({
      userId: ctx.user.id,
      promptTitle: title,
      operationName,
      status: "processing",
      createdAt: Date.now(),
    });
    
    return {
      generationId: videoGeneration.id,
      operationName,
      status: "processing",
      message: "Video generation started. This may take 1-6 minutes.",
    };
  }),

checkVideoStatus: protectedProcedure
  .input(z.object({
    generationId: z.number(),
  }))
  .query(async ({ ctx, input }) => {
    const generation = await db.getVideoGenerationById(input.generationId);
    if (!generation || generation.userId !== ctx.user.id) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    
    if (generation.status === "completed" || generation.status === "failed") {
      return generation;
    }
    
    // Poll Veo API for status
    const status = await pollVideoGenerationStatus(
      env.GEMINI_API_KEY,
      generation.operationName
    );
    
    if (status.status === "completed" && status.videoUri) {
      // Download video and upload to S3
      const videoBuffer = await downloadGeneratedVideo(env.GEMINI_API_KEY, status.videoUri);
      const timestamp = Date.now();
      const fileKey = `videos/${ctx.user.id}/${timestamp}.mp4`;
      const { url } = await storagePut(fileKey, videoBuffer, "video/mp4");
      
      // Update database
      await db.updateVideoGeneration(generation.id, {
        status: "completed",
        videoUrl: url,
        completedAt: timestamp,
      });
      
      return {
        ...generation,
        status: "completed",
        videoUrl: url,
      };
    } else if (status.status === "failed") {
      await db.updateVideoGeneration(generation.id, {
        status: "failed",
        error: status.error,
      });
      
      return {
        ...generation,
        status: "failed",
        error: status.error,
      };
    }
    
    return generation;
  }),
```

### Step 3: Add Database Schema

Add video generation tracking table in `drizzle/schema.ts`:

```typescript
export const videoGenerations = sqliteTable("video_generations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id),
  promptTitle: text("prompt_title").notNull(),
  operationName: text("operation_name").notNull(),
  status: text("status").notNull(), // "processing" | "completed" | "failed"
  videoUrl: text("video_url"),
  error: text("error"),
  createdAt: integer("created_at").notNull(),
  completedAt: integer("completed_at"),
});
```

Run migration:
```bash
pnpm db:push
```

### Step 4: Add Database Helpers

Add helpers in `server/db.ts`:

```typescript
export async function createVideoGeneration(data: {
  userId: string;
  promptTitle: string;
  operationName: string;
  status: string;
  createdAt: number;
}) {
  const [result] = await db.insert(videoGenerations).values(data).returning();
  return result;
}

export async function getVideoGenerationById(id: number) {
  const [result] = await db.select().from(videoGenerations).where(eq(videoGenerations.id, id));
  return result;
}

export async function updateVideoGeneration(id: number, data: Partial<typeof videoGenerations.$inferInsert>) {
  await db.update(videoGenerations).set(data).where(eq(videoGenerations.id, id));
}

export async function getUserVideoGenerations(userId: string) {
  return db.select().from(videoGenerations)
    .where(eq(videoGenerations.userId, userId))
    .orderBy(desc(videoGenerations.createdAt));
}
```

### Step 5: Create Frontend UI

Create a new page `client/src/pages/VideoGenerator.tsx`:

```typescript
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Video, Download } from "lucide-react";

export default function VideoGenerator() {
  const [selectedPromptId, setSelectedPromptId] = useState<number | null>(null);
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9");
  const [duration, setDuration] = useState<4 | 6 | 8>(8);
  const [generationId, setGenerationId] = useState<number | null>(null);

  const prompts = trpc.generator.listPrompts.useQuery();
  const generateMutation = trpc.generator.generateVideo.useMutation({
    onSuccess: (data) => {
      setGenerationId(data.generationId);
      toast.success("Video generation started! This may take 1-6 minutes.");
    },
    onError: (error) => {
      toast.error(`Failed to start generation: ${error.message}`);
    },
  });

  const { data: videoStatus, refetch } = trpc.generator.checkVideoStatus.useQuery(
    { generationId: generationId! },
    {
      enabled: !!generationId,
      refetchInterval: (data) => {
        if (data?.status === "processing") return 10000; // Poll every 10 seconds
        return false;
      },
    }
  );

  const handleGenerate = () => {
    if (!selectedPromptId) {
      toast.error("Please select a prompt");
      return;
    }

    generateMutation.mutate({
      promptId: selectedPromptId,
      config: {
        aspectRatio,
        durationSeconds: duration,
        resolution: "720p",
      },
    });
  };

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Generate Marketing Video</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Video Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Prompt</label>
            <Select value={selectedPromptId?.toString()} onValueChange={(v) => setSelectedPromptId(Number(v))}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a prompt..." />
              </SelectTrigger>
              <SelectContent>
                {prompts.data?.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>
                    {p.title} (Score: {p.quality_score}/10)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Aspect Ratio</label>
            <Select value={aspectRatio} onValueChange={(v: any) => setAspectRatio(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                <SelectItem value="9:16">9:16 (Portrait/Mobile)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Duration</label>
            <Select value={duration.toString()} onValueChange={(v: any) => setDuration(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4 seconds</SelectItem>
                <SelectItem value="6">6 seconds</SelectItem>
                <SelectItem value="8">8 seconds</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={!selectedPromptId || generateMutation.isPending}
            className="w-full"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Starting Generation...
              </>
            ) : (
              <>
                <Video className="mr-2 h-4 w-4" />
                Generate Video
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {videoStatus && (
        <Card>
          <CardHeader>
            <CardTitle>Generation Status</CardTitle>
          </CardHeader>
          <CardContent>
            {videoStatus.status === "processing" && (
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <span>Generating video... This may take 1-6 minutes.</span>
              </div>
            )}

            {videoStatus.status === "completed" && videoStatus.videoUrl && (
              <div className="space-y-4">
                <p className="text-green-600 font-medium">✅ Video generated successfully!</p>
                <video controls className="w-full rounded-lg" src={videoStatus.videoUrl} />
                <Button asChild>
                  <a href={videoStatus.videoUrl} download>
                    <Download className="mr-2 h-4 w-4" />
                    Download Video
                  </a>
                </Button>
              </div>
            )}

            {videoStatus.status === "failed" && (
              <p className="text-red-600">❌ Generation failed: {videoStatus.error}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

### Step 6: Add Route

In `client/src/App.tsx`:

```typescript
import VideoGenerator from "./pages/VideoGenerator";

// Add route:
<Route path="/video-generator" component={VideoGenerator} />
```

### Step 7: Add Navigation Link

In the header navigation, add:

```typescript
<a href="/video-generator">Video Generator</a>
```

## Environment Variables

Add to `server/_core/env.ts`:

```typescript
export const env = {
  // ... existing vars
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
};
```

## Testing

### Manual Testing Steps

1. Request API key from user via secrets UI
2. Select a Gold-tier prompt from the gallery
3. Configure aspect ratio and duration
4. Click "Generate Video"
5. Wait for processing (1-6 minutes)
6. View and download the generated video

### Unit Tests

Create `server/generator.generateVideo.test.ts`:

```typescript
import { describe, it, expect, beforeAll } from "vitest";
import { convertJsonPromptToVeoPrompt } from "./veoVideoGeneration";

describe("Veo Video Generation", () => {
  it("should convert JSON prompt to natural language", () => {
    const jsonPrompt = {
      shot: { type: "Wide shot", framing: "Eye-level", angle: "Straight-on" },
      subject: { description: "A luxury sports car" },
      action: {
        sequences: [
          { description: "Car accelerates on mountain road", timing: "0-5s" },
        ],
      },
      scene: {
        environment: "Winding mountain highway at sunset",
        lighting: "Golden hour warm tones",
      },
      cinematography: {
        camera_movement: "Smooth tracking shot following the car",
        color_grading: "Warm orange and purple sunset palette",
      },
      audio: {
        sound_effects: [{ description: "Engine roaring powerfully" }],
        ambient_sound: "Wind rushing past",
      },
    };

    const result = convertJsonPromptToVeoPrompt(jsonPrompt);
    
    expect(result).toContain("Wide shot");
    expect(result).toContain("luxury sports car");
    expect(result).toContain("Car accelerates");
    expect(result).toContain("Engine roaring");
  });
});
```

## Cost Considerations

Google Veo 3.1 pricing (as of Nov 2025):
- Check current pricing at: https://ai.google.dev/gemini-api/docs/pricing#veo-3.1
- Typically charged per video generated
- Consider implementing usage limits per user
- Add cost warnings in the UI

## Rate Limits

- Check current rate limits at: https://ai.google.dev/gemini-api/docs/rate-limits
- Implement queue system if needed for high-volume usage
- Show estimated wait time to users

## Error Handling

Common errors and solutions:

1. **API Key Invalid**: Show clear message directing user to get valid key
2. **Generation Timeout**: Retry mechanism with exponential backoff
3. **Content Safety Filters**: Inform user that prompt was blocked, suggest modifications
4. **Rate Limit Exceeded**: Show wait time and queue position

## Future Enhancements

1. **Video Extension**: Allow users to extend 8-second videos to 15+ seconds
2. **Reference Images**: Upload brand assets to maintain consistency
3. **Batch Generation**: Generate multiple variations of the same prompt
4. **A/B Testing**: Generate 2-4 variations and let users pick the best
5. **Video Editing**: Trim, crop, add text overlays post-generation

## Resources

- Veo 3.1 Documentation: https://ai.google.dev/gemini-api/docs/video
- Gemini API Quickstart: https://ai.google.dev/gemini-api/docs/quickstart
- Veo Prompt Guide: https://ai.google.dev/gemini-api/docs/video#prompt-guide
- API Reference: https://ai.google.dev/api

## Support

If you encounter issues:
1. Check the Gemini API status page
2. Review error messages in browser console
3. Verify API key is valid and has sufficient quota
4. Check rate limits and usage quotas
5. Consult the official documentation

---

**Implementation Status**: Ready for development. All helper functions created in `server/veoVideoGeneration.ts`. Follow steps above to complete integration.
