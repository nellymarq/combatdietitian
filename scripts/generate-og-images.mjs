import sharp from 'sharp';
import { mkdirSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const SCRIPT_DIR = import.meta.dirname;
const BLOG_DIR = join(SCRIPT_DIR, '..', 'src', 'content', 'blog');
const OUTPUT_DIR = join(SCRIPT_DIR, '..', 'public', 'og');
mkdirSync(OUTPUT_DIR, { recursive: true });

// Minimal frontmatter parser (zero deps)
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return null;
  const frontmatter = {};
  const lines = match[1].split('\n');
  for (const line of lines) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (!kv) continue;
    frontmatter[kv[1]] = kv[2].replace(/^["']|["']$/g, '').trim();
  }
  return frontmatter;
}

// Load all blog posts dynamically from content directory
function loadBlogPosts() {
  const files = readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
  const posts = [];
  for (const file of files) {
    const raw = readFileSync(join(BLOG_DIR, file), 'utf-8');
    const fm = parseFrontmatter(raw);
    if (!fm || !fm.title) {
      console.warn(`Skipping ${file}: missing frontmatter title`);
      continue;
    }
    posts.push({ slug: file.replace(/\.md$/, ''), title: fm.title });
  }
  return posts;
}

// Hardcoded special pages (pillars, hubs, etc. not in blog dir)
// Add new entries here as new pillar pages are created.
const specialPages = [
  { slug: 'tactical-dietitian', title: 'Tactical Dietitian for Military & First Responders' },
];

const allPages = [...loadBlogPosts(), ...specialPages];

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
  const startY = (630 - totalTextHeight) / 2 - 20;

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
  console.log(`Generating ${allPages.length} OG images (${allPages.length - specialPages.length} blog posts + ${specialPages.length} special pages)...`);
  for (const page of allPages) {
    const svg = generateSvg(page.title);
    const outputPath = join(OUTPUT_DIR, `${page.slug}.png`);

    await sharp(Buffer.from(svg))
      .resize(1200, 630)
      .png({ quality: 90 })
      .toFile(outputPath);

    console.log(`Generated: ${page.slug}.png`);
  }
  console.log(`\nDone! ${allPages.length} OG images written to public/og/`);
}

main().catch(console.error);
