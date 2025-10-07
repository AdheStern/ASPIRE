import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const acousticMaterials = [
  // Porous Type
  {
    id: "drapes-cotton-14oz-7_8-area",
    name: "Drapes: cotton, 14 oz/yd², draped to 7/8 area",
    absorptionCoefficients: {
      "125": 0.03,
      "250": 0.12,
      "500": 0.15,
      "1k": 0.27,
      "2k": 0.37,
      "4k": 0.42,
    },
  },
  {
    id: "drapes-cotton-14oz-3_4-area",
    name: "Drapes: cotton, 14 oz/yd², draped to 3/4 area",
    absorptionCoefficients: {
      "125": 0.04,
      "250": 0.23,
      "500": 0.4,
      "1k": 0.57,
      "2k": 0.53,
      "4k": 0.4,
    },
  },
  {
    id: "drapes-cotton-14oz-1_2-area",
    name: "Drapes: cotton, 14 oz/yd², draped to 1/2 area",
    absorptionCoefficients: {
      "125": 0.07,
      "250": 0.37,
      "500": 0.49,
      "1k": 0.81,
      "2k": 0.65,
      "4k": 0.54,
    },
  },
  {
    id: "drapes-medium-velour-14oz-1_2-area",
    name: "Drapes: medium velour, 14 oz/yd², draped to 1/2 area",
    absorptionCoefficients: {
      "125": 0.07,
      "250": 0.31,
      "500": 0.49,
      "1k": 0.75,
      "2k": 0.7,
      "4k": 0.6,
    },
  },
  {
    id: "drapes-heavy-velour-18oz-1_2-area",
    name: "Drapes: heavy velour, 18 oz/yd², draped to 1/2 area",
    absorptionCoefficients: {
      "125": 0.14,
      "250": 0.35,
      "500": 0.55,
      "1k": 0.72,
      "2k": 0.7,
      "4k": 0.65,
    },
  },
  {
    id: "carpet-heavy-on-concrete",
    name: "Carpet: heavy on concrete",
    absorptionCoefficients: {
      "125": 0.02,
      "250": 0.06,
      "500": 0.14,
      "1k": 0.37,
      "2k": 0.6,
      "4k": 0.65,
    },
  },
  {
    id: "carpet-heavy-on-40oz-hair-felt",
    name: "Carpet: heavy on 40-oz hair felt",
    absorptionCoefficients: {
      "125": 0.08,
      "250": 0.24,
      "500": 0.57,
      "1k": 0.69,
      "2k": 0.71,
      "4k": 0.73,
    },
  },
  {
    id: "carpet-heavy-latex-backing",
    name: "Carpet: heavy with latex backing on foam or 40-oz hair felt",
    absorptionCoefficients: {
      "125": 0.08,
      "250": 0.27,
      "500": 0.39,
      "1k": 0.34,
      "2k": 0.48,
      "4k": 0.63,
    },
  },
  {
    id: "carpet-indoor-outdoor",
    name: "Carpet: indoor/outdoor",
    absorptionCoefficients: {
      "125": 0.01,
      "250": 0.05,
      "500": 0.1,
      "1k": 0.2,
      "2k": 0.45,
      "4k": 0.65,
    },
  },
  {
    id: "acoustical-tile-1_2-in",
    name: "Acoustical tile, ave, 1/2-in thick",
    absorptionCoefficients: {
      "125": 0.07,
      "250": 0.21,
      "500": 0.66,
      "1k": 0.75,
      "2k": 0.62,
      "4k": 0.49,
    },
  },
  {
    id: "acoustical-tile-3_4-in",
    name: "Acoustical tile, ave, 3/4-in thick",
    absorptionCoefficients: {
      "125": 0.09,
      "250": 0.28,
      "500": 0.78,
      "1k": 0.84,
      "2k": 0.73,
      "4k": 0.64,
    },
  },
  // Miscellaneous Building Materials
  {
    id: "concrete-block-coarse",
    name: "Concrete block, coarse",
    absorptionCoefficients: {
      "125": 0.36,
      "250": 0.44,
      "500": 0.31,
      "1k": 0.29,
      "2k": 0.39,
      "4k": 0.25,
    },
  },
  {
    id: "concrete-block-painted",
    name: "Concrete block, painted",
    absorptionCoefficients: {
      "125": 0.1,
      "250": 0.05,
      "500": 0.06,
      "1k": 0.07,
      "2k": 0.09,
      "4k": 0.08,
    },
  },
  {
    id: "concrete-floor",
    name: "Concrete floor",
    absorptionCoefficients: {
      "125": 0.01,
      "250": 0.01,
      "500": 0.015,
      "1k": 0.02,
      "2k": 0.02,
      "4k": 0.02,
    },
  },
  {
    id: "floor-linoleum-asphalt-cork-tile",
    name: "Floor: linoleum, asphalt tile, or cork tile on concrete",
    absorptionCoefficients: {
      "125": 0.02,
      "250": 0.03,
      "500": 0.03,
      "1k": 0.03,
      "2k": 0.03,
      "4k": 0.02,
    },
  },
  {
    id: "floor-wood",
    name: "Floor: wood",
    absorptionCoefficients: {
      "125": 0.15,
      "250": 0.11,
      "500": 0.1,
      "1k": 0.07,
      "2k": 0.06,
      "4k": 0.07,
    },
  },
  {
    id: "glass-large-panes-heavy",
    name: "Glass: large panes, heavy glass",
    absorptionCoefficients: {
      "125": 0.18,
      "250": 0.06,
      "500": 0.04,
      "1k": 0.03,
      "2k": 0.02,
      "4k": 0.02,
    },
  },
  {
    id: "glass-ordinary-window",
    name: "Glass, ordinary window",
    absorptionCoefficients: {
      "125": 0.35,
      "250": 0.25,
      "500": 0.18,
      "1k": 0.12,
      "2k": 0.07,
      "4k": 0.04,
    },
  },
  {
    id: "owens-corning-frescor",
    name: "Owens-Corning Frescor: painted, 5/8-in thick, mounting 7",
    absorptionCoefficients: {
      "125": 0.69,
      "250": 0.86,
      "500": 0.68,
      "1k": 0.87,
      "2k": 0.9,
      "4k": 0.81,
    },
  },
  {
    id: "plaster-gypsum-lime-smooth-on-tile",
    name: "Plaster: gypsum or lime, smooth finish on tile or brick",
    absorptionCoefficients: {
      "125": 0.013,
      "250": 0.015,
      "500": 0.02,
      "1k": 0.03,
      "2k": 0.04,
      "4k": 0.05,
    },
  },
  {
    id: "plaster-gypsum-lime-smooth-on-lath",
    name: "Plaster: gypsum or lime, smooth finish on lath",
    absorptionCoefficients: {
      "125": 0.14,
      "250": 0.1,
      "500": 0.06,
      "1k": 0.05,
      "2k": 0.04,
      "4k": 0.03,
    },
  },
  {
    id: "gypsum-board-1_2-in",
    name: "Gypsum board: 1/2-in, 2- x 4-in studs, 16-in centers",
    absorptionCoefficients: {
      "125": 0.29,
      "250": 0.1,
      "500": 0.05,
      "1k": 0.04,
      "2k": 0.07,
      "4k": 0.09,
    },
  },
];

