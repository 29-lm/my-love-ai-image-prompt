import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Read prompts data
const promptsData = JSON.parse(
  fs.readFileSync(path.join(rootDir, 'opennana_perfect_dataset/prompts_data.json'), 'utf-8')
);

// Scan images folder and build mapping by id
const imagesDir = path.join(rootDir, 'opennana_perfect_dataset/images');
const imageFiles = fs.readdirSync(imagesDir);

// Build id -> images mapping
// Naming: {index}_{id}_{variant}.jpg
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

// Process prompts and attach local images
const processed = promptsData.map((item) => {
  const localImages = idToImages[item.id] || [];
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    en_prompt: item.en_prompt,
    zh_prompt: item.zh_prompt,
    images: localImages.map((f) => `/images/${f}`),
  };
});

// Write processed data as JSON to public/data/
const publicDataDir = path.join(rootDir, 'public/data');
if (!fs.existsSync(publicDataDir)) {
  fs.mkdirSync(publicDataDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDataDir, 'prompts.json'), JSON.stringify(processed));
console.log(`Generated public/data/prompts.json with ${processed.length} items`);

// Also write a lightweight index (no prompts) for the grid view
const indexData = processed.map(({ id, title, slug, images }) => ({ id, title, slug, images }));
fs.writeFileSync(path.join(publicDataDir, 'index.json'), JSON.stringify(indexData));
console.log(`Generated public/data/index.json (lightweight index)`);

// Copy images to public/images
const publicImagesDir = path.join(rootDir, 'public/images');
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

for (const file of imageFiles) {
  const src = path.join(imagesDir, file);
  const dest = path.join(publicImagesDir, file);
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(src, dest);
  }
}
console.log(`Copied ${imageFiles.length} images to public/images/`);
