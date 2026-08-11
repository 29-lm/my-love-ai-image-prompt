import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Data source: public/data/prompts.json (generated previously from the original dataset)
const publicDataDir = path.join(rootDir, 'public/data');
const promptsPath = path.join(publicDataDir, 'prompts.json');

if (!fs.existsSync(promptsPath)) {
  console.error('public/data/prompts.json not found. Nothing to regenerate.');
  process.exit(1);
}

const promptsData = JSON.parse(fs.readFileSync(promptsPath, 'utf-8'));

// Scan images from public/images and build mapping by id
// Naming: {index}_{id}_{variant}.jpg
const imagesDir = path.join(rootDir, 'public/images');
const imageFiles = fs.readdirSync(imagesDir);

const idToImages = {};
for (const file of imageFiles) {
  const match = file.match(/^(\d+)_(\d+)_(\d+)\.jpg$/);
  if (match) {
    const id = parseInt(match[2]);
    if (!idToImages[id]) {
      idToImages[id] = [];
    }
    idToImages[id].push(file);
  }
}

// Attach local images with relative paths (BASE_URL is prefixed at runtime)
const processed = promptsData.map((item) => {
  const localImages = idToImages[item.id] || [];
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    en_prompt: item.en_prompt,
    zh_prompt: item.zh_prompt,
    images: localImages.map((f) => `images/${f}`),
  };
});

fs.writeFileSync(promptsPath, JSON.stringify(processed));
console.log(`Generated public/data/prompts.json with ${processed.length} items`);

// Also write a lightweight index (no prompts) for the grid view
const indexData = processed.map(({ id, title, slug, images }) => ({ id, title, slug, images }));
fs.writeFileSync(path.join(publicDataDir, 'index.json'), JSON.stringify(indexData));
console.log(`Generated public/data/index.json (lightweight index)`);

const matched = processed.filter((p) => p.images.length > 0).length;
console.log(`Images found: ${imageFiles.length}, prompts with images: ${matched}/${processed.length}`);