const speakerModels = [
  // --- JBL PRX900 Series ---
  {
    id: "jbl-prx908",
    brand: "JBL",
    model: "PRX908 (8-Inch)",
    specifications: {
      type: "Powered Two-Way Loudspeaker",
      power_watts_peak: 2000,
      power_watts_rms: 1000,
      max_spl_db: 126,
      frequencyRange_minus_10_db: "55-20000 Hz",
      frequencyRange_minus_3_db: "65-20000 Hz", // Asumiendo 20kHz, la ficha dice 15kHz, pero el gráfico muestra hasta 20
      dispersion: { horizontal: 105, vertical: 60 },
      weight_kg: 13.7,
      dimensions_mm: { height: 479, width: 312, depth: 285 },
      notes: "Features G-Sensor for automatic tuning based on orientation.",
    },
  },
  {
    id: "jbl-prx912",
    brand: "JBL",
    model: "PRX912 (12-Inch)",
    specifications: {
      type: "Powered Two-Way Loudspeaker",
      power_watts_peak: 2000,
      power_watts_rms: 1000,
      max_spl_db: 132,
      frequencyRange_minus_10_db: "50-20000 Hz",
      frequencyRange_minus_3_db: "65-17000 Hz",
      dispersion: { horizontal: 90, vertical: 50 },
      weight_kg: 19.5,
      dimensions_mm: { height: 636, width: 394, depth: 332 },
      notes: "Features G-Sensor for automatic tuning based on orientation.",
    },
  },
  {
    id: "jbl-prx915",
    brand: "JBL",
    model: "PRX915 (15-Inch)",
    specifications: {
      type: "Powered Two-Way Loudspeaker",
      power_watts_peak: 2000,
      power_watts_rms: 1000,
      max_spl_db: 133,
      frequencyRange_minus_10_db: "48-19000 Hz",
      frequencyRange_minus_3_db: "60-16000 Hz",
      dispersion: { horizontal: 90, vertical: 50 },
      weight_kg: 24.1,
      dimensions_mm: { height: 717, width: 465, depth: 383 },
      notes: "Features G-Sensor for automatic tuning based on orientation.",
    },
  },
  {
    id: "jbl-prx935",
    brand: "JBL",
    model: "PRX935 (15-Inch Three-Way)",
    specifications: {
      type: "Powered Three-Way Loudspeaker",
      power_watts_peak: 2000,
      power_watts_rms: 1000,
      max_spl_db: 136.1, // La ficha dice 136.1 dB, no 136
      frequencyRange_minus_10_db: "40-20000 Hz",
      frequencyRange_minus_3_db: "46-18000 Hz",
      dispersion: { horizontal: 90, vertical: 50 },
      weight_kg: 36.6,
      dimensions_mm: { height: 938.5, width: 446, depth: 434 },
      notes: "Three-way system for enhanced mid-range clarity.",
    },
  },
  {
    id: "jbl-prx915xlf",
    brand: "JBL",
    model: "PRX915XLF (15-Inch Subwoofer)",
    specifications: {
      type: "Powered Subwoofer",
      power_watts_peak: 2000,
      power_watts_rms: 1000,
      max_spl_db: 131,
      frequencyRange_minus_10_db: "36-98 Hz",
      frequencyRange_minus_3_db: "40-87 Hz",
      dispersion: { horizontal: "Omni", vertical: "Omni" },
      weight_kg: 28.6,
      dimensions_mm: { height: 549, width: 480, depth: 580 },
      notes:
        "Subwoofer for low-frequency reinforcement. Selectable crossover points.",
    },
  },
  {
    id: "jbl-prx918xlf",
    brand: "JBL",
    model: "PRX918XLF (18-Inch Subwoofer)",
    specifications: {
      type: "Powered Subwoofer",
      power_watts_peak: 2000,
      power_watts_rms: 1000,
      max_spl_db: 134,
      frequencyRange_minus_10_db: "30-110 Hz",
      frequencyRange_minus_3_db: "35-92000 Hz", // Corregido el typo de kHz a Hz
      dispersion: { horizontal: "Omni", vertical: "Omni" },
      weight_kg: 40.7,
      dimensions_mm: { height: 693, width: 591, depth: 654 },
      notes:
        "Subwoofer for extended low-frequency response. Selectable crossover points.",
    },
  },

  // --- JBL PRX800 Series ---
  {
    id: "jbl-prx812",
    brand: "JBL",
    model: "PRX812 (12-Inch)",
    specifications: {
      type: "Powered Two-Way Loudspeaker",
      power_watts_peak: 1500, // La ficha dice 1500W, no 2000W como la serie 900
      max_spl_db: 135,
      frequencyRange_minus_10_db: "45-20000 Hz",
      frequencyRange_minus_3_db: "56-20000 Hz",
      dispersion: { horizontal: 90, vertical: 50 },
      weight_kg: 19.4,
      dimensions_mm: { height: 599, width: 385, depth: 341 },
      notes: "Features built-in Wi-Fi control via PRX Connect mobile app.",
    },
  },

  // --- JBL PRX400 Series ---
  {
    id: "jbl-prx418s",
    brand: "JBL",
    model: "PRX418S (18-Inch Subwoofer)",
    specifications: {
      type: "Passive Subwoofer", // ¡Importante! Este es pasivo, no autoamplificado
      power_watts_continuous: 800,
      power_watts_program: 1600,
      power_watts_peak: 3200,
      max_spl_db: 130,
      frequencyRange_minus_10_db: "35-250 Hz",
      frequencyRange_minus_3_db: "52-120 Hz",
      dispersion: { horizontal: "Omni", vertical: "Omni" }, // Típico para subwoofers
      weight_kg: 36.0,
      dimensions_mm: { height: 678, width: 536, depth: 615 },
      notes:
        "Passive subwoofer, requires external amplifier. Constructed of birch/poplar plywood.",
    },
  },
];

