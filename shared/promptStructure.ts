/**
 * Video Prompt Structure Constants
 * Defines the 9-section methodology for video marketing prompts
 */

export const PROMPT_SECTIONS = [
  "tone_and_atmosphere",
  "shot",
  "subject",
  "action",
  "scene",
  "cinematography",
  "audio",
  "visual_rules",
  "technical"
] as const;

export type PromptSection = typeof PROMPT_SECTIONS[number];

/**
 * Tone & Atmosphere Section Structure
 */
export interface ToneAndAtmosphere {
  primary_tone: string;           // Main emotional tone (e.g., "Cinematic", "Luxury", "Energetic")
  secondary_tone?: string;         // Supporting tone (e.g., "Melancholic", "Playful")
  mood_keywords: string[];         // List of mood descriptors (e.g., ["warm", "nostalgic", "intimate"])
  emotional_arc?: string;          // Emotional progression (e.g., "Calm → Inspired → Triumphant")
  visual_style_reference?: string; // Style reference (e.g., "Film noir inspired", "Wes Anderson aesthetic")
}

/**
 * Complete Prompt Structure (9 sections)
 */
export interface VideoPrompt {
  tone_and_atmosphere: ToneAndAtmosphere;
  shot: {
    camera_angle: string;
    camera_movement: string;
    framing: string;
    [key: string]: any;
  };
  subject: {
    main_subject: string;
    subject_details: string;
    [key: string]: any;
  };
  action: {
    primary_action: string;
    timing: string;
    [key: string]: any;
  };
  scene: {
    location: string;
    environment: string;
    [key: string]: any;
  };
  cinematography: {
    lighting: string;
    color_palette: string;
    [key: string]: any;
  };
  audio: {
    music: string;
    sound_effects: string;
    [key: string]: any;
  };
  visual_rules: {
    style_constraints: string[];
    [key: string]: any;
  };
  technical: {
    duration: string;
    resolution: string;
    aspect_ratio: string;
    [key: string]: any;
  };
}

/**
 * Comprehensive list of tone categories
 */
export const TONE_CATEGORIES = {
  emotional_positive: [
    "Joyful", "Uplifting", "Cheerful", "Euphoric", "Optimistic", 
    "Hopeful", "Triumphant", "Celebratory", "Heartwarming", "Romantic",
    "Passionate", "Playful", "Whimsical", "Lighthearted"
  ],
  emotional_neutral: [
    "Peaceful", "Serene", "Calm", "Meditative", "Contemplative",
    "Reflective", "Nostalgic", "Melancholic", "Bittersweet", "Dreamy",
    "Ethereal", "Surreal"
  ],
  emotional_intense: [
    "Dramatic", "Intense", "Tense", "Suspenseful", "Mysterious",
    "Ominous", "Dark", "Moody", "Gritty", "Raw", "Haunting",
    "Eerie", "Foreboding", "Somber", "Tragic"
  ],
  professional: [
    "Corporate", "Professional", "Formal", "Authoritative", "Credible",
    "Trustworthy", "Reliable", "Confident", "Polished", "Sophisticated",
    "Executive", "Institutional", "Academic", "Clinical", "Technical"
  ],
  creative_artistic: [
    "Cinematic", "Epic", "Grandiose", "Heroic", "Majestic",
    "Artistic", "Abstract", "Avant-garde", "Experimental", "Surreal",
    "Psychedelic", "Minimalist", "Clean", "Elegant", "Refined",
    "Stylized", "Graphic", "Illustrative"
  ],
  luxury_premium: [
    "Luxury", "Premium", "Exclusive", "High-end", "Opulent",
    "Lavish", "Glamorous", "Prestigious", "Elite"
  ],
  energetic_dynamic: [
    "Energetic", "Dynamic", "Vibrant", "Exciting", "Thrilling",
    "Electric", "Explosive", "High-octane", "Fast-paced", "Kinetic"
  ],
  friendly_accessible: [
    "Friendly", "Casual", "Approachable", "Warm", "Welcoming",
    "Inviting", "Conversational", "Relatable", "Down-to-earth"
  ],
  innovative_modern: [
    "Innovative", "Futuristic", "Modern", "Contemporary", "Cutting-edge",
    "Progressive", "Tech-forward", "Digital", "Sleek"
  ],
  educational: [
    "Informative", "Educational", "Clear", "Engaging", "Inspiring",
    "Motivational", "Authoritative", "Approachable", "Well-paced"
  ]
} as const;

/**
 * Get all available tones as flat array
 */
export const ALL_TONES = Object.values(TONE_CATEGORIES).flat();

/**
 * Mood keywords organized by category
 */
export const MOOD_KEYWORDS = {
  visual: [
    "colorful", "monochromatic", "saturated", "desaturated", "bright",
    "dim", "warm", "cool", "soft", "sharp", "high-contrast"
  ],
  temporal: [
    "slow-motion", "time-lapse", "rhythmic", "flowing", "staccato",
    "seamless", "fast-paced", "measured"
  ],
  sensory: [
    "intimate", "expansive", "claustrophobic", "airy", "textured",
    "smooth", "rough", "delicate", "bold"
  ],
  atmospheric: [
    "misty", "crisp", "hazy", "clear", "humid", "dry",
    "oppressive", "liberating", "cozy", "stark"
  ]
} as const;

/**
 * Validation rules for Tone & Atmosphere section
 */
export const TONE_VALIDATION_RULES = {
  primary_tone: {
    required: true,
    minLength: 3,
    maxLength: 50,
    shouldBeInList: true
  },
  secondary_tone: {
    required: false,
    minLength: 3,
    maxLength: 50,
    shouldBeInList: true
  },
  mood_keywords: {
    required: true,
    minItems: 2,
    maxItems: 6,
    eachMinLength: 3,
    eachMaxLength: 30
  },
  emotional_arc: {
    required: false,
    pattern: /^.+\s*→\s*.+$/,  // Should contain arrow (→) for progression
    maxLength: 100
  },
  visual_style_reference: {
    required: false,
    minLength: 10,
    maxLength: 150
  }
} as const;
