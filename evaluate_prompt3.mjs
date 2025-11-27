import { invokeLLM } from './server/_core/llm.ts';
import fs from 'fs';

const promptData = JSON.parse(fs.readFileSync('/home/ubuntu/prompt3_current_data.json', 'utf-8'));
const marketingObjectives = fs.readFileSync('/home/ubuntu/prompt3_marketing_objectives.md', 'utf-8');

const evaluationPrompt = `You are an expert in video marketing and narrative coherence analysis. 

CONTEXT:
${marketingObjectives}

CURRENT SEQUENCES TO EVALUATE:
${JSON.stringify(promptData.promptJson.action.sequences, null, 2)}

TASK:
Evaluate the narrative coherence of these 3 sequences (0-8s, 8-14s, 14-20s) for the Premium Artisan Coffee prompt.

Analyze:
1. **Narrative Progression**: Do the sequences build upon each other logically and emotionally?
2. **Specificity**: Are the actions specific to coffee experience, or generic placeholders?
3. **Emotional Arc**: Does the sequence create the desired emotional journey (anticipation → experience → satisfaction)?
4. **Marketing Alignment**: Do the sequences effectively serve the marketing objectives?
5. **Creative Differentiation**: Are the sequences memorable and distinctive, or generic?
6. **Sensory Engagement**: Do the sequences evoke multi-sensory coffee experience?

Provide:
- **Coherence Score**: Rate from 1-10 (10 = perfect coherence)
- **Detailed Analysis**: For each sequence, identify strengths and weaknesses
- **Specific Issues**: List concrete problems that undermine the narrative
- **Impact Assessment**: How do these issues affect marketing effectiveness?

Be rigorous and specific in your evaluation.`;

const response = await invokeLLM({
  messages: [
    { role: 'system', content: 'You are an expert video marketing analyst specializing in narrative coherence and emotional storytelling.' },
    { role: 'user', content: evaluationPrompt }
  ]
});

const evaluation = response.choices[0].message.content;
console.log(evaluation);

fs.writeFileSync('/home/ubuntu/prompt3_coherence_evaluation.md', evaluation);
