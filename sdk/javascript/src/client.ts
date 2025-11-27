import {
  SDKConfig,
  GenerateVariationOptions,
  GenerateVariationResult,
  Prompt,
  PromptsListResult,
  APIError,
} from './types';

/**
 * Client SDK pour l'API Prompts Vidéo Marketing
 */
export class PromptsVideoMarketingClient {
  private baseURL: string;
  private apiKey?: string;
  private timeout: number;
  private retries: number;

  /**
   * Crée une nouvelle instance du client SDK
   * @param config Configuration du client
   */
  constructor(config: SDKConfig) {
    this.baseURL = config.baseURL.replace(/\/$/, ''); // Retirer le slash final
    this.apiKey = config.apiKey;
    this.timeout = config.timeout || 30000;
    this.retries = config.retries || 3;
  }

  /**
   * Effectue une requête HTTP avec retry logic
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    attempt = 1
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error: APIError = await response.json().catch(() => ({
          code: 'UNKNOWN_ERROR',
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));

        throw new Error(`API Error [${error.code}]: ${error.message}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      // Retry logic pour les erreurs réseau ou timeout
      if (attempt < this.retries && this.shouldRetry(error)) {
        const delay = Math.pow(2, attempt) * 1000; // Backoff exponentiel
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.request<T>(endpoint, options, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * Détermine si une erreur doit déclencher un retry
   */
  private shouldRetry(error: any): boolean {
    // Retry sur timeout, erreurs réseau, ou erreurs serveur 5xx
    return (
      error.name === 'AbortError' ||
      error.message.includes('network') ||
      error.message.includes('fetch') ||
      error.message.includes('500') ||
      error.message.includes('502') ||
      error.message.includes('503') ||
      error.message.includes('504')
    );
  }

  /**
   * Génère des variations d'un prompt existant
   * @param options Options de génération
   * @returns Résultat avec les variations générées
   */
  async generateVariation(
    options: GenerateVariationOptions
  ): Promise<GenerateVariationResult> {
    const { promptId, variations, count = 1 } = options;

    const response = await this.request<{ result: { data: GenerateVariationResult } }>(
      '/api/trpc/generator.generateVariation',
      {
        method: 'POST',
        body: JSON.stringify({
          promptId,
          variations,
          count,
        }),
      }
    );

    return response.result.data;
  }

  /**
   * Récupère la liste de tous les prompts
   * @returns Liste des prompts disponibles
   */
  async getPrompts(): Promise<PromptsListResult> {
    const response = await this.request<{ result: { data: PromptsListResult } }>(
      '/api/trpc/prompts.list'
    );

    return response.result.data;
  }

  /**
   * Récupère un prompt spécifique par son ID
   * @param id ID du prompt
   * @returns Données du prompt
   */
  async getPromptById(id: number): Promise<Prompt> {
    const response = await this.request<{ result: { data: Prompt } }>(
      `/api/trpc/prompts.getById?id=${id}`
    );

    return response.result.data;
  }

  /**
   * Recherche des prompts par catégorie
   * @param category Catégorie à rechercher
   * @returns Liste des prompts de cette catégorie
   */
  async getPromptsByCategory(category: string): Promise<PromptsListResult> {
    const response = await this.request<{ result: { data: PromptsListResult } }>(
      `/api/trpc/prompts.listByCategory?category=${encodeURIComponent(category)}`
    );

    return response.result.data;
  }
}
