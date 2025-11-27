/**
 * Configuration du client SDK
 */
export interface SDKConfig {
  /** URL de base de l'API (ex: https://votre-site.manus.space) */
  baseURL: string;
  /** Clé API pour l'authentification (optionnel) */
  apiKey?: string;
  /** Timeout en millisecondes (défaut: 30000) */
  timeout?: number;
  /** Nombre de tentatives en cas d'échec (défaut: 3) */
  retries?: number;
}

/**
 * Paramètres de variation pour la génération
 */
export interface VariationParams {
  /** Modifier le personnage (âge, genre, apparence) */
  subject?: boolean;
  /** Modifier le lieu et la scène */
  location?: boolean;
  /** Modifier le style cinématographique */
  style?: boolean;
  /** Modifier l'équipement (caméra, objectif) */
  equipment?: boolean;
  /** Modifier l'éclairage */
  lighting?: boolean;
  /** Modifier les actions et timing */
  action?: boolean;
  /** Modifier l'audio */
  audio?: boolean;
  /** Modifier les spécifications techniques */
  technical?: boolean;
}

/**
 * Options pour la génération de variations
 */
export interface GenerateVariationOptions {
  /** ID du prompt source */
  promptId: number;
  /** Paramètres à varier */
  variations: VariationParams;
  /** Nombre de variations à générer (1-5) */
  count?: number;
}

/**
 * Structure d'un prompt JSON
 */
export interface PromptData {
  shot: {
    camera_system: string;
    lens: string;
    composition: string;
    camera_movement: string;
    [key: string]: any;
  };
  subject: {
    identity: string;
    appearance: string;
    wardrobe: string;
    expression: string;
    [key: string]: any;
  };
  action: Array<{
    timing: string;
    primary_movement: string;
    camera_follow: string;
  }>;
  scene: {
    location: string;
    time_of_day: string;
    environment: string;
    weather: string;
    [key: string]: any;
  };
  cinematography: {
    lighting: {
      source: string;
      quality: string;
      temperature: string;
      key_fill_ratio: string;
    };
    depth_of_field: string;
    [key: string]: any;
  };
  audio: {
    ambient_sound: string;
    foley: string;
    music: string;
    [key: string]: any;
  };
  visual_rules: {
    realism: string;
    continuity: string;
    temporal_coherence: string;
    [key: string]: any;
  };
  technical_specifications: {
    resolution: string;
    color_space: string;
    bit_depth: string;
    output_quality: string;
    duration: string;
    [key: string]: any;
  };
}

/**
 * Variation générée
 */
export interface GeneratedVariation {
  /** Identifiant unique de la variation */
  id: string;
  /** Données JSON du prompt varié */
  data: PromptData;
}

/**
 * Résultat de la génération de variations
 */
export interface GenerateVariationResult {
  /** Liste des variations générées */
  variations: GeneratedVariation[];
  /** Prompt original */
  original: PromptData;
}

/**
 * Informations sur un prompt
 */
export interface Prompt {
  /** ID du prompt */
  id: number;
  /** Titre du prompt */
  title: string;
  /** Catégorie */
  category: string;
  /** Données JSON complètes */
  promptJson: string;
}

/**
 * Liste de prompts
 */
export interface PromptsListResult {
  /** Liste des prompts */
  prompts: Prompt[];
  /** Nombre total de prompts */
  total: number;
}

/**
 * Erreur API
 */
export interface APIError {
  /** Code d'erreur */
  code: string;
  /** Message d'erreur */
  message: string;
  /** Détails supplémentaires */
  details?: any;
}
