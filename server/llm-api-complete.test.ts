import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('LLM API Documentation - Complete Content', () => {
  const docPath = path.join(__dirname, '../client/src/components/LLMAPIDocumentation.tsx');
  const docContent = fs.readFileSync(docPath, 'utf-8');

  it('should have all 7 tabs defined', () => {
    expect(docContent).toContain('value="overview"');
    expect(docContent).toContain('value="auth"');
    expect(docContent).toContain('value="quickstart"');
    expect(docContent).toContain('value="advanced"');
    expect(docContent).toContain('value="best-practices"');
    expect(docContent).toContain('value="api-ref"');
    expect(docContent).toContain('value="integration"');
  });

  describe('Authentication Tab', () => {
    it('should include API key setup instructions', () => {
      expect(docContent).toContain('Obtain API Keys');
      expect(docContent).toContain('platform.openai.com');
      expect(docContent).toContain('console.cloud.google.com');
      expect(docContent).toContain('runwayml.com/api');
    });

    it('should include environment variables example', () => {
      expect(docContent).toContain('OPENAI_API_KEY');
      expect(docContent).toContain('GOOGLE_CLOUD_API_KEY');
      expect(docContent).toContain('RUNWAY_API_KEY');
      expect(docContent).toContain('.env file');
    });

    it('should include security best practices', () => {
      expect(docContent).toContain('Security Best Practices');
      expect(docContent).toContain('Never expose API keys');
      expect(docContent).toContain('server-side proxies');
      expect(docContent).toContain('Rotate keys regularly');
    });
  });

  describe('Quick Start Tab', () => {
    it('should include Sora 2 example', () => {
      expect(docContent).toContain('OpenAI Sora 2');
      expect(docContent).toContain('import OpenAI');
      expect(docContent).toContain('client.videos.generate');
      expect(docContent).toContain('model: "sora-2"');
    });

    it('should include Veo 3 example', () => {
      expect(docContent).toContain('Google Veo 3');
      expect(docContent).toContain('GoogleGenerativeAI');
      expect(docContent).toContain('model: \'veo-3\'');
    });

    it('should include Runway Gen-3 example', () => {
      expect(docContent).toContain('Runway Gen-3');
      expect(docContent).toContain('import Runway');
      expect(docContent).toContain('model: \'gen3\'');
    });

    it('should show JSON.stringify usage', () => {
      const matches = docContent.match(/JSON\.stringify\(prompt\)/g);
      expect(matches).toBeTruthy();
      expect(matches!.length).toBeGreaterThanOrEqual(3); // At least 3 examples
    });
  });

  describe('Advanced Usage Tab', () => {
    it('should include streaming example', () => {
      expect(docContent).toContain('Streaming Progress Updates');
      expect(docContent).toContain('stream: true');
      expect(docContent).toContain('for await');
      expect(docContent).toContain('chunk.progress');
    });

    it('should include error handling with retry logic', () => {
      expect(docContent).toContain('Error Handling & Retries');
      expect(docContent).toContain('generateVideoWithRetry');
      expect(docContent).toContain('maxRetries');
      expect(docContent).toContain('Exponential backoff');
    });

    it('should include batch processing example', () => {
      expect(docContent).toContain('Batch Processing');
      expect(docContent).toContain('Promise.allSettled');
      expect(docContent).toContain('prompts.map');
    });

    it('should include webhook example', () => {
      expect(docContent).toContain('Webhook Notifications');
      expect(docContent).toContain('webhook_url');
      expect(docContent).toContain('webhook_secret');
      expect(docContent).toContain('x-webhook-signature');
    });
  });

  describe('Best Practices Tab', () => {
    it('should include prompt engineering tips', () => {
      expect(docContent).toContain('Prompt Engineering Tips');
      expect(docContent).toContain('Be Specific with Camera Details');
      expect(docContent).toContain('Include Precise Timing');
      expect(docContent).toContain('Define Emotional Arc');
      expect(docContent).toContain('Use Tone & Atmosphere');
    });

    it('should include performance optimization', () => {
      expect(docContent).toContain('Performance Optimization');
      expect(docContent).toContain('Cache Frequently Used Prompts');
      expect(docContent).toContain('Implement Rate Limiting');
      expect(docContent).toContain('Monitor Usage & Costs');
    });

    it('should include common pitfalls', () => {
      expect(docContent).toContain('Common Pitfalls to Avoid');
      expect(docContent).toContain('Generic descriptions');
      expect(docContent).toContain('Missing timing');
      expect(docContent).toContain('Inconsistent style');
    });

    it('should include code examples for optimization', () => {
      expect(docContent).toContain('promptCache');
      expect(docContent).toContain('Bottleneck');
      expect(docContent).toContain('totalCost');
    });
  });

  describe('API Reference Tab', () => {
    it('should include complete JSON prompt structure', () => {
      expect(docContent).toContain('JSON Prompt Structure');
      expect(docContent).toContain('"shot"');
      expect(docContent).toContain('"subject"');
      expect(docContent).toContain('"action"');
      expect(docContent).toContain('"scene"');
      expect(docContent).toContain('"cinematography"');
      expect(docContent).toContain('"audio"');
      expect(docContent).toContain('"visual_rules"');
      expect(docContent).toContain('"technical_specifications"');
    });

    it('should include API parameters table', () => {
      expect(docContent).toContain('API Parameters');
      expect(docContent).toContain('<table');
      expect(docContent).toContain('prompt');
      expect(docContent).toContain('model');
      expect(docContent).toContain('resolution');
      expect(docContent).toContain('duration');
    });

    it('should include response format example', () => {
      expect(docContent).toContain('Response Format');
      expect(docContent).toContain('"status": "completed"');
      expect(docContent).toContain('"output"');
      expect(docContent).toContain('"usage"');
    });

    it('should include error codes table', () => {
      expect(docContent).toContain('Error Codes');
      expect(docContent).toContain('400');
      expect(docContent).toContain('401');
      expect(docContent).toContain('429');
      expect(docContent).toContain('500');
      expect(docContent).toContain('503');
    });
  });

  describe('Integration Tab', () => {
    it('should include Node.js/TypeScript example', () => {
      expect(docContent).toContain('Node.js / TypeScript');
      expect(docContent).toContain('async function generateVideo');
      expect(docContent).toContain('fs.readFile');
      expect(docContent).toContain('fs.writeFile');
    });

    it('should include Python example', () => {
      expect(docContent).toContain('Python');
      expect(docContent).toContain('def generate_video');
      expect(docContent).toContain('import json');
      expect(docContent).toContain('with open');
    });

    it('should include cURL example', () => {
      expect(docContent).toContain('cURL');
      expect(docContent).toContain('curl https://api.openai.com');
      expect(docContent).toContain('Authorization: Bearer');
      expect(docContent).toContain('jq');
    });

    it('should include Express.js API endpoint', () => {
      expect(docContent).toContain('Express.js API Endpoint');
      expect(docContent).toContain('app.post');
      expect(docContent).toContain('/api/generate-video');
      expect(docContent).toContain('app.listen');
    });

    it('should include production deployment tips', () => {
      expect(docContent).toContain('Production Deployment Tips');
      expect(docContent).toContain('environment-specific API keys');
      expect(docContent).toContain('request queuing');
      expect(docContent).toContain('CDN');
    });
  });

  describe('Code Examples Quality', () => {
    it('should have copy functionality for all code blocks', () => {
      expect(docContent).toContain('handleCopy');
      expect(docContent).toContain('navigator.clipboard.writeText');
      expect(docContent).toContain('CodeBlock');
    });

    it('should have proper syntax highlighting hints', () => {
      expect(docContent).toContain('language-${language}');
      expect(docContent).toContain('language = "javascript"');
      expect(docContent).toContain('language="python"');
      expect(docContent).toContain('language="bash"');
    });

    it('should have at least 10 code examples total', () => {
      const codeBlockMatches = docContent.match(/<CodeBlock/g);
      expect(codeBlockMatches).toBeTruthy();
      expect(codeBlockMatches!.length).toBeGreaterThanOrEqual(10);
    });
  });

  describe('Visual Elements', () => {
    it('should have icons for each tab', () => {
      expect(docContent).toContain('<BookOpen');
      expect(docContent).toContain('<Shield');
      expect(docContent).toContain('<Rocket');
      expect(docContent).toContain('<Zap');
      expect(docContent).toContain('<Lightbulb');
      expect(docContent).toContain('<FileCode');
      expect(docContent).toContain('<Terminal');
    });

    it('should have alerts for important information', () => {
      const alertMatches = docContent.match(/<Alert/g);
      expect(alertMatches).toBeTruthy();
      expect(alertMatches!.length).toBeGreaterThanOrEqual(4);
    });

    it('should have platform comparison cards', () => {
      expect(docContent).toContain('border-indigo-200');
      expect(docContent).toContain('border-purple-200');
      expect(docContent).toContain('border-pink-200');
    });
  });
});
