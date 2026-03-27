// MPS Performance Nutrition Academy — Course Structure

export const ACADEMY = {
  name: 'CD Academy',
  nameFull: 'Combat Dietitian Academy',
  tagline: 'Evidence-based performance nutrition certification from the arena to the field.',
} as const;

export const FOUNDATION = {
  slug: 'performance-nutrition-foundation',
  title: 'Performance Nutrition Foundation',
  credential: 'MPS-PNF',
  credentialFull: 'MPS Performance Nutrition Foundation',
  price: 39.99,
  freeModules: 2,
  description: 'The core knowledge every performance nutrition practitioner needs — regardless of sport or population. Start free with 2 modules and 2 CPEUs. Unlock the full certification + 1 month of Calsanova Pro for $39.99.',
  modules: [
    {
      slug: 'energy-systems',
      order: 1,
      title: 'Energy Systems & Sport Demands',
      description: 'How different sports tax different energy systems, and what that means for fueling strategy across disciplines.',
      estimatedMinutes: 45,
      learningOutcomes: [
        'Identify the dominant energy systems across combat, endurance, team, and strength sports',
        'Explain how work-to-rest ratios and session duration affect substrate utilization',
        'Calculate estimated energy expenditure for training sessions by type and intensity',
        'Design fueling strategies matched to the energy system demands of a specific sport',
      ],
    },
    {
      slug: 'macro-periodization',
      order: 2,
      title: 'Macronutrient Periodization Principles',
      description: 'Match nutrition to training phases, load, and competition cycles. The science of fueling for the work required.',
      estimatedMinutes: 50,
      learningOutcomes: [
        'Define the nutritional demands of general training phases (base, build, peak, taper, competition, recovery)',
        'Calculate phase-specific macronutrient targets based on training load and body weight',
        'Apply carbohydrate periodization principles (train-low, compete-high, sleep-low)',
        'Differentiate nutritional approaches for high-load vs low-load vs rest days',
      ],
    },
    {
      slug: 'hydration-electrolytes',
      order: 3,
      title: 'Hydration & Electrolyte Science',
      description: 'Fluid balance, sweat rate estimation, environmental factors, and evidence-based rehydration fundamentals.',
      estimatedMinutes: 50,
      learningOutcomes: [
        'Calculate individualized daily hydration targets based on body weight and activity',
        'Estimate sweat rate and electrolyte losses using field-practical methods',
        'Design hydration protocols adjusted for heat, cold, and altitude environments',
        'Evaluate oral rehydration solution compositions for different recovery scenarios',
      ],
    },
    {
      slug: 'supplement-evaluation',
      order: 4,
      title: 'Evidence-Based Supplement Evaluation',
      description: 'How to read the research, screen products for safety and efficacy, and assess dose adequacy.',
      estimatedMinutes: 45,
      learningOutcomes: [
        'Evaluate supplement claims against the hierarchy of evidence',
        'Identify third-party certification programs (NSF, Informed Sport) and their limitations',
        'Assess dose adequacy by comparing product labels to effective dose ranges from research',
        'Screen for proprietary blend risks and contamination indicators',
      ],
    },
    {
      slug: 'recovery-sleep',
      order: 5,
      title: 'Recovery Nutrition & Sleep',
      description: 'Post-training fueling windows, anti-inflammatory strategies, and the bidirectional relationship between sleep and nutrition.',
      estimatedMinutes: 45,
      learningOutcomes: [
        'Design post-training recovery nutrition protocols with evidence-based timing and composition',
        'Identify dietary strategies that modulate inflammation in training contexts',
        'Explain the bidirectional relationship between sleep quality and nutritional status',
        'Apply sleep-supportive nutrition strategies (meal timing, micronutrients, caffeine curfews)',
      ],
    },
    {
      slug: 'practitioner-skills',
      order: 6,
      title: 'Practitioner Skills: Assessment, Monitoring & Body Composition',
      description: 'Intake screening, body composition assessment methods, progress tracking, adherence strategies, and scope of practice.',
      estimatedMinutes: 55,
      learningOutcomes: [
        'Conduct a structured nutrition intake assessment for athletes',
        'Select and interpret appropriate body composition measurement methods (DEXA, BIA, skinfolds, circumferences)',
        'Design a monitoring cadence that balances data collection with athlete burden',
        'Apply evidence-based adherence strategies and identify when to escalate to other professionals',
      ],
    },
  ],
  assessment: {
    title: 'Foundation Case Study Assessment',
    description: 'Design a periodized nutrition plan for a provided athlete profile across a training cycle. Your submission will be reviewed by the course instructor.',
    passingCriteria: 'Demonstrates understanding of all 6 foundation topics applied to a realistic scenario.',
  },
} as const;