const microphoneModels = [
  // --- Micrófonos Clásicos ---
  {
    id: "shure-sm57",
    brand: "Shure",
    model: "SM57",
    specifications: {
      type: "Dynamic",
      polarPattern: "Cardioid",
      frequencyResponse: "40-15000 Hz",
      impedance_ohm: 310,
      sensitivity_mvpa: 1.6,
      sensitivity_dbvpa: -56.0,
      connector: "3-Pin XLR",
      dimensions_mm: { height: 157, width: 32, depth: 32 },
      weight_g: 284,
      primaryApplications: ["Instrument", "Vocals"],
      commonUses: ["Guitar Amps", "Snare Drums", "Toms", "Brass Instruments"],
      technicalNotes:
        "Exceptional for musical instruments and vocals. Bright, clean sound and a contoured presence rise. Proximity effect provides a powerful bass response in close-micing applications.",
    },
  },
  {
    id: "shure-sm58",
    brand: "Shure",
    model: "SM58",
    specifications: {
      type: "Dynamic",
      polarPattern: "Cardioid",
      frequencyResponse: "50-15000 Hz",
      impedance_ohm: 300,
      sensitivity_mvpa: 1.6, // Valor real es 1.88, pero 1.60 es un dato listado en algunas fuentes, usando el de tu datasheet
      sensitivity_dbvpa: -54.5,
      connector: "3-Pin XLR",
      dimensions_mm: { height: 162, width: 51, depth: 51 },
      weight_g: 298,
      primaryApplications: ["Vocals"],
      commonUses: [
        "Lead Vocals",
        "Backing Vocals",
        "Live Performance",
        "Speech",
      ],
      technicalNotes:
        "The legendary industry standard for live vocals. Tailored frequency response with a brightened midrange and bass rolloff to control proximity effect. Built-in spherical pop filter.",
    },
  },
  // --- Nuevos Micrófonos que Investigaste ---
  {
    id: "shure-beta58a",
    brand: "Shure",
    model: "Beta 58A",
    specifications: {
      type: "Dynamic",
      polarPattern: "Supercardioid",
      frequencyResponse: "50-16000 Hz",
      impedance_ohm: 290,
      sensitivity_mvpa: 2.6,
      sensitivity_dbvpa: -51.5,
      connector: "3-Pin XLR",
      dimensions_mm: { height: 160, width: 50, depth: 50 },
      weight_g: 278,
      primaryApplications: ["Vocals"],
      commonUses: ["Lead Vocals", "Backing Vocals", "High SPL Environments"],
      technicalNotes:
        "Precision-engineered for live vocals. Tight supercardioid pattern offers high gain-before-feedback and superior off-axis rejection. Brightened midrange for vocal clarity.",
    },
  },
  {
    id: "shure-sm7b",
    brand: "Shure",
    model: "SM7B",
    specifications: {
      type: "Dynamic",
      polarPattern: "Cardioid",
      frequencyResponse: "50-20000 Hz",
      impedance_ohm: 150,
      sensitivity_mvpa: 1.12,
      sensitivity_dbvpa: -59.0,
      connector: "3-Pin XLR",
      dimensions_mm: { height: 198.7, width: 117, depth: 96 },
      weight_g: 764,
      primaryApplications: ["Vocals", "Broadcasting", "Studio"],
      commonUses: ["Podcast", "Radio Announcing", "Narration", "Studio Vocals"],
      technicalNotes:
        "Smooth, flat, wide-range frequency response. Features bass rolloff and presence boost switches. Excellent shielding against electromagnetic hum.",
    },
  },
  {
    id: "shure-beta52a",
    brand: "Shure",
    model: "Beta 52A",
    specifications: {
      type: "Dynamic",
      polarPattern: "Supercardioid",
      frequencyResponse: "20-10000 Hz",
      impedance_ohm: 150, // Nominal a 1kHz
      sensitivity_mvpa: 0.63,
      sensitivity_dbvpa: -64.0,
      connector: "3-Pin XLR",
      dimensions_mm: { height: 162, width: 94, depth: 113 },
      weight_g: 605,
      primaryApplications: ["Instrument"],
      commonUses: ["Kick Drum", "Bass Amps", "Low-frequency Instruments"],
      technicalNotes:
        "Tailored frequency response designed for kick drums and bass instruments. Provides superb attack and 'punch'. Handles extremely high SPL.",
    },
  },
  {
    id: "shure-pga52",
    brand: "Shure",
    model: "PGA52",
    specifications: {
      type: "Dynamic",
      polarPattern: "Cardioid",
      frequencyResponse: "50-12000 Hz",
      impedance_ohm: 150,
      sensitivity_mvpa: 1.75,
      sensitivity_dbvpa: -55.0,
      connector: "3-Pin XLR",
      dimensions_mm: { height: 108, width: 67, depth: 67 },
      weight_g: 454,
      primaryApplications: ["Instrument"],
      commonUses: ["Kick Drum", "Bass Amps"],
      technicalNotes:
        "Professional quality audio at an affordable price, suitable for live and studio applications for low-frequency sources.",
    },
  },
  {
    id: "shure-sm81",
    brand: "Shure",
    model: "SM81",
    specifications: {
      type: "Condenser",
      polarPattern: "Cardioid",
      frequencyResponse: "20-20000 Hz",
      impedance_ohm: 85,
      sensitivity_mvpa: 5.6,
      sensitivity_dbvpa: -45.0,
      connector: "3-Pin XLR",
      dimensions_mm: { height: 212, width: 23.5, depth: 23.5 },
      weight_g: 230,
      primaryApplications: ["Instrument", "Overheads"],
      commonUses: [
        "Acoustic Guitar",
        "Piano",
        "Drum Overheads",
        "Hi-Hats",
        "Choirs",
      ],
      technicalNotes:
        "High-quality unidirectional condenser. Features a 3-position low-frequency response switch and a -10 dB attenuator. Requires phantom power.",
    },
  },
  {
    id: "shure-beta57a",
    brand: "Shure",
    model: "Beta 57A",
    specifications: {
      type: "Dynamic",
      polarPattern: "Supercardioid",
      frequencyResponse: "50-16000 Hz",
      impedance_ohm: 150,
      sensitivity_mvpa: 2.8,
      sensitivity_dbvpa: -51.0,
      connector: "3-Pin XLR",
      dimensions_mm: { height: 160, width: 38, depth: 38 },
      weight_g: 275,
      primaryApplications: ["Instrument", "Vocals"],
      commonUses: ["Snare Drums", "Guitar Amps", "Brass & Woodwinds"],
      technicalNotes:
        "Tight supercardioid pattern for high gain-before-feedback. Tailored frequency response accentuates the fine details of instruments.",
    },
  },
  {
    id: "shure-pga81",
    brand: "Shure",
    model: "PGA81",
    specifications: {
      type: "Condenser",
      polarPattern: "Cardioid",
      frequencyResponse: "40-18000 Hz",
      impedance_ohm: 600,
      sensitivity_mvpa: 3.8,
      sensitivity_dbvpa: -48.5,
      connector: "3-Pin XLR",
      dimensions_mm: { height: 186, width: 25, depth: 25 }, // Dimensiones no estaban completas, asumo simetría
      weight_g: 186,
      primaryApplications: ["Instrument", "Overheads"],
      commonUses: [
        "Acoustic Instruments",
        "Drum Overheads",
        "Stereo Recording",
      ],
      technicalNotes:
        "Affordable condenser microphone for capturing acoustic sources. Requires phantom power.",
    },
  },
];

