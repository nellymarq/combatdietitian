import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = join(import.meta.dirname, '..', 'public', 'og');
mkdirSync(OUTPUT_DIR, { recursive: true });

const posts = [
  { slug: 'why-fighters-lose-strength-during-weight-cuts', title: 'Why Fighters Lose Strength During Weight Cuts (And How to Fix It)' },
  { slug: 'shift-work-nutrition-meal-plan', title: 'Shift Work Nutrition: Why Your 9-to-5 Meal Plan Is Failing You' },
  { slug: 'how-to-choose-a-sports-dietitian', title: 'How to Choose a Sports Dietitian (And Why Credentials Matter)' },
  { slug: 'pre-fight-meal-what-to-eat-before-competition', title: 'Pre-Fight Meal: What to Eat 24 Hours Before Competition' },
  { slug: 'protein-timing-for-combat-athletes', title: 'Protein Timing for Combat Athletes: What the Research Actually Shows' },
  { slug: 'nutrition-for-police-officers-and-swat', title: 'Nutrition for Police Officers and SWAT: Fueling Under Pressure' },
  { slug: 'weight-cut-science', title: 'The Science of Weight Cutting for Combat Athletes' },
  { slug: 'tactical-nutrition-basics', title: 'Tactical Nutrition Basics: Fueling the Operational Athlete' },
];

function wrapText(text, maxCharsPerLine) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const test = currentLine ? `${currentLine} ${word}` : word;
    if (test.length > maxCharsPerLine && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = test;
    }
  }
  if (currentLine) lines.push(currentLine);

  // Limit to 3 lines max, truncate last line if needed
  if (lines.length > 3) {
    lines.length = 3;
    lines[2] = lines[2].replace(/\s+\S*$/, '') + '...';
  }

  return lines;
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateSvg(title) {
  const lines = wrapText(title, 28);
  const fontSize = lines.some(l => l.length > 24) ? 52 : 58;
  const lineHeight = fontSize * 1.25;
  const totalTextHeight = lines.length * lineHeight;
  const startY = (630 - totalTextHeight) / 2 - 20; // shift up slightly to make room for branding

  const titleLines = lines.map((line, i) => {
    const y = startY + (i + 1) * lineHeight;
    return `<text x="80" y="${y}" font-family="Inter, Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="800" fill="#ffffff" letter-spacing="-1">${escapeXml(line)}</text>`;
  }).join('\n    ');

  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0f0f1a"/>
      <stop offset="50%" stop-color="#141428"/>
      <stop offset="100%" stop-color="#0f0f1a"/>
    </linearGradient>
    <linearGradient id="accent-line" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#e74c3c"/>
      <stop offset="100%" stop-color="#e74c3c" stop-opacity="0.3"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Subtle grid pattern for texture -->
  <line x1="80" y1="0" x2="80" y2="630" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1"/>
  <line x1="1120" y1="0" x2="1120" y2="630" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1"/>
  <line x1="0" y1="80" x2="1200" y2="80" stroke="#ffffff" stroke-opacity="0.02" stroke-width="1"/>

  <!-- Red accent bar at top -->
  <rect x="80" y="60" width="80" height="5" rx="2" fill="#e74c3c"/>

  <!-- Blog post title -->
  ${titleLines}

  <!-- Bottom divider -->
  <line x1="80" y1="520" x2="1120" y2="520" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1"/>

  <!-- COMBAT DIETITIAN branding -->
  <text x="80" y="568" font-family="Inter, Arial, Helvetica, sans-serif" font-size="22" font-weight="800" fill="#ffffff" letter-spacing="3">COMBAT</text>
  <text x="218" y="568" font-family="Inter, Arial, Helvetica, sans-serif" font-size="22" font-weight="800" fill="#e74c3c" letter-spacing="3">DIETITIAN</text>

  <!-- URL -->
  <text x="80" y="596" font-family="Inter, Arial, Helvetica, sans-serif" font-size="16" font-weight="500" fill="#d4a843" letter-spacing="1">combatdietitian.com</text>
</svg>`;
}

async function main() {
  for (const post of posts) {
    const svg = generateSvg(post.title);
    const outputPath = join(OUTPUT_DIR, `${post.slug}.png`);

    await sharp(Buffer.from(svg))
      .resize(1200, 630)
      .png({ quality: 90 })
      .toFile(outputPath);

    console.log(`Generated: ${post.slug}.png`);
  }
  console.log(`\nDone! Generated ${posts.length} OG images in public/og/`);
}

main().catch(console.error);
