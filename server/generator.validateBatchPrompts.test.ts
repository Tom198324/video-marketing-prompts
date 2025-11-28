import { describe, it, expect } from 'vitest';
import { appRouter } from './routers';

describe('generator.validateBatchPrompts', () => {
  const caller = appRouter.createCaller({
    user: null,
    req: {} as any,
    res: {} as any,
  });

  const createValidPrompt = (title: string) => ({
    title,
    promptText: JSON.stringify({
      shot: {
        type: 'Medium shot',
        angle: 'Eye level',
        framing: 'Center',
        movement: 'Static'
      },
      subject: {
        age: 30,
        gender: 'Female',
        ethnicity: 'Caucasian',
        physical: 'Athletic',
        facial_features: 'Friendly',
        clothing: 'Business casual',
        emotional_state: 'Confident'
      },
      action: {
        sequences: [
          {
            timing: '0-10s',
            primary_motion: 'Walking',
            camera_follows: 'Tracking'
          },
          {
            timing: '10-20s',
            primary_motion: 'Talking',
            camera_follows: 'Static'
          }
        ],
        duration: 20
      },
      scene: {
        location: 'Office',
        time_of_day: 'Day',
        weather: 'Clear',
        lighting: {
          type: 'Natural',
          quality: 'Soft',
          direction: 'Front'
        },
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
    })
  });

  it('should validate multiple prompts successfully', async () => {
    const prompts = [
      createValidPrompt('Test Prompt 1'),
      createValidPrompt('Test Prompt 2'),
      createValidPrompt('Test Prompt 3'),
    ];

    const result = await caller.generator.validateBatchPrompts({ prompts });

    expect(result).toBeDefined();
    expect(result.results).toHaveLength(3);
    expect(result.summary).toBeDefined();
    expect(result.summary.total).toBe(3);
    expect(result.summary.successful).toBeGreaterThanOrEqual(0);
    expect(result.summary.failed).toBeGreaterThanOrEqual(0);
    expect(result.summary.averageScore).toBeGreaterThanOrEqual(0);
    expect(result.summary.averageScore).toBeLessThanOrEqual(10);
  }, 120000); // 2 minutes timeout for LLM calls

  it('should handle invalid JSON in batch', async () => {
    const prompts = [
      createValidPrompt('Valid Prompt'),
      {
        title: 'Invalid Prompt',
        promptText: 'not valid json'
      },
    ];

    const result = await caller.generator.validateBatchPrompts({ prompts });

    expect(result.results).toHaveLength(2);
    expect(result.results[1].success).toBe(false);
    expect(result.results[1].error).toBe('Invalid JSON format');
    expect(result.summary.failed).toBeGreaterThanOrEqual(1);
  }, 90000);

  it('should handle missing sections in batch', async () => {
    const prompts = [
      createValidPrompt('Valid Prompt'),
      {
        title: 'Incomplete Prompt',
        promptText: JSON.stringify({
          shot: { type: 'Medium', angle: 'Eye level', framing: 'Center', movement: 'Static' },
          // Missing other required sections
        })
      },
    ];

    const result = await caller.generator.validateBatchPrompts({ prompts });

    expect(result.results).toHaveLength(2);
    expect(result.results[1].success).toBe(false);
    expect(result.results[1].error).toContain('Missing sections');
  }, 90000);

  it('should calculate summary statistics correctly', async () => {
    const prompts = [
      createValidPrompt('Prompt 1'),
      createValidPrompt('Prompt 2'),
    ];

    const result = await caller.generator.validateBatchPrompts({ prompts });

    expect(result.summary.total).toBe(2);
    expect(result.summary.successful + result.summary.failed).toBe(2);
    expect(result.summary.distribution).toBeDefined();
    expect(result.summary.distribution.gold).toBeGreaterThanOrEqual(0);
    expect(result.summary.distribution.silver).toBeGreaterThanOrEqual(0);
    expect(result.summary.distribution.bronze).toBeGreaterThanOrEqual(0);
    expect(result.summary.distribution.poor).toBeGreaterThanOrEqual(0);
  }, 120000);

  it('should identify prompts needing optimization', async () => {
    const prompts = [
      createValidPrompt('Test Prompt'),
    ];

    const result = await caller.generator.validateBatchPrompts({ prompts });

    expect(result.summary.needsOptimization).toBeGreaterThanOrEqual(0);
    expect(result.results[0]).toHaveProperty('needsOptimization');
    
    if (result.results[0].success) {
      expect(typeof result.results[0].needsOptimization).toBe('boolean');
    }
  }, 90000);
});