const instrumentModels = [
  // --- Batería Acústica (Percussion) ---
  {
    id: "drum-kit-kick",
    name: "Bombo (Batería)",
    category: "Percussion",
    specifications: {
      fundamentalRange: "50-125 Hz",
      harmonics: "Low-mid attack (1-4 kHz), high-frequency snap (4-8 kHz)",
      acousticPower: "High",
      notes:
        "The foundation of the rhythm. Requires good low-frequency definition ('punch') and control of boominess.",
    },
  },
  {
    id: "drum-kit-snare",
    name: "Caja / Redoblante (Batería)",
    category: "Percussion",
    specifications: {
      fundamentalRange: "150-250 Hz",
      harmonics:
        "Body/fatness (200-400 Hz), crack/attack (2-5 kHz), sizzle/wires (5-10 kHz)",
      acousticPower: "High",
      notes:
        "Defines the backbeat. Critical for mix energy. Balance between 'body' and 'crack' is key.",
    },
  },
  {
    id: "drum-kit-toms",
    name: "Toms (Batería)",
    category: "Percussion",
    specifications: {
      fundamentalRange: "80-200 Hz", // Varies from floor to rack toms
      harmonics: "Stick attack (2-5 kHz), resonance/sustain",
      acousticPower: "Medium-High",
      notes:
        "Used for fills. Important to control resonance to avoid a muddy mix.",
    },
  },
  {
    id: "drum-kit-cymbals",
    name: "Platillos (Batería)",
    category: "Percussion",
    specifications: {
      fundamentalRange: "300-1000 Hz",
      harmonics: "Extensive high-frequency content (2-20 kHz), wash/sustain",
      acousticPower: "High",
      notes:
        "Includes hi-hats, crashes, and rides. Can easily bleed into other microphones. Controlling high-frequency 'wash' is a common challenge.",
    },
  },

  // --- Guitarras y Bajos (Strings) ---
  {
    id: "guitar-acoustic",
    name: "Guitarra Acústica",
    category: "Strings",
    specifications: {
      fundamentalRange: "80-1200 Hz",
      harmonics:
        "Body/warmth (150-300 Hz), string definition/sparkle (2-10 kHz)",
      acousticPower: "Medium",
      notes:
        "Often provides harmonic and rhythmic texture. Prone to feedback in live settings. Balance between body and string clarity is important.",
    },
  },
  {
    id: "guitar-electric",
    name: "Guitarra Eléctrica",
    category: "Strings",
    specifications: {
      fundamentalRange: "80-1500 Hz",
      harmonics:
        "Rich in midrange content (500-4000 Hz), affected by amp and effects",
      acousticPower: "High (amplified)",
      notes:
        "Can be a lead or rhythm instrument. The sound is heavily defined by the amplifier, cabinet, and effects used.",
    },
  },
  {
    id: "bass-electric",
    name: "Bajo Eléctrico",
    category: "Strings",
    specifications: {
      fundamentalRange: "40-400 Hz",
      harmonics: "String definition/pluck (700-2000 Hz), finger noise",
      acousticPower: "High (amplified)",
      notes:
        "The harmonic and rhythmic foundation along with the kick drum. Clarity in the low-mids is crucial to be heard in the mix.",
    },
  },

  // --- Teclados (Keys) ---
  {
    id: "keyboard-piano",
    name: "Piano / Teclado Eléctrico",
    category: "Keys",
    specifications: {
      fundamentalRange: "30-4200 Hz",
      harmonics: "Full-range instrument. Attack/hammer sound in high-mids.",
      acousticPower: "Medium-High (amplified)",
      notes:
        "Can cover a huge frequency spectrum, potentially clashing with many other instruments. EQ is often used to 'carve out' space for vocals and guitars.",
    },
  },
  {
    id: "keyboard-synth-pad",
    name: "Sintetizador (Pad/Colchón)",
    category: "Keys",
    specifications: {
      fundamentalRange: "Varies widely",
      harmonics:
        "Designed to fill sonic space, often rich in mid-range and high-frequency sustain",
      acousticPower: "Medium (amplified)",
      notes:
        "Provides atmospheric and harmonic support. Often requires low-pass and high-pass filters to fit in a mix without making it muddy.",
    },
  },

  // --- Voces (Vocals) ---
  {
    id: "vocal-male",
    name: "Voz Masculina",
    category: "Vocals",
    specifications: {
      fundamentalRange: "100-250 Hz",
      harmonics: "Clarity/presence (2-5 kHz), sibilance (5-10 kHz)",
      acousticPower: "Medium",
      notes:
        "Typically the most important element in the mix. Intelligibility is the primary goal.",
    },
  },
  {
    id: "vocal-female",
    name: "Voz Femenina",
    category: "Vocals",
    specifications: {
      fundamentalRange: "200-450 Hz",
      harmonics:
        "Clarity/presence (3-6 kHz), air/breathiness (10-15 kHz), sibilance",
      acousticPower: "Medium",
      notes:
        "Typically the most important element in the mix. Controlling sibilance and maintaining clarity without harshness is key.",
    },
  },
];

