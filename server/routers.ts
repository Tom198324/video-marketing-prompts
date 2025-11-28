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
          tone: z.boolean().optional(),
          subject: z.boolean().optional(),
          location: z.boolean().optional(),
          style: z.boolean().optional(),
          equipment: z.boolean().optional(),
          lighting: z.boolean().optional(),
          action: z.boolean().optional(),
          audio: z.boolean().optional(),
          technical: z.boolean().optional(),
        }),
        toneData: z.object({
          primary_tone: z.string().optional(),
          secondary_tone: z.string().optional(),
          mood_keywords: z.array(z.string()).optional(),
          emotional_arc: z.string().optional(),
          visual_style_reference: z.string().optional(),
        }).optional(),
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
        if (input.variations.tone) {
          if (input.toneData?.primary_tone) {
            variationInstructions.push(`the tone and atmosphere to ${input.toneData.primary_tone}${input.toneData.secondary_tone ? ` with ${input.toneData.secondary_tone}` : ''}${input.toneData.mood_keywords?.length ? `, mood: ${input.toneData.mood_keywords.join(', ')}` : ''}${input.toneData.emotional_arc ? `, emotional arc: ${input.toneData.emotional_arc}` : ''}`);
          } else {
            variationInstructions.push("the tone and atmosphere (emotional tone, mood, visual style)");
          }
        }
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

    validateCustomPrompt: publicProcedure
      .input(z.object({
        promptText: z.string(),
        title: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Parse the custom prompt JSON
        let promptJson;
        try {
          promptJson = JSON.parse(input.promptText);
        } catch (error) {
          throw new Error("Invalid JSON format. Please provide a valid JSON prompt.");
        }

        // Validate that it has the required structure
        const requiredSections = ['tone_and_atmosphere', 'shot', 'subject', 'action', 'scene', 'cinematography', 'audio', 'visual_rules', 'technical_specifications'];
        const missingSections = requiredSections.filter(section => !promptJson[section]);
        
        if (missingSections.length > 0) {
          throw new Error(`Missing required sections: ${missingSections.join(', ')}. All 9 sections are mandatory.`);
        }

        // Run ultra-strict evaluation
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
              content: `Analyze this custom video prompt with EXTREME RIGOR:\n\nTitle: ${input.title || 'Custom Prompt'}\n\nPrompt JSON:\n${JSON.stringify(promptJson, null, 2)}\n\nEVALUATE EACH OF THE 9 SECTIONS:\n1. Tone & Atmosphere (primary_tone, mood_keywords, emotional_arc, coherence) - 15% weight\n2. Shot (camera_system, lens, composition, movement) - 18% weight\n3. Subject (identity, appearance, expression, evolution) - 12% weight\n4. Action (precise timing, specific movements, camera tracking) - 20% weight\n5. Scene (location, time, weather, lighting, atmosphere) - 10% weight\n6. Cinematography (camera settings, color, stabilization) - 12% weight\n7. Audio (ambient, music, voice-over, sync) - 8% weight\n8. Visual Rules (realism, continuity) - 5% weight\n9. Technical Specifications (resolution, fps, codec, duration) - 0% (binary: complete or -3 penalty)\n\nTONE & ATMOSPHERE EVALUATION CRITERIA:\n- Is the primary tone clearly defined and appropriate?\n- Are mood keywords specific and coherent with the tone?\n- Does the emotional arc create a compelling narrative progression?\n- Is the tone consistent across ALL other sections?\n- Penalty -3 points if tone is generic or missing\n- Penalty -2 points if tone conflicts with other sections\n\nAPPLY AUTOMATIC PENALTIES STRICTLY. Start from 5/10 baseline and justify every point above that.\n\nProvide JSON with:\n- overall_score (0-10, weighted average with penalties applied)\n- overall_assessment (harsh critical evaluation)\n- section_scores (object with scores 0-10 for each of 9 sections, including tone_and_atmosphere)\n- section_analysis (object with strengths/weaknesses/suggestions arrays for each of 9 sections)\n- priority_improvements (array of critical issues to fix)\n- penalties_applied (array of penalty descriptions with point deductions)`
            }
          ],
          response_format: { type: "json_object" }
        });

        const analysisContent = analysisResponse.choices[0].message.content;
        const analysis = JSON.parse(typeof analysisContent === 'string' ? analysisContent : '{}');

        return {
          title: input.title || 'Custom Prompt',
          analysis,
          isValid: analysis.overall_score >= 7,
          recommendation: analysis.overall_score >= 9 
            ? "✅ EXCELLENT - Ready for professional video generation"
            : analysis.overall_score >= 7
            ? "⚠️ GOOD - Minor improvements recommended before generation"
            : analysis.overall_score >= 5
            ? "❌ MEDIOCRE - Significant improvements required"
            : "🚫 POOR - Complete reconstruction needed"
        };
      }),

    validateBatchPrompts: publicProcedure
      .input(z.object({
        prompts: z.array(z.object({
          title: z.string(),
          promptText: z.string(),
        })),
      }))
      .mutation(async ({ input }) => {
        const requiredSections = ['tone_and_atmosphere', 'shot', 'subject', 'action', 'scene', 'cinematography', 'audio', 'visual_rules', 'technical_specifications'];
        const results = [];

        // Process each prompt
        for (let i = 0; i < input.prompts.length; i++) {
          const { title, promptText } = input.prompts[i];
          
          try {
            // Parse JSON
            let promptJson;
            try {
              promptJson = JSON.parse(promptText);
            } catch (error) {
              results.push({
                index: i,
                title,
                success: false,
                error: 'Invalid JSON format',
                analysis: null,
              });
              continue;
            }

            // Validate structure
            const missingSections = requiredSections.filter(section => !promptJson[section]);
            if (missingSections.length > 0) {
              results.push({
                index: i,
                title,
                success: false,
                error: `Missing sections: ${missingSections.join(', ')}`,
                analysis: null,
              });
              continue;
            }

            // Run ultra-strict evaluation
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
- Generic sequences (\"Sequence 2\", \"Product showcase\", \"Display features\"): -5 points
- Narrative incoherence between sequences: -3 points
- Vague technical terms (\"good lighting\", \"nice camera\"): -3 points
- Missing emotional progression across sequences: -2 points
- Visual or narrative clichés: -2 points
- Imprecise timing (no seconds specified): -2 points
- Incomplete technical specifications: -3 points

ONLY award 9-10/10 if ALL criteria are met:
✓ Cinematic mastery in camera work (specific lens, aperture, movement)
✓ Precise timing down to the second for each action
✓ Clear emotional storytelling arc across all sequences
✓ Complete technical specifications (resolution, fps, color space, codec)
✓ Creative originality (no generic \"showcase\" language)
✓ Professional-grade audio design with specific sync points
✓ Perfect visual continuity and realism rules
✓ Specific subject details (age, expression, wardrobe evolution)

Be RUTHLESSLY CRITICAL. Excellence is the ONLY acceptable standard.`
                },
                {
                  role: "user",
                  content: `Analyze this custom video prompt with EXTREME RIGOR:\n\nTitle: ${title}\n\nPrompt JSON:\n${JSON.stringify(promptJson, null, 2)}\n\nEVALUATE EACH OF THE 8 SECTIONS:\n1. Shot (camera_system, lens, composition, movement) - 20% weight\n2. Subject (identity, appearance, expression, evolution) - 15% weight\n3. Action (precise timing, specific movements, camera tracking) - 25% weight\n4. Scene (location, time, weather, lighting, atmosphere) - 10% weight\n5. Cinematography (camera settings, color, stabilization) - 15% weight\n6. Audio (ambient, music, voice-over, sync) - 10% weight\n7. Visual Rules (realism, continuity) - 5% weight\n8. Technical Specifications (resolution, fps, codec, duration) - 0% (binary: complete or -3 penalty)\n\nAPPLY AUTOMATIC PENALTIES STRICTLY. Start from 5/10 baseline and justify every point above that.\n\nProvide JSON with:\n- overall_score (0-10, weighted average with penalties applied)\n- overall_assessment (harsh critical evaluation)\n- section_scores (object with scores 0-10 for each of 8 sections)\n- priority_improvements (array of critical issues to fix)\n- penalties_applied (array of penalty descriptions with point deductions)`
                }
              ],
              response_format: { type: "json_object" }
            });

            const analysisContent = analysisResponse.choices[0].message.content;
            const analysis = JSON.parse(typeof analysisContent === 'string' ? analysisContent : '{}');

            results.push({
              index: i,
              title,
              success: true,
              error: null,
              analysis,
              needsOptimization: analysis.overall_score < 7,
            });
          } catch (error: any) {
            results.push({
              index: i,
              title,
              success: false,
              error: error.message || 'Unknown error',
              analysis: null,
            });
          }
        }

        // Calculate summary statistics
        const successfulValidations = results.filter(r => r.success);
        const avgScore = successfulValidations.length > 0
          ? successfulValidations.reduce((sum, r) => sum + (r.analysis?.overall_score || 0), 0) / successfulValidations.length
          : 0;
        const needsOptimization = results.filter(r => r.needsOptimization).length;
        const goldCount = results.filter(r => r.success && r.analysis?.overall_score >= 9).length;
        const silverCount = results.filter(r => r.success && r.analysis?.overall_score >= 7 && r.analysis?.overall_score < 9).length;
        const bronzeCount = results.filter(r => r.success && r.analysis?.overall_score >= 5 && r.analysis?.overall_score < 7).length;
        const poorCount = results.filter(r => r.success && r.analysis?.overall_score < 5).length;

        return {
          results,
          summary: {
            total: input.prompts.length,
            successful: successfulValidations.length,
            failed: input.prompts.length - successfulValidations.length,
            averageScore: Math.round(avgScore * 10) / 10,
            needsOptimization,
            distribution: {
              gold: goldCount,
              silver: silverCount,
              bronze: bronzeCount,
              poor: poorCount,
            },
          },
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
              content: `Analyze this video marketing prompt with EXTREME RIGOR:\n\nTitle: ${promptData.title}\nSector: ${promptData.industrySector}\n\nPrompt JSON:\n${JSON.stringify(promptJson, null, 2)}\n\nEVALUATE EACH OF THE 9 SECTIONS:\n1. Tone & Atmosphere (primary_tone, mood_keywords, emotional_arc, coherence) - 15% weight\n2. Shot (camera_system, lens, composition, movement) - 18% weight\n3. Subject (identity, appearance, expression, evolution) - 12% weight\n4. Action (precise timing, specific movements, camera tracking) - 20% weight\n5. Scene (location, time, weather, lighting, atmosphere) - 10% weight\n6. Cinematography (camera settings, color, stabilization) - 12% weight\n7. Audio (ambient, music, voice-over, sync) - 8% weight\n8. Visual Rules (realism, continuity) - 5% weight\n9. Technical Specifications (resolution, fps, codec, duration) - 0% (binary: complete or -3 penalty)\n\nTONE & ATMOSPHERE EVALUATION CRITERIA:\n- Is the primary tone clearly defined and appropriate for the sector?\n- Are mood keywords specific and coherent with the tone?\n- Does the emotional arc create a compelling narrative progression?\n- Is the tone consistent across ALL other sections (cinematography, audio, scene)?\n- Penalty -3 points if tone is generic or missing\n- Penalty -2 points if tone conflicts with other sections\n\nAPPLY AUTOMATIC PENALTIES STRICTLY. Start from 5/10 baseline and justify every point above that.\n\nProvide JSON with:\n- overall_score (0-10, weighted average with penalties applied)\n- overall_assessment (harsh critical evaluation)\n- section_scores (object with scores 0-10 for each of 9 sections, including tone_and_atmosphere)\n- section_analysis (object with strengths/weaknesses/suggestions arrays for each of 9 sections)\n- priority_improvements (array of critical issues to fix)\n- penalties_applied (array of penalty descriptions with point deductions)`
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
              content: `OPTIMIZE THIS PROMPT TO CINEMATIC EXCELLENCE (target 9-10/10):\n\nOriginal Prompt:\n${JSON.stringify(originalPrompt, null, 2)}\n\nAPPLY ALL MANDATORY IMPROVEMENTS:\n✓ ADD/OPTIMIZE Tone & Atmosphere section (primary_tone, secondary_tone, mood_keywords, emotional_arc)\n✓ Ensure tone coherence across ALL sections (cinematography, audio, scene must match tone)\n✓ Remove ALL generic language ("showcase", "display", "Sequence X")\n✓ Add precise timing in seconds for every action\n✓ Create clear emotional progression aligned with emotional_arc\n✓ Specify exact camera equipment and settings that support the tone\n✓ Detail lighting setup that reinforces the mood\n✓ Define camera movements that match the tone (smooth for serene, dynamic for energetic)\n✓ Add layered audio design that enhances the atmosphere\n✓ Ensure perfect visual continuity\n✓ Maintain exact JSON structure with all 9 sections (including tone_and_atmosphere as first section)\n\nTONE & ATMOSPHERE OPTIMIZATION:\n- Choose primary_tone appropriate for the product/sector\n- Add 3-5 specific mood_keywords that support the tone\n- Define emotional_arc with clear progression (e.g., "Calm → Intrigued → Inspired")\n- Ensure ALL other sections align with this tone\n\nReturn ONLY the complete optimized JSON with 9 sections (no markdown, no explanations).`
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

  library: router({
    // User Prompts Management
    savePrompt: protectedProcedure
      .input(z.object({
        title: z.string(),
        promptJson: z.any(),
        folderId: z.number().nullable().optional(),
        tags: z.string().optional(),
        qualityScore: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { saveUserPrompt } = await import("./db");
        await saveUserPrompt({
          userId: ctx.user.id,
          title: input.title,
          promptJson: JSON.stringify(input.promptJson),
          folderId: input.folderId,
          tags: input.tags || "",
          qualityScore: input.qualityScore,
        });
        return { success: true };
      }),
    
    getMyPrompts: protectedProcedure
      .input(z.object({ folderId: z.number().nullable().optional() }).optional())
      .query(async ({ ctx, input }) => {
        const { getUserPrompts } = await import("./db");
        const prompts = await getUserPrompts(ctx.user.id, input?.folderId);
        return prompts.map(p => ({
          ...p,
          promptJson: JSON.parse(p.promptJson),
        }));
      }),
    
    getPromptById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const { getUserPromptById } = await import("./db");
        const prompt = await getUserPromptById(input.id, ctx.user.id);
        if (!prompt) return null;
        return {
          ...prompt,
          promptJson: JSON.parse(prompt.promptJson),
        };
      }),
    
    updatePrompt: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        promptJson: z.any().optional(),
        folderId: z.number().nullable().optional(),
        tags: z.string().optional(),
        qualityScore: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { updateUserPrompt } = await import("./db");
        const data: any = {};
        if (input.title) data.title = input.title;
        if (input.promptJson) data.promptJson = JSON.stringify(input.promptJson);
        if (input.folderId !== undefined) data.folderId = input.folderId;
        if (input.tags !== undefined) data.tags = input.tags;
        if (input.qualityScore !== undefined) data.qualityScore = input.qualityScore;
        await updateUserPrompt(input.id, ctx.user.id, data);
        return { success: true };
      }),
    
    deletePrompt: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { deleteUserPrompt } = await import("./db");
        await deleteUserPrompt(input.id, ctx.user.id);
        return { success: true };
      }),
    
    searchPrompts: protectedProcedure
      .input(z.object({ searchTerm: z.string() }))
      .query(async ({ ctx, input }) => {
        const { searchUserPrompts } = await import("./db");
        const prompts = await searchUserPrompts(ctx.user.id, input.searchTerm);
        return prompts.map(p => ({
          ...p,
          promptJson: JSON.parse(p.promptJson),
        }));
      }),
    
    // Folders Management
    createFolder: protectedProcedure
      .input(z.object({
        name: z.string(),
        parentFolderId: z.number().nullable().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { createFolder } = await import("./db");
        await createFolder({
          userId: ctx.user.id,
          name: input.name,
          parentFolderId: input.parentFolderId,
        });
        return { success: true };
      }),
    
    getMyFolders: protectedProcedure.query(async ({ ctx }) => {
      const { getUserFolders } = await import("./db");
      return getUserFolders(ctx.user.id);
    }),
    
    updateFolder: protectedProcedure
      .input(z.object({ id: z.number(), name: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const { updateFolder } = await import("./db");
        await updateFolder(input.id, ctx.user.id, input.name);
        return { success: true };
      }),
    
    deleteFolder: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { deleteFolder } = await import("./db");
        await deleteFolder(input.id, ctx.user.id);
        return { success: true };
      }),
    
    // Sharing
    sharePrompt: protectedProcedure
      .input(z.object({
        promptId: z.number(),
        sharedWithUserId: z.number(),
        permission: z.enum(["view", "edit"]).default("view"),
      }))
      .mutation(async ({ ctx, input }) => {
        const { sharePrompt } = await import("./db");
        await sharePrompt({
          promptId: input.promptId,
          ownerId: ctx.user.id,
          sharedWithUserId: input.sharedWithUserId,
          permission: input.permission,
        });
        return { success: true };
      }),

    shareByEmail: protectedProcedure
      .input(z.object({
        promptId: z.number(),
        sharedWithEmail: z.string().email(),
        permission: z.enum(["view", "edit"]).default("view"),
      }))
      .mutation(async ({ ctx, input }) => {
        const { getUserByEmail, sharePrompt } = await import("./db");
        const targetUser = await getUserByEmail(input.sharedWithEmail);
        if (!targetUser) {
          throw new Error("User not found with that email");
        }
        await sharePrompt({
          promptId: input.promptId,
          ownerId: ctx.user.id,
          sharedWithUserId: targetUser.id,
          permission: input.permission,
        });
        return { success: true };
      }),
    
    getSharedWithMe: protectedProcedure.query(async ({ ctx }) => {
      const { getSharedPrompts } = await import("./db");
      return getSharedPrompts(ctx.user.id);
    }),

    getSharedWith: protectedProcedure
      .input(z.object({ promptId: z.number() }))
      .query(async ({ input }) => {
        const { getPromptShares } = await import("./db");
        return getPromptShares(input.promptId);
      }),

    removeShare: protectedProcedure
      .input(z.object({
        promptId: z.number(),
        sharedWithUserId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { removeShare } = await import("./db");
        await removeShare(input.promptId, input.sharedWithUserId);
        return { success: true };
      }),
    
    // Comments
    addComment: protectedProcedure
      .input(z.object({ promptId: z.number(), commentText: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const { addComment } = await import("./db");
        await addComment({
          promptId: input.promptId,
          userId: ctx.user.id,
          commentText: input.commentText,
        });
        return { success: true };
      }),
    
    getComments: protectedProcedure
      .input(z.object({ promptId: z.number() }))
      .query(async ({ input }) => {
        const { getPromptComments } = await import("./db");
        return getPromptComments(input.promptId);
      }),
    
    // Versions
    saveVersion: protectedProcedure
      .input(z.object({
        promptId: z.number(),
        promptJson: z.any(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { getPromptVersions, savePromptVersion } = await import("./db");
        const versions = await getPromptVersions(input.promptId);
        const nextVersion = versions.length + 1;
        await savePromptVersion({
          promptId: input.promptId,
          versionNumber: nextVersion,
          promptJson: JSON.stringify(input.promptJson),
          createdBy: ctx.user.id,
        });
        return { success: true };
      }),
    
    getVersions: protectedProcedure
      .input(z.object({ promptId: z.number() }))
      .query(async ({ input }) => {
        const { getPromptVersions } = await import("./db");
        const versions = await getPromptVersions(input.promptId);
        return versions.map(v => ({
          ...v,
          promptJson: JSON.parse((v as any).promptVersions.promptJson),
        }));
      }),

    // Bulk Operations
    bulkMoveToFolder: protectedProcedure
      .input(z.object({
        promptIds: z.array(z.number()),
        folderId: z.number().nullable(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { bulkUpdatePrompts } = await import("./db");
        await bulkUpdatePrompts(input.promptIds, ctx.user.id, { folderId: input.folderId });
        return { success: true, count: input.promptIds.length };
      }),

    bulkAddTags: protectedProcedure
      .input(z.object({
        promptIds: z.array(z.number()),
        tags: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { bulkAddTagsToPrompts } = await import("./db");
        await bulkAddTagsToPrompts(input.promptIds, ctx.user.id, input.tags);
        return { success: true, count: input.promptIds.length };
      }),

    bulkDelete: protectedProcedure
      .input(z.object({
        promptIds: z.array(z.number()),
      }))
      .mutation(async ({ ctx, input }) => {
        const { bulkDeletePrompts } = await import("./db");
        await bulkDeletePrompts(input.promptIds, ctx.user.id);
        return { success: true, count: input.promptIds.length };
      }),
  }),
  
  templates: router({
    list: publicProcedure.query(async () => {
      const { getAllTemplates } = await import("./db");
      const templates = await getAllTemplates();
      return templates.map(t => ({
        ...t,
        templateJson: JSON.parse(t.templateJson),
      }));
    }),
    
    getByIndustry: publicProcedure
      .input(z.object({ industry: z.string() }))
      .query(async ({ input }) => {
        const { getTemplatesByIndustry } = await import("./db");
        const templates = await getTemplatesByIndustry(input.industry);
        return templates.map(t => ({
          ...t,
          templateJson: JSON.parse(t.templateJson),
        }));
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const { getTemplateById } = await import("./db");
        const template = await getTemplateById(input.id);
        if (!template) return null;
        return {
          ...template,
          templateJson: JSON.parse(template.templateJson),
        };
      }),
  }),

  customizer: router({
    generatePrompt: publicProcedure
      .input(z.object({
        mode: z.enum(["modify", "create"]),
        basePromptId: z.number().optional(),
        promptName: z.string(),
        videoObjectives: z.string(),
        userInputs: z.object({
          tone: z.object({
            primary: z.string(),
            moodKeywords: z.array(z.string()),
            emotionalArc: z.string(),
            appearance: z.string(),
            clothing: z.string(),
            secondary: z.string().optional(),
            visualStyle: z.string().optional(),
          }),
          character: z.object({
            age: z.string().optional(),
            gender: z.string().optional(),
            ethnicity: z.string().optional(),
            appearance: z.string().optional(),
            clothing: z.string().optional(),
          }).optional(),
          location: z.object({
            location: z.string().optional(),
            time: z.string().optional(),
            weather: z.string().optional(),
            atmosphere: z.string().optional(),
          }).optional(),
          cinematic: z.object({
            shotType: z.string().optional(),
            angle: z.string().optional(),
            framing: z.string().optional(),
            movement: z.string().optional(),
          }).optional(),
          action: z.object({
            movements: z.string().optional(),
            actions: z.string().optional(),
            sequencesTiming: z.string().optional(),
          }).optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        // Build LLM prompt for professional video production
        const systemPrompt = `You are a professional video production expert with deep knowledge of Sora 2, Veo 3, and Runway Gen-3 APIs. Generate a complete, production-ready JSON video prompt following industry best practices.

Your task:
1. Use the provided mandatory tone & atmosphere fields exactly as given
2. Enhance or generate professional defaults for optional fields (character, location, cinematic, action) if not provided
3. Generate complete Equipment section (camera model, lens specs, technical requirements)
4. Generate complete Lighting section (setup, color temperature, mood, direction)
5. Generate complete Audio section (music style, sound effects, dialogue notes)
6. Generate complete Technical Specifications (resolution, fps, codec, aspect ratio)

Output must be a valid JSON object with these exact sections:
- tone
- shot
- subject
- action
- scene
- cinematography
- audio
- visual
- technical

Ensure all generated content is professional, specific, and optimized for high-quality video generation.`;

        const userPrompt = `Video Objectives: ${input.videoObjectives}

User-Provided Information:

Tone & Atmosphere (Mandatory):
- Primary Tone: ${input.userInputs.tone.primary}
- Mood Keywords: ${input.userInputs.tone.moodKeywords.join(", ")}
- Emotional Arc: ${input.userInputs.tone.emotionalArc}
- Appearance: ${input.userInputs.tone.appearance}
- Clothing: ${input.userInputs.tone.clothing}
${input.userInputs.tone.secondary ? `- Secondary Tone: ${input.userInputs.tone.secondary}` : ""}
${input.userInputs.tone.visualStyle ? `- Visual Style Reference: ${input.userInputs.tone.visualStyle}` : ""}

${input.userInputs.character ? `Character (Partial):
${input.userInputs.character.age ? `- Age: ${input.userInputs.character.age}` : ""}
${input.userInputs.character.gender ? `- Gender: ${input.userInputs.character.gender}` : ""}
${input.userInputs.character.ethnicity ? `- Ethnicity: ${input.userInputs.character.ethnicity}` : ""}
${input.userInputs.character.appearance ? `- Appearance: ${input.userInputs.character.appearance}` : ""}
${input.userInputs.character.clothing ? `- Clothing: ${input.userInputs.character.clothing}` : ""}
` : "Character: Not provided - generate professional defaults"}

${input.userInputs.location ? `Location & Scene (Partial):
${input.userInputs.location.location ? `- Location: ${input.userInputs.location.location}` : ""}
${input.userInputs.location.time ? `- Time: ${input.userInputs.location.time}` : ""}
${input.userInputs.location.weather ? `- Weather: ${input.userInputs.location.weather}` : ""}
${input.userInputs.location.atmosphere ? `- Atmosphere: ${input.userInputs.location.atmosphere}` : ""}
` : "Location & Scene: Not provided - generate professional defaults"}

${input.userInputs.cinematic ? `Cinematic Style (Partial):
${input.userInputs.cinematic.shotType ? `- Shot Type: ${input.userInputs.cinematic.shotType}` : ""}
${input.userInputs.cinematic.angle ? `- Angle: ${input.userInputs.cinematic.angle}` : ""}
${input.userInputs.cinematic.framing ? `- Framing: ${input.userInputs.cinematic.framing}` : ""}
${input.userInputs.cinematic.movement ? `- Movement: ${input.userInputs.cinematic.movement}` : ""}
` : "Cinematic Style: Not provided - generate professional defaults"}

${input.userInputs.action ? `Action & Sequences (Partial):
${input.userInputs.action.movements ? `- Movements: ${input.userInputs.action.movements}` : ""}
${input.userInputs.action.actions ? `- Actions: ${input.userInputs.action.actions}` : ""}
${input.userInputs.action.sequencesTiming ? `- Sequences Timing: ${input.userInputs.action.sequencesTiming}` : ""}
` : "Action & Sequences: Not provided - generate professional defaults"}

Generate a complete, professional JSON video prompt.`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "video_prompt",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  tone: {
                    type: "object",
                    properties: {
                      primary_tone: { type: "string" },
                      secondary_tone: { type: "string" },
                      mood_keywords: { type: "array", items: { type: "string" } },
                      emotional_arc: { type: "string" },
                      visual_style_reference: { type: "string" },
                    },
                    required: ["primary_tone", "mood_keywords", "emotional_arc"],
                    additionalProperties: false,
                  },
                  shot: {
                    type: "object",
                    properties: {
                      shot_type: { type: "string" },
                      angle: { type: "string" },
                      framing: { type: "string" },
                      movement: { type: "string" },
                    },
                    required: ["shot_type", "angle", "framing", "movement"],
                    additionalProperties: false,
                  },
                  subject: {
                    type: "object",
                    properties: {
                      age: { type: "string" },
                      gender: { type: "string" },
                      ethnicity: { type: "string" },
                      appearance: { type: "string" },
                      clothing: { type: "string" },
                    },
                    required: ["age", "gender", "ethnicity", "appearance", "clothing"],
                    additionalProperties: false,
                  },
                  action: {
                    type: "object",
                    properties: {
                      movements: { type: "string" },
                      actions: { type: "string" },
                      sequences_timing: { type: "string" },
                    },
                    required: ["movements", "actions", "sequences_timing"],
                    additionalProperties: false,
                  },
                  scene: {
                    type: "object",
                    properties: {
                      location: { type: "string" },
                      time: { type: "string" },
                      weather: { type: "string" },
                      atmosphere: { type: "string" },
                    },
                    required: ["location", "time", "weather", "atmosphere"],
                    additionalProperties: false,
                  },
                  cinematography: {
                    type: "object",
                    properties: {
                      camera: { type: "string" },
                      lens: { type: "string" },
                      technical_specs: { type: "string" },
                    },
                    required: ["camera", "lens", "technical_specs"],
                    additionalProperties: false,
                  },
                  audio: {
                    type: "object",
                    properties: {
                      music: { type: "string" },
                      sound_effects: { type: "string" },
                      dialogue: { type: "string" },
                    },
                    required: ["music", "sound_effects", "dialogue"],
                    additionalProperties: false,
                  },
                  visual: {
                    type: "object",
                    properties: {
                      lighting_setup: { type: "string" },
                      color_temperature: { type: "string" },
                      mood: { type: "string" },
                    },
                    required: ["lighting_setup", "color_temperature", "mood"],
                    additionalProperties: false,
                  },
                  technical: {
                    type: "object",
                    properties: {
                      resolution: { type: "string" },
                      fps: { type: "string" },
                      codec: { type: "string" },
                      aspect_ratio: { type: "string" },
                    },
                    required: ["resolution", "fps", "codec", "aspect_ratio"],
                    additionalProperties: false,
                  },
                },
                required: ["tone", "shot", "subject", "action", "scene", "cinematography", "audio", "visual", "technical"],
                additionalProperties: false,
              },
            },
          },
        });

        const content = response.choices[0].message.content;
        const generatedPrompt = JSON.parse(typeof content === 'string' ? content : JSON.stringify(content));
        
        return {
          name: input.promptName,
          objectives: input.videoObjectives,
          prompt: generatedPrompt,
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
