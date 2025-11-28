import { drizzle } from "drizzle-orm/mysql2";
import { templates } from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

const templateData = [
  // E-commerce Templates
  {
    industry: "E-commerce",
    useCase: "Product Launch",
    title: "Premium Product Reveal",
    description: "High-end product launch video with dramatic reveal and lifestyle context",
    templateJson: JSON.stringify({
      shot: {
        type: "[SHOT_TYPE: e.g., Extreme Close-up, Medium shot]",
        angle: "[ANGLE: e.g., Eye-level, Low angle]",
        framing: "[FRAMING: e.g., Center-frame, Rule of thirds]",
        movement: "[MOVEMENT: e.g., Slow dolly forward, Static with rack focus]"
      },
      subject: {
        age: 0,
        gender: "Product",
        ethnicity: "N/A",
        physical: "[PRODUCT_DESCRIPTION: e.g., Sleek wireless headphones, Luxury watch]",
        facial_features: "N/A",
        clothing: "N/A",
        emotional_state: "N/A"
      },
      action: {
        sequences: [
          {
            timing: "0-3s",
            primary_motion: "[ACTION: e.g., Product rotates slowly on pedestal]",
            camera_follows: "[CAMERA: e.g., Orbits around product]"
          },
          {
            timing: "3-6s",
            primary_motion: "[ACTION: e.g., Close-up of key feature]",
            camera_follows: "[CAMERA: e.g., Slow push-in to detail]"
          }
        ],
        duration: "6-8 seconds"
      },
      scene: {
        location: "[LOCATION: e.g., Minimalist studio, Luxury boutique]",
        time_of_day: "[TIME: e.g., Studio lighting, Golden hour]",
        weather: "N/A",
        lighting: {
          type: "[LIGHTING_TYPE: e.g., Three-point studio, Soft diffused]",
          quality: "[QUALITY: e.g., High-key, Dramatic contrast]",
          direction: "[DIRECTION: e.g., Key from 45°, Rim from behind]"
        },
        atmosphere: "[ATMOSPHERE: e.g., Premium and sophisticated, Modern and clean]"
      },
      cinematography: {
        camera: "[CAMERA: e.g., RED Komodo 6K, Sony FX6]",
        lens: "[LENS: e.g., 85mm f/1.4, Macro 100mm f/2.8]",
        aperture: "[APERTURE: e.g., f/2.8, f/5.6]",
        iso: "[ISO: e.g., 400, 800]",
        shutter_speed: "[SHUTTER: e.g., 1/50s, 1/100s]",
        white_balance: "[WB: e.g., 5600K, 3200K]",
        color_profile: "[PROFILE: e.g., LOG, Rec.709]",
        stabilization: "[STABILIZATION: e.g., Gimbal, Tripod]"
      },
      audio: {
        ambient_sound: "[AMBIENT: e.g., Subtle studio ambience, Soft boutique atmosphere]",
        music_style: "[MUSIC: e.g., Minimal electronic, Sophisticated jazz]",
        voice_over: "[VOICEOVER: Optional product description]"
      },
      visual_rules: {
        realism: "Photorealistic product rendering",
        continuity: "Maintain consistent lighting and color temperature"
      },
      technical_specifications: {
        resolution: "4K (3840x2160)",
        fps: 24,
        aspect_ratio: "16:9",
        color_space: "Rec.2020",
        bit_depth: "10-bit",
        codec: "ProRes 422 HQ",
        duration_seconds: 8
      }
    }),
    previewImage: null
  },
  {
    industry: "E-commerce",
    useCase: "Sale Announcement",
    title: "Dynamic Sale Promotion",
    description: "High-energy sale announcement with motion graphics and product showcase",
    templateJson: JSON.stringify({
      shot: {
        type: "[SHOT_TYPE: e.g., Wide shot, Dynamic montage]",
        angle: "[ANGLE: e.g., Eye-level, Overhead]",
        framing: "[FRAMING: e.g., Centered, Split-screen]",
        movement: "[MOVEMENT: e.g., Fast cuts, Whip pans]"
      },
      subject: {
        age: 0,
        gender: "Multiple Products",
        ethnicity: "N/A",
        physical: "[PRODUCTS: e.g., Fashion items, Electronics, Home goods]",
        facial_features: "N/A",
        clothing: "N/A",
        emotional_state: "N/A"
      },
      action: {
        sequences: [
          {
            timing: "0-2s",
            primary_motion: "[ACTION: e.g., Products appear with dynamic transitions]",
            camera_follows: "[CAMERA: e.g., Quick cuts between items]"
          },
          {
            timing: "2-5s",
            primary_motion: "[ACTION: e.g., Sale percentage graphics overlay]",
            camera_follows: "[CAMERA: e.g., Zoom to featured products]"
          }
        ],
        duration: "5-6 seconds"
      },
      scene: {
        location: "[LOCATION: e.g., Vibrant studio, Retail environment]",
        time_of_day: "Studio",
        weather: "N/A",
        lighting: {
          type: "[LIGHTING: e.g., High-energy colored lights, Dynamic spotlights]",
          quality: "[QUALITY: e.g., High contrast, Saturated colors]",
          direction: "[DIRECTION: e.g., Multiple angles, Rotating]"
        },
        atmosphere: "[ATMOSPHERE: e.g., Energetic and exciting, Urgent and compelling]"
      },
      cinematography: {
        camera: "[CAMERA: e.g., Sony A7S III, Canon R5]",
        lens: "[LENS: e.g., 24-70mm f/2.8, 16-35mm f/2.8]",
        aperture: "[APERTURE: e.g., f/4, f/5.6]",
        iso: "[ISO: e.g., 800, 1600]",
        shutter_speed: "[SHUTTER: e.g., 1/100s, 1/200s]",
        white_balance: "[WB: e.g., 5600K, Custom]",
        color_profile: "[PROFILE: e.g., Standard, Vivid]",
        stabilization: "[STABILIZATION: e.g., Handheld with IBIS, Gimbal]"
      },
      audio: {
        ambient_sound: "[AMBIENT: e.g., Upbeat retail atmosphere]",
        music_style: "[MUSIC: e.g., Energetic pop, Driving electronic]",
        voice_over: "[VOICEOVER: e.g., 'Up to 50% off! Limited time only!']"
      },
      visual_rules: {
        realism: "Stylized with motion graphics",
        continuity: "Fast-paced with consistent energy"
      },
      technical_specifications: {
        resolution: "1080p (1920x1080)",
        fps: 30,
        aspect_ratio: "16:9 or 9:16",
        color_space: "Rec.709",
        bit_depth: "8-bit",
        codec: "H.264",
        duration_seconds: 6
      }
    }),
    previewImage: null
  },

  // Real Estate Templates
  {
    industry: "Real Estate",
    useCase: "Property Tour",
    title: "Luxury Home Walkthrough",
    description: "Cinematic property tour showcasing key features and lifestyle",
    templateJson: JSON.stringify({
      shot: {
        type: "[SHOT_TYPE: e.g., Wide establishing, Slow tracking]",
        angle: "[ANGLE: e.g., Eye-level, Slightly elevated]",
        framing: "[FRAMING: e.g., Symmetrical, Leading lines]",
        movement: "[MOVEMENT: e.g., Smooth gimbal walk, Slow dolly]"
      },
      subject: {
        age: 0,
        gender: "Property",
        ethnicity: "N/A",
        physical: "[PROPERTY_TYPE: e.g., Modern 3-bedroom villa, Downtown penthouse]",
        facial_features: "N/A",
        clothing: "N/A",
        emotional_state: "N/A"
      },
      action: {
        sequences: [
          {
            timing: "0-4s",
            primary_motion: "[ACTION: e.g., Camera glides through entrance]",
            camera_follows: "[CAMERA: e.g., Smooth forward movement into living room]"
          },
          {
            timing: "4-8s",
            primary_motion: "[ACTION: e.g., Pan across kitchen and dining area]",
            camera_follows: "[CAMERA: e.g., Reveal outdoor view through windows]"
          }
        ],
        duration: "8-10 seconds"
      },
      scene: {
        location: "[LOCATION: e.g., Luxury residential property, Modern apartment]",
        time_of_day: "[TIME: e.g., Golden hour, Bright afternoon]",
        weather: "[WEATHER: e.g., Clear sunny day, Soft overcast]",
        lighting: {
          type: "[LIGHTING: e.g., Natural window light, Mixed natural and interior]",
          quality: "[QUALITY: e.g., Soft and warm, Bright and airy]",
          direction: "[DIRECTION: e.g., From windows, Ambient fill]"
        },
        atmosphere: "[ATMOSPHERE: e.g., Inviting and spacious, Elegant and sophisticated]"
      },
      cinematography: {
        camera: "[CAMERA: e.g., DJI Ronin 4D, Sony FX3]",
        lens: "[LENS: e.g., 16-35mm f/2.8, 24mm f/1.4]",
        aperture: "[APERTURE: e.g., f/4, f/5.6]",
        iso: "[ISO: e.g., 400, 800]",
        shutter_speed: "[SHUTTER: e.g., 1/50s, 1/100s]",
        white_balance: "[WB: e.g., 5000K, Auto]",
        color_profile: "[PROFILE: e.g., Natural, LOG]",
        stabilization: "[STABILIZATION: e.g., 3-axis gimbal, Steadicam]"
      },
      audio: {
        ambient_sound: "[AMBIENT: e.g., Subtle room tone, Soft outdoor birds]",
        music_style: "[MUSIC: e.g., Elegant piano, Ambient atmospheric]",
        voice_over: "[VOICEOVER: Optional property description]"
      },
      visual_rules: {
        realism: "Photorealistic architectural visualization",
        continuity: "Smooth transitions between rooms"
      },
      technical_specifications: {
        resolution: "4K (3840x2160)",
        fps: 24,
        aspect_ratio: "16:9",
        color_space: "Rec.709",
        bit_depth: "10-bit",
        codec: "H.265",
        duration_seconds: 10
      }
    }),
    previewImage: null
  },

  // SaaS Templates
  {
    industry: "SaaS",
    useCase: "Feature Demo",
    title: "Product Feature Showcase",
    description: "Clean screen recording with animated UI highlights and benefits",
    templateJson: JSON.stringify({
      shot: {
        type: "[SHOT_TYPE: e.g., Screen capture, Over-shoulder]",
        angle: "[ANGLE: e.g., Direct screen view, Slight perspective]",
        framing: "[FRAMING: e.g., Centered interface, Focus on key elements]",
        movement: "[MOVEMENT: e.g., Smooth cursor movements, Animated highlights]"
      },
      subject: {
        age: 0,
        gender: "Software Interface",
        ethnicity: "N/A",
        physical: "[INTERFACE: e.g., Dashboard, Mobile app, Web application]",
        facial_features: "N/A",
        clothing: "N/A",
        emotional_state: "N/A"
      },
      action: {
        sequences: [
          {
            timing: "0-3s",
            primary_motion: "[ACTION: e.g., User navigates to feature]",
            camera_follows: "[CAMERA: e.g., Zoom to relevant UI section]"
          },
          {
            timing: "3-6s",
            primary_motion: "[ACTION: e.g., Feature interaction demonstration]",
            camera_follows: "[CAMERA: e.g., Highlight key benefits with callouts]"
          }
        ],
        duration: "6-8 seconds"
      },
      scene: {
        location: "[LOCATION: e.g., Clean desktop environment, Mobile device mockup]",
        time_of_day: "N/A",
        weather: "N/A",
        lighting: {
          type: "[LIGHTING: e.g., Screen glow, Soft ambient]",
          quality: "[QUALITY: e.g., Clean and professional]",
          direction: "[DIRECTION: e.g., Front-facing screen light]"
        },
        atmosphere: "[ATMOSPHERE: e.g., Modern and efficient, User-friendly]"
      },
      cinematography: {
        camera: "[CAMERA: e.g., Screen recording software, 4K capture]",
        lens: "N/A",
        aperture: "N/A",
        iso: "N/A",
        shutter_speed: "N/A",
        white_balance: "N/A",
        color_profile: "[PROFILE: e.g., sRGB, Display P3]",
        stabilization: "N/A"
      },
      audio: {
        ambient_sound: "[AMBIENT: e.g., Subtle UI click sounds, Keyboard typing]",
        music_style: "[MUSIC: e.g., Minimal tech, Upbeat corporate]",
        voice_over: "[VOICEOVER: e.g., 'Automate your workflow in 3 clicks']"
      },
      visual_rules: {
        realism: "Clean UI with motion graphics overlays",
        continuity: "Consistent brand colors and animations"
      },
      technical_specifications: {
        resolution: "1080p (1920x1080)",
        fps: 30,
        aspect_ratio: "16:9",
        color_space: "sRGB",
        bit_depth: "8-bit",
        codec: "H.264",
        duration_seconds: 8
      }
    }),
    previewImage: null
  },

  // Restaurant Templates
  {
    industry: "Restaurant",
    useCase: "Menu Showcase",
    title: "Signature Dish Presentation",
    description: "Mouth-watering food cinematography with plating and ambiance",
    templateJson: JSON.stringify({
      shot: {
        type: "[SHOT_TYPE: e.g., Extreme close-up, Overhead flat lay]",
        angle: "[ANGLE: e.g., 45-degree, Bird's eye]",
        framing: "[FRAMING: e.g., Center-frame dish, Rule of thirds]",
        movement: "[MOVEMENT: e.g., Slow circular orbit, Gentle push-in]"
      },
      subject: {
        age: 0,
        gender: "Food",
        ethnicity: "N/A",
        physical: "[DISH_DESCRIPTION: e.g., Gourmet steak with garnish, Artisan pasta]",
        facial_features: "N/A",
        clothing: "N/A",
        emotional_state: "N/A"
      },
      action: {
        sequences: [
          {
            timing: "0-3s",
            primary_motion: "[ACTION: e.g., Steam rises from hot dish]",
            camera_follows: "[CAMERA: e.g., Slow reveal of plated food]"
          },
          {
            timing: "3-6s",
            primary_motion: "[ACTION: e.g., Sauce drizzle or garnish placement]",
            camera_follows: "[CAMERA: e.g., Close-up of finishing touch]"
          }
        ],
        duration: "6-8 seconds"
      },
      scene: {
        location: "[LOCATION: e.g., Restaurant kitchen, Elegant dining table]",
        time_of_day: "[TIME: e.g., Dinner service, Lunch hour]",
        weather: "N/A",
        lighting: {
          type: "[LIGHTING: e.g., Warm overhead, Soft diffused]",
          quality: "[QUALITY: e.g., Appetizing warm tones, High contrast]",
          direction: "[DIRECTION: e.g., 45-degree key, Backlight for steam]"
        },
        atmosphere: "[ATMOSPHERE: e.g., Intimate and inviting, Upscale and refined]"
      },
      cinematography: {
        camera: "[CAMERA: e.g., Sony A7 IV, Canon R6]",
        lens: "[LENS: e.g., 50mm f/1.2, Macro 100mm f/2.8]",
        aperture: "[APERTURE: e.g., f/2.8, f/4]",
        iso: "[ISO: e.g., 400, 800]",
        shutter_speed: "[SHUTTER: e.g., 1/50s, 1/100s]",
        white_balance: "[WB: e.g., 3200K warm, 4500K]",
        color_profile: "[PROFILE: e.g., Standard, Warm]",
        stabilization: "[STABILIZATION: e.g., Gimbal, Tripod]"
      },
      audio: {
        ambient_sound: "[AMBIENT: e.g., Sizzling sounds, Restaurant ambience]",
        music_style: "[MUSIC: e.g., Smooth jazz, Acoustic guitar]",
        voice_over: "[VOICEOVER: Optional dish description]"
      },
      visual_rules: {
        realism: "Photorealistic food styling",
        continuity: "Consistent warm color palette"
      },
      technical_specifications: {
        resolution: "4K (3840x2160)",
        fps: 24,
        aspect_ratio: "16:9 or 1:1",
        color_space: "Rec.709",
        bit_depth: "10-bit",
        codec: "ProRes 422",
        duration_seconds: 8
      }
    }),
    previewImage: null
  },

  // Fashion Templates
  {
    industry: "Fashion",
    useCase: "Collection Reveal",
    title: "Runway-Style Fashion Showcase",
    description: "High-fashion editorial video with model and garment focus",
    templateJson: JSON.stringify({
      shot: {
        type: "[SHOT_TYPE: e.g., Full-body tracking, Medium close-up]",
        angle: "[ANGLE: e.g., Eye-level, Slightly low]",
        framing: "[FRAMING: e.g., Center-frame model, Dynamic composition]",
        movement: "[MOVEMENT: e.g., Tracking walk, Slow dolly reveal]"
      },
      subject: {
        age: "[AGE: e.g., 25]",
        gender: "[GENDER: e.g., Female, Male, Non-binary]",
        ethnicity: "[ETHNICITY: e.g., Diverse representation]",
        physical: "[PHYSICAL: e.g., Tall and slender, Athletic build]",
        facial_features: "[FACE: e.g., Confident expression, Editorial makeup]",
        clothing: "[CLOTHING: e.g., [COLLECTION_NAME] evening gown, Designer streetwear]",
        emotional_state: "[EMOTION: e.g., Confident and powerful, Serene and elegant]"
      },
      action: {
        sequences: [
          {
            timing: "0-4s",
            primary_motion: "[ACTION: e.g., Model walks forward with confidence]",
            camera_follows: "[CAMERA: e.g., Tracks alongside at walking pace]"
          },
          {
            timing: "4-8s",
            primary_motion: "[ACTION: e.g., Pose and garment detail reveal]",
            camera_follows: "[CAMERA: e.g., Slow zoom to fabric texture]"
          }
        ],
        duration: "8-10 seconds"
      },
      scene: {
        location: "[LOCATION: e.g., Minimalist studio, Urban rooftop, Runway]",
        time_of_day: "[TIME: e.g., Studio lighting, Golden hour]",
        weather: "[WEATHER: e.g., Clear, Dramatic clouds]",
        lighting: {
          type: "[LIGHTING: e.g., High-fashion studio, Dramatic side light]",
          quality: "[QUALITY: e.g., High contrast, Soft glamour]",
          direction: "[DIRECTION: e.g., 45-degree key, Rim from behind]"
        },
        atmosphere: "[ATMOSPHERE: e.g., Sophisticated and editorial, Bold and modern]"
      },
      cinematography: {
        camera: "[CAMERA: e.g., ARRI Alexa Mini, RED Komodo]",
        lens: "[LENS: e.g., 50mm f/1.2, 85mm f/1.4]",
        aperture: "[APERTURE: e.g., f/2.8, f/4]",
        iso: "[ISO: e.g., 400, 800]",
        shutter_speed: "[SHUTTER: e.g., 1/50s, 1/100s]",
        white_balance: "[WB: e.g., 5600K, 4500K]",
        color_profile: "[PROFILE: e.g., LOG, Rec.709]",
        stabilization: "[STABILIZATION: e.g., Gimbal, Steadicam]"
      },
      audio: {
        ambient_sound: "[AMBIENT: e.g., Runway atmosphere, Urban soundscape]",
        music_style: "[MUSIC: e.g., Electronic fashion, Minimal house]",
        voice_over: "[VOICEOVER: Optional collection description]"
      },
      visual_rules: {
        realism: "Editorial fashion photography style",
        continuity: "Consistent brand aesthetic and color grading"
      },
      technical_specifications: {
        resolution: "4K (3840x2160)",
        fps: 24,
        aspect_ratio: "16:9 or 9:16",
        color_space: "Rec.2020",
        bit_depth: "10-bit",
        codec: "ProRes 422 HQ",
        duration_seconds: 10
      }
    }),
    previewImage: null
  }
];

async function seedTemplates() {
  console.log("Seeding templates...");
  
  for (const template of templateData) {
    await db.insert(templates).values(template);
    console.log(`✓ Added: ${template.industry} - ${template.title}`);
  }
  
  console.log("\n✅ All templates seeded successfully!");
  process.exit(0);
}

seedTemplates().catch((error) => {
  console.error("❌ Error seeding templates:", error);
  process.exit(1);
});