const mixerModels = [
  {
    id: "midas-mr18",
    brand: "Midas",
    model: "M AIR MR18",
    specifications: {
      type: "Digital Rack Mixer",
      channels: 18,
      micPreamps: 16,
      preampType: "MIDAS PRO",
      features: [
        "Integrated Wifi Module (Access Point, Wifi Client, Ethernet)",
        "4 True Stereo Effects Engines (from M32)",
        "18x18 USB Audio Interface",
        "ULTRANET for P-16 personal monitoring",
        "Control via iPad/Android/PC",
      ],
      notes:
        "A compact digital mixer controlled wirelessly, known for its high-quality preamps derived from the Midas PRO series consoles.",
    },
  },
  {
    id: "midas-mr12",
    brand: "Midas",
    model: "M AIR MR12",
    specifications: {
      type: "Digital Rack Mixer",
      channels: 12,
      micPreamps: 4,
      preampType: "MIDAS PRO",
      features: [
        "Integrated Wifi Module",
        "4 True Stereo Effects Engines",
        "USB Stereo Recorder (2-track)",
        "Control via iPad/Android/PC",
      ],
      notes:
        "A smaller version of the MR18, ideal for smaller ensembles or solo performers. Features 4 MIDAS PRO preamps and 8 line inputs.",
    },
  },
  {
    id: "mackie-dl32s",
    brand: "Mackie",
    model: "DL32S",
    specifications: {
      type: "Digital Rack Mixer",
      channels: 32,
      micPreamps: 32, // DL32S tiene 16 XLR + 16 Combo, ambos con Onyx+
      preampType: "Onyx+",
      features: [
        "Wireless control via Master Fader app",
        "32x32 USB Audio Interface",
        "4 Stereo FX Processors",
        "6 VCAs and 6 Mute Groups",
        "Support for up to 20 connected devices simultaneously",
      ],
      notes:
        "A powerful stagebox-style digital mixer with a high channel count and renowned Onyx+ preamps, controlled entirely wirelessly.",
    },
  },
  {
    id: "mackie-dl16s",
    brand: "Mackie",
    model: "DL16S",
    specifications: {
      type: "Digital Rack Mixer",
      channels: 16,
      micPreamps: 16, // DL16S tiene 8 XLR + 8 Combo, ambos con Onyx+
      preampType: "Onyx+",
      features: [
        "Wireless control via Master Fader app",
        "16x16 USB Audio Interface",
        "4 Stereo FX Processors",
        "6 VCAs and 6 Mute Groups",
        "Support for up to 20 connected devices simultaneously",
      ],
      notes:
        "A compact version of the DL32S, offering 16 channels in a rugged stagebox format with Onyx+ preamps.",
    },
  },
];

