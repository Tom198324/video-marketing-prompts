import { invokeLLM } from './server/_core/llm.ts';
import fs from 'fs';

const promptData = JSON.parse(fs.readFileSync('/home/ubuntu/prompt3_current_data.json', 'utf-8'));
const marketingObjectives = fs.readFileSync('/home/ubuntu/prompt3_marketing_objectives.md', 'utf-8');
const evaluation = fs.readFileSync('/home/ubuntu/prompt3_coherence_evaluation.md', 'utf-8');

const improvementPrompt = `You are an expert video marketing creative director specializing in food & beverage cinematography.

CONTEXT:
${marketingObjectives}

EVALUATION RESULTS (Score: 4/10):
${evaluation}

CURRENT SEQUENCE 1 (STRONG - KEEP):
${JSON.stringify(promptData.promptJson.action.sequences[0], null, 2)}

TASK:
Generate IMPROVED sequences 2 and 3 that fix the identified problems and create a cohesive coffee-specific narrative.

REQUIREMENTS:
1. **Sequence 2 (8-14s)** must:
   - Build naturally from the first sip moment
   - Show specific coffee-related actions (not generic "benefits")
   - Deepen the sensory experience (visual, tactile, auditory)
   - Reveal craftsmanship/quality through specific visuals
   - Maintain intimate, authentic tone

2. **Sequence 3 (14-20s)** must:
   - Provide a satisfying, earned conclusion
   - Include specific coffee-related final actions
   - Create memorable visual closure
   - Convey genuine contentment (not performative)
   - Leave lasting impression

CREATIVE GUIDELINES:
- Be highly specific and visual (not abstract)
- Focus on authentic coffee ritual moments
- Incorporate sensory details (steam, texture, warmth, sound)
- Show craftsmanship through details (crema, pour, cup quality)
- Create emotional crescendo that feels natural
- Avoid generic marketing language

OUTPUT FORMAT (JSON):
{
  "sequence_2": {
    "timing": "8-14 seconds",
    "primary_motion": "[Detailed, specific action description]",
    "camera_follows": "[Camera movement description]"
  },
  "sequence_3": {
    "timing": "14-20 seconds",
    "primary_motion": "[Detailed, specific action description]",
    "camera_follows": "[Camera movement description]"
  },
  "creative_rationale": "[Brief explanation of how these sequences fix the problems and achieve the objectives]"
}`;

const response = await invokeLLM({
  messages: [
    { role: 'system', content: 'You are a creative director specializing in cinematic food & beverage advertising.' },
    { role: 'user', content: improvementPrompt }
  ],
  response_format: {
    type: "json_schema",
    json_schema: {
      name: "sequence_improvements",
      strict: true,
      schema: {
        type: "object",
        properties: {
          sequence_2: {
            type: "object",
            properties: {
              timing: { type: "string" },
              primary_motion: { type: "string" },
              camera_follows: { type: "string" }
            },
            required: ["timing", "primary_motion", "camera_follows"],
            additionalProperties: false
          },
          sequence_3: {
            type: "object",
            properties: {
              timing: { type: "string" },
              primary_motion: { type: "string" },
              camera_follows: { type: "string" }
            },
            required: ["timing", "primary_motion", "camera_follows"],
            additionalProperties: false
          },
          creative_rationale: { type: "string" }
        },
        required: ["sequence_2", "sequence_3", "creative_rationale"],
        additionalProperties: false
      }
    }
  }
});

const improvements = JSON.parse(response.choices[0].message.content);
console.log(JSON.stringify(improvements, null, 2));

fs.writeFileSync('/home/ubuntu/prompt3_improved_sequences.json', JSON.stringify(improvements, null, 2));