export const COMBAT_TRACK = {
  slug: 'combat-sports-specialization',
  title: 'Combat Sports Specialization',
  credential: 'MPS-CSNS',
  credentialFull: 'MPS Combat Sports Nutrition Specialist',
  price: 39.99,
  prerequisite: 'performance-nutrition-foundation',
  description: 'Weight cuts, fight camp nutrition, rehydration science, and everything you need to manage a fighter from camp to cage.',
  modules: [
    {
      slug: 'weight-class-strategy',
      order: 1,
      title: 'Weight Class Strategy & Body Composition Management',
      description: 'When to cut, when to move up, and how to make evidence-based weight class decisions that optimize performance.',
      estimatedMinutes: 45,
      learningOutcomes: [
        'Calculate power-to-weight ratios to evaluate optimal weight class selection for a given fighter',
        'Identify sport-specific body composition targets using DEXA-derived reference ranges for combat athletes',
        'Evaluate when cutting down versus moving up a weight class is the evidence-based decision',
        'Design a chronic weight management plan that distinguishes between acute and long-term body composition strategies',
      ],
    },
    {
      slug: 'fight-camp-nutrition',
      order: 2,
      title: 'Fight Camp Nutrition Periodization',
      description: 'Map 8-12 week fight camp phases to macro targets, meal timing, and food selection that supports training while managing weight.',
      estimatedMinutes: 50,
      learningOutcomes: [
        'Design phase-specific macronutrient targets across early camp, mid camp, peak week, and fight week',
        'Calculate meal timing and composition around two-a-day training sessions during fight camp',
        'Apply evidence-based supplement protocols matched to each fight camp phase',
        'Identify strategies to manage hunger and adherence during progressive caloric restriction',
      ],
    },
    {
      slug: 'water-electrolyte-manipulation',
      order: 3,
      title: 'Water & Electrolyte Manipulation for Weight Cuts',
      description: 'Water loading, sodium manipulation, glycogen depletion — the science and the safety limits that govern acute weight reduction.',
      estimatedMinutes: 55,
      learningOutcomes: [
        'Design a day-by-day water loading and sodium manipulation protocol for an acute weight cut',
        'Explain the physiological mechanisms of aldosterone and vasopressin suppression during water loading',
        'Calculate expected weight loss from glycogen depletion and low-residue diet strategies',
        'Evaluate safety limits for sauna and sweat suit protocols based on total body water loss thresholds',
      ],
    },
    {
      slug: 'rehydration-fight-day',
      order: 4,
      title: 'Rehydration & Fight-Day Fueling',
      description: 'Post-weigh-in recovery protocols, body-weight-scaled rehydration, and pre-fight meal timing where fights are won or lost.',
      estimatedMinutes: 50,
      learningOutcomes: [
        'Design a body-weight-scaled rehydration protocol using oral rehydration solution composition principles',
        'Calculate glycogen replenishment targets (g/kg/hr) for the post-weigh-in recovery window',
        'Apply evidence-based pre-fight meal timing and composition for optimal fight-night performance',
        'Evaluate caffeine dosing and timing strategies specific to combat sport competition schedules',
      ],
    },
    {
      slug: 'safety-monitoring-commissions',
      order: 5,
      title: 'Safety, Monitoring & Athletic Commissions',
      description: 'ISSN safety thresholds, when to abort a cut, hydration testing (ONE Championship), and working with commission medical teams.',
      estimatedMinutes: 45,
      learningOutcomes: [
        'Apply ISSN position stand thresholds to determine when a weight cut must be aborted',
        'Interpret urine specific gravity results and explain their role in commission hydration testing protocols',
        'Identify red flags for medical intervention during acute weight reduction in combat athletes',
        'Design documentation protocols for weight cut monitoring that meet athletic commission requirements',
      ],
    },
    {
      slug: 'tournament-multi-fight',
      order: 6,
      title: 'Tournament & Multi-Fight Strategies',
      description: 'Same-day weigh-ins, back-to-back events, and rapid recovery protocols for wrestling, BJJ, and multi-fight tournaments.',
      estimatedMinutes: 40,
      learningOutcomes: [
        'Differentiate fueling strategies for same-day weigh-ins versus 24-hour weigh-ins in tournament formats',
        'Design rapid recovery nutrition protocols for athletes competing in multiple bouts within a single day',
        'Calculate carbohydrate repletion rates and fluid targets between tournament bouts based on bout spacing',
        'Apply sport-specific tournament nutrition plans for wrestling, BJJ, and multi-fight combat events',
      ],
    },
  ],
  assessment: {
    title: 'Combat Sports Case Study Assessment',
    description: 'Design a complete 12-week fight camp nutrition plan including weight cut protocol and rehydration strategy for a provided fighter profile.',
    passingCriteria: 'Demonstrates mastery of combat sport nutrition from camp through fight day.',
  },
} as const;