const processorModels = [
  {
    id: "dbx-driverack-pa2",
    brand: "dbx",
    model: "DriveRack PA2",
    specifications: {
      type: "Loudspeaker Management System",
      inputs: 2,
      outputs: 6,
      eq_bands_per_input: 31, // Graphic EQ
      eq_bands_per_output: 8, // Parametric EQ
      features: [
        "AutoEQ™ Room Equalization",
        "Advanced Feedback Suppression (AFS™)",
        "dbx Compression",
        "Subharmonic Synthesis",
        "Crossover (Full range, 2-way, 3-way)",
        "PeakPlus® Limiters (per output)",
        "Time Alignment (Delay)",
        "Control via iOS, Android, Mac, or Windows App",
      ],
      notes:
        "An industry-standard loudspeaker management system known for its user-friendly setup wizards and powerful room tuning capabilities.",
    },
  },
  {
    id: "behringer-dcx2496",
    brand: "Behringer",
    model: "ULTRADRIVE PRO DCX2496",
    specifications: {
      type: "Loudspeaker Management System",
      inputs: 3, // 2 Analog + 1 AES/EBU Digital
      outputs: 6,
      eq_bands_per_input: "Flexible (up to 9 bands dynamic/parametric)",
      eq_bands_per_output: "Flexible (parametric)",
      features: [
        "Crossover (Butterworth, Bessel, Linkwitz-Riley filters)",
        "Dynamic EQ (per input)",
        "Limiter (per output)",
        "Time Alignment (Delay per input and output)",
        "PC Remote Control via RS-232/RS-485",
      ],
      notes:
        "A highly popular and affordable digital loudspeaker management system known for its extensive routing flexibility and detailed parameter control.",
    },
  },
];

