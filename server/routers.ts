import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  prompts: router({
    getByIds: publicProcedure
      .input(z.object({ ids: z.array(z.number()) }))
      .query(async ({ input }) => {
        const { getPromptsByNumbers } = await import("./db");
        return getPromptsByNumbers(input.ids);
      }),
    list: publicProcedure.query(async () => {
      const { getAllPrompts } = await import("./db");
      return getAllPrompts();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const { getPromptById } = await import("./db");
        return getPromptById(input.id);
      }),
    
    getByNumber: publicProcedure
      .input(z.object({ promptNumber: z.number() }))
      .query(async ({ input }) => {
        const { getPromptByNumber } = await import("./db");
        return getPromptByNumber(input.promptNumber);
      }),
    
    search: publicProcedure
      .input(z.object({
        search: z.string().optional(),
        industrySector: z.string().optional(),
        visualStyle: z.string().optional(),
        scenarioType: z.string().optional(),
      }))
      .query(async ({ input }) => {
        const { searchPrompts } = await import("./db");
        return searchPrompts(input);
      }),
    
    getStats: publicProcedure.query(async () => {
      const { getAllPrompts } = await import("./db");
      const allPrompts = await getAllPrompts();
      
      const sectors = new Set(allPrompts.map(p => p.industrySector));
      const styles = new Set(allPrompts.map(p => p.visualStyle));
      const scenarios = new Set(allPrompts.map(p => p.scenarioType));
      
      return {
        total: allPrompts.length,
        sectors: Array.from(sectors),
        styles: Array.from(styles),
        scenarios: Array.from(scenarios),
      };
    }),
  }),
  
  generator: router({
    generateVariation: publicProcedure
      .input(z.object({
        promptId: z.number(),
        count: z.number().min(1).max(5).default(1),
        variations: z.object({
          subject: z.boolean().optional(),
          location: z.boolean().optional(),
          style: z.boolean().optional(),
          equipment: z.boolean().optional(),
          lighting: z.boolean().optional(),
          action: z.boolean().optional(),
          audio: z.boolean().optional(),
          technical: z.boolean().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        const { getPromptById } = await import("./db");
        const promptData = await getPromptById(input.promptId);
        
        if (!promptData) {
          throw new Error("Prompt not found");
        }

        // Parse the prompt JSON
        const originalPrompt = JSON.parse(promptData.promptJson);

        // Build variation instructions
        const variationInstructions: string[] = [];
        if (input.variations.subject) variationInstructions.push("the character (age, gender, ethnicity, appearance, clothing)");
        if (input.variations.location) variationInstructions.push("the location and scene (location, time of day, weather, atmosphere)");
        if (input.variations.style) variationInstructions.push("the cinematographic style (shot type, camera angle, framing, movement)");
        if (input.variations.equipment) variationInstructions.push("the equipment (camera, lens, technical settings)");
        if (input.variations.lighting) variationInstructions.push("the lighting (type, quality, direction)");
        if (input.variations.action) variationInstructions.push("the actions and sequences (timing, movements)");
        if (input.variations.audio) variationInstructions.push("the audio (ambient sound, music style)");
        if (input.variations.technical) variationInstructions.push("the technical specifications (resolution, FPS, format)");

        const variationText = variationInstructions.length > 0 
          ? variationInstructions.join(", ")
          : "all aspects";

        // Generate multiple variations
        const variations = [];
        
        for (let i = 0; i < input.count; i++) {
          // LLM call to generate a variation
          const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are an expert in video prompt generation for OpenAI Sora 2 and Google Veo 3. You must generate a variation of an existing prompt by modifying certain aspects while maintaining the complete JSON structure and professional coherence.

The JSON structure must contain exactly these 8 mandatory sections:
1. shot (type, angle, framing, movement)
2. subject (age, gender, ethnicity, physical, facial_features, clothing, emotional_state)
3. action (sequences array with timing/primary_motion/camera_follows, duration)
4. scene (location, time_of_day, weather, lighting with type/quality/direction, atmosphere)
5. cinematography (camera, lens, aperture, iso, shutter_speed, white_balance, color_profile, stabilization)
6. audio (ambient_sound, music_style, voice_over)
7. visual_rules (realism, continuity)
8. technical_specifications (resolution, fps, aspect_ratio, color_space, bit_depth, codec, duration_seconds)

Important rule: Variations must be creative and coherent. For example, if you change the location from a modern office to a beach, also adapt the lighting, character clothing, and sound atmosphere to maintain coherence.`
            },
            {
              role: "user",
              content: `Generate a variation ${i > 0 ? 'DIFFERENT from the previous ones' : ''} of this prompt by modifying ${variationText}. ${i > 0 ? 'Be creative and propose a completely different approach.' : ''} Ensure all modifications are coherent with each other.

Original prompt:
${JSON.stringify({
  shot: originalPrompt.shot,
  subject: originalPrompt.subject,
  action: originalPrompt.action,
  scene: originalPrompt.scene,
  cinematography: originalPrompt.cinematography,
  audio: originalPrompt.audio,
  visual_rules: originalPrompt.visual_rules,
  technical_specifications: originalPrompt.technical_specifications,
}, null, 2)}

Respond ONLY with the complete JSON of the variation, no additional text.`
            }
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "prompt_variation",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  shot: {
                    type: "object",
                    properties: {
                      type: { type: "string" },
                      angle: { type: "string" },
                      framing: { type: "string" },
                      movement: { type: "string" }
                    },
                    required: ["type", "angle", "framing", "movement"],
                    additionalProperties: false
                  },
                  subject: {
                    type: "object",
                    properties: {
                      age: { type: "number" },
                      gender: { type: "string" },
                      ethnicity: { type: "string" },
                      physical: { type: "string" },
                      facial_features: { type: "string" },
                      clothing: { type: "string" },
                      emotional_state: { type: "string" }
                    },
                    required: ["age", "gender", "ethnicity", "physical", "facial_features", "clothing", "emotional_state"],
                    additionalProperties: false
                  },
                  action: {
                    type: "object",
                    properties: {
                      sequences: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            timing: { type: "string" },
                            primary_motion: { type: "string" },
                            camera_follows: { type: "string" }
                          },
                          required: ["timing", "primary_motion", "camera_follows"],
                          additionalProperties: false
                        }
                      },
                      duration: { type: "string" }
                    },
                    required: ["sequences", "duration"],
                    additionalProperties: false
                  },
                  scene: {
                    type: "object",
                    properties: {
                      location: { type: "string" },
                      time_of_day: { type: "string" },
                      weather: { type: "string" },
                      lighting: {
                        type: "object",
                        properties: {
                          type: { type: "string" },
                          quality: { type: "string" },
                          direction: { type: "string" }
                        },
                        required: ["type", "quality", "direction"],
                        additionalProperties: false
                      },
                      atmosphere: { type: "string" }
                    },
                    required: ["location", "time_of_day", "weather", "lighting", "atmosphere"],
                    additionalProperties: false
                  },
                  cinematography: {
                    type: "object",
                    properties: {
                      camera: { type: "string" },
                      lens: { type: "string" },
                      aperture: { type: "string" },
                      iso: { type: "string" },
                      shutter_speed: { type: "string" },
                      white_balance: { type: "string" },
                      color_profile: { type: "string" },
                      stabilization: { type: "string" }
                    },
                    required: ["camera", "lens", "aperture", "iso", "shutter_speed", "white_balance", "color_profile", "stabilization"],
                    additionalProperties: false
                  },
                  audio: {
                    type: "object",
                    properties: {
                      ambient_sound: { type: "string" },
                      music_style: { type: "string" },
                      voice_over: { type: "string" }
                    },
                    required: ["ambient_sound", "music_style", "voice_over"],
                    additionalProperties: false
                  },
                  visual_rules: {
                    type: "object",
                    properties: {
                      realism: { type: "string" },
                      continuity: { type: "string" }
                    },
                    required: ["realism", "continuity"],
                    additionalProperties: false
                  },
                  technical_specifications: {
                    type: "object",
                    properties: {
                      resolution: { type: "string" },
                      fps: { type: "string" },
                      aspect_ratio: { type: "string" },
                      color_space: { type: "string" },
                      bit_depth: { type: "string" },
                      codec: { type: "string" },
                      duration_seconds: { type: "number" }
                    },
                    required: ["resolution", "fps", "aspect_ratio", "color_space", "bit_depth", "codec", "duration_seconds"],
                    additionalProperties: false
                  }
                },
                required: ["shot", "subject", "action", "scene", "cinematography", "audio", "visual_rules", "technical_specifications"],
                additionalProperties: false
              }
            }
          }
        });

          const content = response.choices[0].message.content;
          const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
          const generatedPrompt = JSON.parse(contentStr || "{}");
          
          variations.push({
            id: i + 1,
            data: generatedPrompt,
          });
        }
        
        return {
          original: {
            shot: originalPrompt.shot,
            subject: originalPrompt.subject,
            action: originalPrompt.action,
            scene: originalPrompt.scene,
            cinematography: originalPrompt.cinematography,
            audio: originalPrompt.audio,
            visual_rules: originalPrompt.visual_rules,
            technical_specifications: originalPrompt.technical_specifications,
          },
          variations: variations,
        };
      }),

    analyzePrompt: publicProcedure
      .input(z.object({
        promptId: z.number(),
      }))
      .mutation(async ({ input }) => {
        const { getPromptById } = await import("./db");
        const promptData = await getPromptById(input.promptId);
        
        if (!promptData) {
          throw new Error("Prompt not found");
        }

        const promptJson = JSON.parse(promptData.promptJson);

        const analysisResponse = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are a WORLD-CLASS cinematography expert with 20+ years of experience in Oscar-winning productions (Blade Runner 2049, 1917, The Revenant). You have ZERO tolerance for mediocrity.

CRITICAL EVALUATION STANDARDS:
- 10/10 = PERFECT - Worthy of Cannes Film Festival, zero improvements possible
- 9/10 = CINEMATIC EXCELLENCE - Hollywood/Pixar level, ready for Super Bowl commercial
- 8/10 = PROFESSIONAL MASTERY - High-end production quality, minor refinements only
- 7/10 = SOLID PROFESSIONAL - Good but needs optimization for premium use
- 6/10 = ACCEPTABLE - Multiple improvements required for professional standards
- 5/10 = MEDIOCRE - Significant weaknesses, major reconstruction needed
- 4/10 = POOR - Fundamental flaws, complete redesign required
- 1-3/10 = UNACCEPTABLE - Start from scratch

AUTOMATIC PENALTIES (apply these strictly):
- Generic sequences ("Sequence 2", "Product showcase", "Display features"): -5 points
- Narrative incoherence between sequences: -3 points
- Vague technical terms ("good lighting", "nice camera"): -3 points
- Missing emotional progression across sequences: -2 points
- Visual or narrative clichés: -2 points
- Imprecise timing (no seconds specified): -2 points
- Incomplete technical specifications: -3 points

ONLY award 9-10/10 if ALL criteria are met:
✓ Cinematic mastery in camera work (specific lens, aperture, movement)
✓ Precise timing down to the second for each action
✓ Clear emotional storytelling arc across all sequences
✓ Complete technical specifications (resolution, fps, color space, codec)
✓ Creative originality (no generic "showcase" language)
✓ Professional-grade audio design with specific sync points
✓ Perfect visual continuity and realism rules
✓ Specific subject details (age, expression, wardrobe evolution)

Be RUTHLESSLY CRITICAL. Excellence is the ONLY acceptable standard.`
            },
            {
              role: "user",
              content: `Analyze this video marketing prompt with EXTREME RIGOR:\n\nTitle: ${promptData.title}\nSector: ${promptData.industrySector}\n\nPrompt JSON:\n${JSON.stringify(promptJson, null, 2)}\n\nEVALUATE EACH OF THE 8 SECTIONS:\n1. Shot (camera_system, lens, composition, movement) - 20% weight\n2. Subject (identity, appearance, expression, evolution) - 15% weight\n3. Action (precise timing, specific movements, camera tracking) - 25% weight\n4. Scene (location, time, weather, lighting, atmosphere) - 10% weight\n5. Cinematography (camera settings, color, stabilization) - 15% weight\n6. Audio (ambient, music, voice-over, sync) - 10% weight\n7. Visual Rules (realism, continuity) - 5% weight\n8. Technical Specifications (resolution, fps, codec, duration) - 0% (binary: complete or -3 penalty)\n\nAPPLY AUTOMATIC PENALTIES STRICTLY. Start from 5/10 baseline and justify every point above that.\n\nProvide JSON with:\n- overall_score (0-10, weighted average with penalties applied)\n- overall_assessment (harsh critical evaluation)\n- section_scores (object with scores 0-10 for each of 8 sections)\n- section_analysis (object with strengths/weaknesses/suggestions arrays for each section)\n- priority_improvements (array of critical issues to fix)\n- penalties_applied (array of penalty descriptions with point deductions)`
            }
          ],
          response_format: { type: "json_object" }
        });

        const analysisContent = analysisResponse.choices[0].message.content;
        const analysis = JSON.parse(typeof analysisContent === 'string' ? analysisContent : '{}');

        return {
          promptId: input.promptId,
          promptTitle: promptData.title,
          analysis
        };
      }),

    optimizePrompt: publicProcedure
      .input(z.object({
        promptId: z.number(),
      }))
      .mutation(async ({ input }) => {
        const { getPromptById } = await import("./db");
        const promptData = await getPromptById(input.promptId);
        
        if (!promptData) {
          throw new Error("Prompt not found");
        }

        const originalPrompt = JSON.parse(promptData.promptJson);

        const optimizationResponse = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are a WORLD-CLASS cinematography director and prompt engineer with expertise in Oscar-winning productions. Your optimization standards are UNCOMPROMISING.

OPTIMIZATION MISSION:
Transform mediocre prompts into CINEMATIC MASTERPIECES worthy of 9-10/10 scores.

MANDATORY IMPROVEMENTS:
1. ELIMINATE ALL GENERIC LANGUAGE:
   - Replace "showcase", "display", "demonstrate" with SPECIFIC ACTIONS
   - Replace "Sequence 1/2/3" with DESCRIPTIVE NARRATIVE BEATS
   - Replace vague terms with PRECISE TECHNICAL SPECIFICATIONS

2. ADD PRECISE TIMING:
   - Every action must have EXACT timing in seconds (e.g., "0-3s:", "3-8s:", "8-14s:")
   - Specify camera movement duration and speed
   - Define audio sync points precisely

3. CREATE EMOTIONAL ARC:
   - Sequence 1: INTRIGUE (establish mystery/desire)
   - Sequence 2: CONNECTION (build emotional engagement)
   - Sequence 3: IMPACT (deliver memorable climax)

4. SPECIFY TECHNICAL EXCELLENCE:
   - Camera: Exact model + lens (e.g., "ARRI Alexa Mini LF + Zeiss Supreme Prime 50mm T1.5")
   - Lighting: Specific setup (e.g., "3-point Rembrandt lighting, 5600K key, -2 stops fill")
   - Movement: Precise technique (e.g., "Ronin 2 gimbal, 0.5m/s dolly-in, smooth deceleration")

5. ENSURE VISUAL CONTINUITY:
   - Maintain consistent color temperature across sequences
   - Preserve subject appearance and wardrobe
   - Respect spatial and temporal logic

6. ELEVATE AUDIO DESIGN:
   - Specify ambient layers (e.g., "Soft cafe ambience 20dB, espresso machine hiss 35dB")
   - Define music cues with timing (e.g., "Minimal piano enters at 8s, crescendo 14-18s")
   - Add foley details (e.g., "Fabric rustle sync with hand movement at 5s")

RETURN ONLY THE COMPLETE OPTIMIZED JSON. No explanations, no markdown.`
            },
            {
              role: "user",
              content: `OPTIMIZE THIS PROMPT TO CINEMATIC EXCELLENCE (target 9-10/10):\n\nOriginal Prompt:\n${JSON.stringify(originalPrompt, null, 2)}\n\nAPPLY ALL MANDATORY IMPROVEMENTS:\n✓ Remove ALL generic language ("showcase", "display", "Sequence X")\n✓ Add precise timing in seconds for every action\n✓ Create clear emotional progression (Intrigue → Connection → Impact)\n✓ Specify exact camera equipment and settings\n✓ Detail lighting setup with technical precision\n✓ Define camera movements with speed and duration\n✓ Add layered audio design with sync points\n✓ Ensure perfect visual continuity\n✓ Maintain exact JSON structure with all 8 sections\n\nReturn ONLY the complete optimized JSON (no markdown, no explanations).`
            }
          ],
          response_format: { type: "json_object" }
        });

        const optimizedContent = optimizationResponse.choices[0].message.content;
        const optimizedPrompt = JSON.parse(typeof optimizedContent === 'string' ? optimizedContent : '{}');

        return {
          original: originalPrompt,
          optimized: optimizedPrompt
        };
      }),
  }),

  favorites: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getUserFavorites } = await import("./db");
      return getUserFavorites(ctx.user.id);
    }),
    
    add: protectedProcedure
      .input(z.object({ promptId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { addFavorite } = await import("./db");
        await addFavorite(ctx.user.id, input.promptId);
        return { success: true };
      }),
    
    remove: protectedProcedure
      .input(z.object({ promptId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { removeFavorite } = await import("./db");
        await removeFavorite(ctx.user.id, input.promptId);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
