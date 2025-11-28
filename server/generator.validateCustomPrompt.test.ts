import { describe, it, expect } from 'vitest';
import { appRouter } from './routers';

describe('generator.validateCustomPrompt', () => {
  const caller = appRouter.createCaller({
    user: null,
    req: {} as any,
    res: {} as any,
  });

  it('should reject invalid JSON format', async () => {
    await expect(
      caller.generator.validateCustomPrompt({
        promptText: 'not valid json',
        title: 'Test Prompt',
      })
    ).rejects.toThrow('Invalid JSON format');
  });

  it('should reject prompt missing required sections', async () => {
    const incompletePrompt = JSON.stringify({
      shot: { type: 'Medium shot', angle: 'Eye level', framing: 'Center', movement: 'Static' },
      subject: { age: 30, gender: 'Female', ethnicity: 'Caucasian', physical: 'Athletic', facial_features: 'Friendly', clothing: 'Business casual', emotional_state: 'Confident' },
      // Missing: action, scene, cinematography, audio, visual_rules, technical_specifications
    });

    await expect(
      caller.generator.validateCustomPrompt({
        promptText: incompletePrompt,
        title: 'Incomplete Prompt',
      })
    ).rejects.toThrow('Missing required sections');
  });

  it('should validate complete prompt and return analysis', async () => {
    const completePrompt = JSON.stringify({
      shot: {
        type: 'ARRI Alexa Mini LF tracking shot',
        angle: 'Eye-level with subtle Dutch tilt at climax',
        framing: 'Medium close-up transitioning to extreme close-up',
        movement: 'Ronin 2 gimbal dolly-in, 0.3m/s smooth acceleration'
      },
      subject: {
        age: 32,
        gender: 'Female',
        ethnicity: 'East Asian',
        physical: 'Athletic build, 5\'7", graceful posture',
        facial_features: 'Sharp cheekbones, focused gaze, subtle smile progression',
        clothing: 'Charcoal tailored blazer, minimalist silver jewelry',
        emotional_state: 'Professional confidence evolving to genuine warmth'
      },
      action: {
        sequences: [
          {
            timing: '0-6s',
            primary_motion: 'Subject enters modern office, hand reaches for premium coffee cup on marble desk',
            camera_follows: 'Smooth tracking from doorway, follows hand movement to cup'
          },
          {
            timing: '6-13s',
            primary_motion: 'Lifts cup with both hands, steam rises, brings to lips, eyes close in appreciation',
            camera_follows: 'Dolly-in to medium close-up, focus shifts from hands to face'
          },
          {
            timing: '13-20s',
            primary_motion: 'Opens eyes with satisfied expression, sets cup down gently, confident smile to camera',
            camera_follows: 'Hold on face, slight zoom to extreme close-up on eyes and smile'
          }
        ],
        duration: 20
      },
      scene: {
        location: 'Corner office, floor-to-ceiling windows, city skyline at golden hour',
        time_of_day: 'Late afternoon (5:30 PM)',
        weather: 'Clear sky, golden hour sunlight',
        lighting: {
          type: '3-point Rembrandt setup with natural window fill',
          quality: 'Soft diffused key 5600K, -2 stops fill, rim from window',
          direction: 'Key from camera left 45°, natural backlight from window right'
        },
        atmosphere: 'Sophisticated, warm, aspirational luxury'
      },
      cinematography: {
        camera: 'ARRI Alexa Mini LF',
        lens: 'Zeiss Supreme Prime 50mm T1.5',
        aperture: 'T2.0 (shallow depth of field, background bokeh)',
        iso: '800',
        shutter_speed: '1/48s (180° shutter)',
        white_balance: '5600K (daylight balanced)',
        color_profile: 'ARRI LogC4',
        stabilization: 'DJI Ronin 2 gimbal with smooth operator mode'
      },
      audio: {
        ambient_sound: 'Soft office ambience 18dB, distant city hum 12dB, paper rustle 25dB at 2s',
        music_style: 'Minimal piano with cello, enters at 7s, crescendo 15-18s, resolution at 20s',
        voice_over: 'None'
      },
      visual_rules: {
        realism: 'Photorealistic, natural skin tones, authentic material textures',
        continuity: 'Consistent lighting temperature, wardrobe integrity, spatial logic maintained'
      },
      technical_specifications: {
        resolution: '4K UHD (3840x2160)',
        fps: '24',
        aspect_ratio: '16:9',
        color_space: 'Rec. 2020',
        bit_depth: '10-bit',
        codec: 'ProRes 422 HQ',
        duration_seconds: 20
      }
    });

    const result = await caller.generator.validateCustomPrompt({
      promptText: completePrompt,
      title: 'Premium Coffee Commercial',
    });

    expect(result).toBeDefined();
    expect(result.title).toBe('Premium Coffee Commercial');
    expect(result.analysis).toBeDefined();
    expect(result.analysis.overall_score).toBeGreaterThanOrEqual(0);
    expect(result.analysis.overall_score).toBeLessThanOrEqual(10);
    expect(result.analysis.overall_assessment).toBeDefined();
    expect(result.analysis.section_scores).toBeDefined();
    expect(result.isValid).toBeDefined();
    expect(result.recommendation).toBeDefined();
    
    // Verify section scores exist (LLM may use different key formats)
    expect(result.analysis.section_scores).toBeDefined();
    expect(typeof result.analysis.section_scores).toBe('object');
    
    // Check that we have section analysis data
    if (result.analysis.section_analysis) {
      expect(typeof result.analysis.section_analysis).toBe('object');
    }
  }, 60000); // 60s timeout for LLM call

  it('should return correct recommendation based on score', async () => {
    const completePrompt = JSON.stringify({
      shot: { type: 'Medium shot', angle: 'Eye level', framing: 'Center', movement: 'Static' },
      subject: { age: 30, gender: 'Female', ethnicity: 'Caucasian', physical: 'Athletic', facial_features: 'Friendly', clothing: 'Business casual', emotional_state: 'Confident' },
      action: {
        sequences: [
          { timing: '0-10s', primary_motion: 'Walking', camera_follows: 'Tracking' },
          { timing: '10-20s', primary_motion: 'Talking', camera_follows: 'Static' }
        ],
        duration: 20
      },
      scene: {
        location: 'Office',
        time_of_day: 'Day',
        weather: 'Clear',
        lighting: { type: 'Natural', quality: 'Soft', direction: 'Front' },
        atmosphere: 'Professional'
      },
      cinematography: {
        camera: 'ARRI Alexa',
        lens: '50mm',
        aperture: 'f/2.8',
        iso: '800',
        shutter_speed: '1/50',
        white_balance: '5600K',
        color_profile: 'Rec709',
        stabilization: 'Gimbal'
      },
      audio: {
        ambient_sound: 'Office sounds',
        music_style: 'Corporate',
        voice_over: 'None'
      },
      visual_rules: {
        realism: 'Realistic',
        continuity: 'Maintained'
      },
      technical_specifications: {
        resolution: '4K',
        fps: '24',
        aspect_ratio: '16:9',
        color_space: 'Rec. 709',
        bit_depth: '10-bit',
        codec: 'H.264',
        duration_seconds: 20
      }
    });

    const result = await caller.generator.validateCustomPrompt({
      promptText: completePrompt,
      title: 'Basic Prompt',
    });

    expect(result.recommendation).toBeDefined();
    expect(typeof result.recommendation).toBe('string');
    
    // Recommendation should match score range
    if (result.analysis.overall_score >= 9) {
      expect(result.recommendation).toContain('EXCELLENT');
    } else if (result.analysis.overall_score >= 7) {
      expect(result.recommendation).toContain('GOOD');
    } else if (result.analysis.overall_score >= 5) {
      expect(result.recommendation).toContain('MEDIOCRE');
    } else {
      expect(result.recommendation).toContain('POOR');
    }
  }, 60000); // 60s timeout for LLM call
});
