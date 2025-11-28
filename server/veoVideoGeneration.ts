/**
 * Google Veo 3.1 Video Generation Integration
 * Uses Gemini API to generate marketing videos from validated prompts
 */

interface VeoGenerationConfig {
  aspectRatio?: "16:9" | "9:16";
  durationSeconds?: 4 | 6 | 8;
  resolution?: "720p" | "1080p";
  negativePrompt?: string;
}

interface VeoGenerationResult {
  operationName: string;
  videoUri?: string;
  status: "pending" | "processing" | "completed" | "failed";
  error?: string;
}

/**
 * Start a video generation task with Veo 3.1
 * @param apiKey - Google Gemini API key
 * @param prompt - Text prompt for video generation
 * @param config - Optional configuration for video generation
 * @returns Operation name to poll for status
 */
export async function startVideoGeneration(
  apiKey: string,
  prompt: string,
  config: VeoGenerationConfig = {}
): Promise<{ operationName: string }> {
  const baseUrl = "https://generativelanguage.googleapis.com/v1beta";
  const model = "veo-3.1-generate-preview";
  
  const requestBody = {
    instances: [{
      prompt: prompt,
    }],
    parameters: {
      aspectRatio: config.aspectRatio || "16:9",
      durationSeconds: config.durationSeconds || 8,
      resolution: config.resolution || "720p",
      ...(config.negativePrompt && { negativePrompt: config.negativePrompt }),
    },
  };
  
  const response = await fetch(`${baseUrl}/models/${model}:predictLongRunning`, {
    method: "POST",
    headers: {
      "x-goog-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to start video generation: ${error}`);
  }
  
  const data = await response.json();
  return { operationName: data.name };
}

/**
 * Poll the status of a video generation operation
 * @param apiKey - Google Gemini API key
 * @param operationName - Operation name from startVideoGeneration
 * @returns Current status and video URI if completed
 */
export async function pollVideoGenerationStatus(
  apiKey: string,
  operationName: string
): Promise<VeoGenerationResult> {
  const baseUrl = "https://generativelanguage.googleapis.com/v1beta";
  
  const response = await fetch(`${baseUrl}/${operationName}`, {
    headers: {
      "x-goog-api-key": apiKey,
    },
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to poll operation status: ${error}`);
  }
  
  const data = await response.json();
  
  if (data.done === true) {
    if (data.error) {
      return {
        operationName,
        status: "failed",
        error: data.error.message || "Unknown error",
      };
    }
    
    const videoUri = data.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;
    return {
      operationName,
      status: "completed",
      videoUri,
    };
  }
  
  return {
    operationName,
    status: "processing",
  };
}

/**
 * Download a generated video from Gemini API
 * @param apiKey - Google Gemini API key
 * @param videoUri - Video URI from completed operation
 * @returns Video file as Buffer
 */
export async function downloadGeneratedVideo(
  apiKey: string,
  videoUri: string
): Promise<Buffer> {
  const response = await fetch(videoUri, {
    headers: {
      "x-goog-api-key": apiKey,
    },
    redirect: "follow",
  });
  
  if (!response.ok) {
    throw new Error(`Failed to download video: ${response.statusText}`);
  }
  
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Generate a video and wait for completion (convenience function)
 * @param apiKey - Google Gemini API key
 * @param prompt - Text prompt for video generation
 * @param config - Optional configuration
 * @param maxWaitSeconds - Maximum time to wait (default: 360 seconds = 6 minutes)
 * @returns Video URI when completed
 */
export async function generateVideoAndWait(
  apiKey: string,
  prompt: string,
  config: VeoGenerationConfig = {},
  maxWaitSeconds: number = 360
): Promise<string> {
  const { operationName } = await startVideoGeneration(apiKey, prompt, config);
  
  const startTime = Date.now();
  const pollInterval = 10000; // 10 seconds
  
  while (true) {
    const elapsed = (Date.now() - startTime) / 1000;
    if (elapsed > maxWaitSeconds) {
      throw new Error(`Video generation timeout after ${maxWaitSeconds} seconds`);
    }
    
    const status = await pollVideoGenerationStatus(apiKey, operationName);
    
    if (status.status === "completed" && status.videoUri) {
      return status.videoUri;
    }
    
    if (status.status === "failed") {
      throw new Error(`Video generation failed: ${status.error}`);
    }
    
    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }
}

/**
 * Convert a JSON prompt to a natural language prompt for Veo
 * @param promptJson - Structured JSON prompt from our system
 * @returns Natural language prompt optimized for Veo
 */
export function convertJsonPromptToVeoPrompt(promptJson: any): string {
  const parts: string[] = [];
  
  // Shot description
  if (promptJson.shot) {
    const shot = promptJson.shot;
    if (shot.type) parts.push(shot.type);
    if (shot.framing) parts.push(shot.framing);
    if (shot.angle) parts.push(`${shot.angle} angle`);
  }
  
  // Subject
  if (promptJson.subject?.description) {
    parts.push(promptJson.subject.description);
  }
  
  // Action with timing
  if (promptJson.action?.sequences) {
    promptJson.action.sequences.forEach((seq: any) => {
      if (seq.description) {
        const timing = seq.timing ? ` (${seq.timing})` : "";
        parts.push(`${seq.description}${timing}`);
      }
    });
  }
  
  // Scene details
  if (promptJson.scene) {
    const scene = promptJson.scene;
    if (scene.environment) parts.push(scene.environment);
    if (scene.lighting) parts.push(scene.lighting);
    if (scene.atmosphere) parts.push(scene.atmosphere);
  }
  
  // Cinematography
  if (promptJson.cinematography) {
    const cine = promptJson.cinematography;
    if (cine.camera_movement) parts.push(cine.camera_movement);
    if (cine.lens_effects) parts.push(cine.lens_effects);
    if (cine.color_grading) parts.push(cine.color_grading);
  }
  
  // Audio cues (Veo 3.1 supports audio generation)
  if (promptJson.audio) {
    const audio = promptJson.audio;
    if (audio.dialogue) {
      audio.dialogue.forEach((d: any) => {
        if (d.text) parts.push(`"${d.text}"`);
      });
    }
    if (audio.sound_effects) {
      audio.sound_effects.forEach((sfx: any) => {
        if (sfx.description) parts.push(sfx.description);
      });
    }
    if (audio.ambient_sound) parts.push(audio.ambient_sound);
  }
  
  // Visual style
  if (promptJson.visual_rules?.style) {
    parts.push(promptJson.visual_rules.style);
  }
  
  return parts.filter(Boolean).join(", ");
}