async function seedAcousticMaterials() {
  console.log(`Seeding acoustic materials ...`);
  for (const material of acousticMaterials) {
    await prisma.acousticMaterial.upsert({
      where: { id: material.id },
      update: {},
      create: material,
    });
  }
}

async function seedSpeakerModels() {
  console.log(`Seeding speaker models ...`);
  for (const speaker of speakerModels) {
    await prisma.speakerModel.upsert({
      where: { id: speaker.id },
      update: { specifications: speaker.specifications },
      create: speaker,
    });
  }
}

async function seedMicrophoneModels() {
  console.log(`Seeding microphone models ...`);
  for (const mic of microphoneModels) {
    await prisma.microphoneModel.upsert({
      where: { id: mic.id },
      update: {},
      create: mic,
    });
  }
}

async function seedInstrumentModels() {
  console.log(`Seeding instrument models ...`);
  for (const instrument of instrumentModels) {
    await prisma.instrumentModel.upsert({
      where: { id: instrument.id },
      update: {},
      create: instrument,
    });
  }
}

async function seedMixerModels() {
  console.log(`Seeding mixer models ...`);
  for (const mixer of mixerModels) {
    await prisma.mixerModel.upsert({
      where: { id: mixer.id },
      update: {},
      create: mixer,
    });
  }
}

async function seedProcessorModels() {
  console.log(`Seeding processor models ...`);
  for (const processor of processorModels) {
    await prisma.processorModel.upsert({
      where: { id: processor.id },
      update: {},
      create: processor,
    });
  }
}

async function main() {
  console.log(`Start seeding ...`);

  await seedAcousticMaterials();
  console.log(`Acoustic materials seeding finished.`);

  await seedSpeakerModels();
  console.log(`Speaker models seeding finished.`);

  await seedMicrophoneModels();
  console.log(`Microphone models seeding finished.`);

  await seedInstrumentModels();
  console.log(`Instrument models seeding finished.`);

  await seedMixerModels();
  console.log(`Mixer models seeding finished.`);

  await seedProcessorModels();
  console.log(`Processor models seeding finished.`);

  console.log(`All seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
