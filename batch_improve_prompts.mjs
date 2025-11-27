import { invokeLLM } from './server/_core/llm.ts';
import fs from 'fs';

const promptNumbers = [5,6,7,8,10,11,12,13,14,15,16,17,18,19,20,22,24,26,27,29,30,31,33,34,37,38,39,40,41,42,44,45,46,47,48,49,50];

const results = [];

console.log(`Starting batch improvement of ${promptNumbers.length} prompts...`);

for (const num of promptNumbers) {
  const paddedNum = String(num).padStart(2, '0');
  const filePath = `/home/ubuntu/prompt_${paddedNum}.json`;
  
  try {
    console.log(`\n[${results.length + 1}/${promptNumbers.length}] Processing prompt #${num}...`);
    
    const promptData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const promptJson = typeof promptData.promptJson === 'string' 
      ? JSON.parse(promptData.promptJson) 
      : promptData.promptJson;
    
    const currentSequences = promptJson.action.sequences;
    
    const analysisPrompt = `You are an expert video marketing creative director.

PROMPT: #${num} - ${promptData.title}
Sector: ${promptData.industrySector}
Style: ${promptData.visualStyle}
Scenario: ${promptData.scenarioType}

CURRENT SEQUENCES:
${JSON.stringify(currentSequences, null, 2)}

TASK: Analyze and improve these sequences.

1. Evaluate coherence (1-10): Are sequences 2 and 3 generic placeholders or product-specific?
2. Identify main issues (1-2 sentences)
3. Generate improved sequence 2 (8-14s) with specific product-related actions
4. Generate improved sequence 3 (14-20s) with earned, memorable conclusion
5. Provide camera movements for both
6. Explain improvements (2-3 sentences)
7. Project new coherence score (1-10)

Focus on: specificity, sensory details, natural progression, authentic emotions.
Avoid: generic marketing language like "demonstrates benefits" or "showcases expertise".`;

    const response = await invokeLLM({
      messages: [
        { role: 'system', content: 'You are an expert video marketing analyst.' },
        { role: 'user', content: analysisPrompt }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "sequence_improvement",
          strict: true,
          schema: {
            type: "object",
            properties: {
              prompt_number: { type: "number" },
              prompt_title: { type: "string" },
              coherence_score_before: { type: "number" },
              main_issues: { type: "string" },
              sequence_2_improved: { type: "string" },
              sequence_2_camera: { type: "string" },
              sequence_3_improved: { type: "string" },
              sequence_3_camera: { type: "string" },
              improvement_rationale: { type: "string" },
              coherence_score_after: { type: "number" }
            },
            required: ["prompt_number", "prompt_title", "coherence_score_before", "main_issues", "sequence_2_improved", "sequence_2_camera", "sequence_3_improved", "sequence_3_camera", "improvement_rationale", "coherence_score_after"],
            additionalProperties: false
          }
        }
      }
    });
    
    const improvement = JSON.parse(response.choices[0].message.content);
    results.push(improvement);
    
    console.log(`✅ Prompt #${num}: ${improvement.coherence_score_before}/10 → ${improvement.coherence_score_after}/10`);
    
  } catch (error) {
    console.error(`❌ Error processing prompt #${num}:`, error.message);
    results.push({
      prompt_number: num,
      error: error.message
    });
  }
}

// Save results
fs.writeFileSync('/home/ubuntu/batch_improvements_results.json', JSON.stringify(results, null, 2));
console.log(`\n✅ Completed! Results saved to /home/ubuntu/batch_improvements_results.json`);
console.log(`Successfully processed: ${results.filter(r => !r.error).length}/${promptNumbers.length}`);