export const TACTICAL_TRACK = {
  slug: 'tactical-nutrition-specialization',
  title: 'Tactical Nutrition Specialization',
  credential: 'MPS-TNS',
  credentialFull: 'MPS Tactical Nutrition Specialist',
  price: 39.99,
  prerequisite: 'performance-nutrition-foundation',
  description: 'Operational nutrition for military, law enforcement, and fire — from field constraints to environmental extremes.',
  modules: [
    {
      slug: 'operational-demands',
      order: 1,
      title: 'Nutritional Demands of Sustained Operations',
      description: 'Energy expenditure in tactical environments, shift-work metabolism, and fueling under unpredictable schedules.',
      estimatedMinutes: 45,
      learningOutcomes: [
        'Calculate energy expenditure for tactical tasks using USARIEM load-carriage and metabolic cost data',
        'Identify the metabolic consequences of shift work and circadian disruption on appetite regulation and substrate utilization',
        'Evaluate caloric requirements across military occupational specialties and tactical roles',
        'Apply RED-S screening frameworks to military and first-responder populations',
      ],
    },
    {
      slug: 'field-constraints',
      order: 2,
      title: 'Fueling Under Field Constraints',
      description: 'MRE optimization, DFAC meal building, and nutrition planning when food access is limited or controlled.',
      estimatedMinutes: 45,
      learningOutcomes: [
        'Design MRE-based meal plans that maximize macronutrient quality and minimize caloric deficit in field settings',
        'Apply DFAC meal-building strategies to meet performance nutrition targets for tactical athletes',
        'Identify portable nutrition solutions for patrol, surveillance, and extended field operations',
        'Evaluate hydration logistics and calculate fluid requirements in austere environments',
      ],
    },
    {
      slug: 'environmental-nutrition',
      order: 3,
      title: 'Environmental Nutrition: Heat, Cold & Altitude',
      description: 'Acclimatization nutrition, sodium loading for heat, caloric increases for cold, iron and carb optimization for altitude.',
      estimatedMinutes: 50,
      learningOutcomes: [
        'Design sodium-loading and fluid-rate protocols for heat acclimatization based on environment and workload',
        'Calculate caloric increases required for cold-weather operations using established multipliers',
        'Explain the physiological basis for iron supplementation, carbohydrate loading, and appetite management at altitude',
        'Apply transitional nutrition strategies when operators move between environmental extremes',
      ],
    },
    {
      slug: 'body-comp-readiness',
      order: 4,
      title: 'Body Composition for Occupational Readiness Standards',
      description: 'Service-specific body comp standards (waist-to-height ratio), managing operators through assessments, and sustainable approaches.',
      estimatedMinutes: 40,
      learningOutcomes: [
        'Identify service-specific body composition standards across Army, Air Force, Navy, and Marine Corps assessments',
        'Design sustainable body composition management plans that maintain operational readiness',
        'Evaluate field-expedient body composition assessment methods including waist-to-height ratio and circumference protocols',
        'Apply evidence-based strategies to manage operators through assessment windows without compromising performance',
      ],
    },
    {
      slug: 'cognitive-performance',
      order: 5,
      title: 'Cognitive Performance Nutrition',
      description: 'Strategic caffeine use, glucose for decision-making under fatigue, sleep deprivation countermeasures, and stress-response micronutrients.',
      estimatedMinutes: 45,
      learningOutcomes: [
        'Design strategic caffeine protocols with evidence-based timing, dosing, and washout periods for sustained operations',
        'Explain the role of glucose availability in decision-making accuracy under fatigue and sleep deprivation',
        'Evaluate the evidence for omega-3 fatty acids in TBI protection and cognitive resilience',
        'Apply stress-response micronutrient strategies including magnesium, zinc, and B-vitamin supplementation',
      ],
    },
    {
      slug: 'unit-level-programming',
      order: 6,
      title: 'Unit-Level Nutrition Programming',
      description: 'Designing nutrition SOPs for tactical units, working with command structures, and measuring readiness outcomes.',
      estimatedMinutes: 45,
      learningOutcomes: [
        'Design nutrition standard operating procedures appropriate for unit-level implementation',
        'Apply military briefing formats to present nutrition programming to command leadership',
        'Identify integration points with S4/logistics and DFAC management for scalable meal planning',
        'Evaluate readiness outcomes using measurable metrics tied to unit performance and medical data',
      ],
    },
  ],
  assessment: {
    title: 'Tactical Nutrition Case Study Assessment',
    description: 'Design a nutrition SOP for a tactical unit preparing for a summer deployment, addressing environmental protocols, body composition standards, and field nutrition.',
    passingCriteria: 'Demonstrates mastery of tactical nutrition across operational contexts.',
  },
} as const;

// All courses for iteration
export const ALL_COURSES = [FOUNDATION, COMBAT_TRACK, TACTICAL_TRACK] as const;

// Helper types
export type Course = typeof FOUNDATION | typeof COMBAT_TRACK | typeof TACTICAL_TRACK;
export type Module = typeof FOUNDATION.modules[number];
export type CourseSlug = typeof ALL_COURSES[number]['slug'];

// Get course by slug
export function getCourse(slug: string): Course | undefined {
  return ALL_COURSES.find(c => c.slug === slug) as Course | undefined;
}
