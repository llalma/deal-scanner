import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Copy manifest.json
fs.copyFileSync(
  path.resolve(__dirname, "public/manifest.json"),
  path.resolve(__dirname, "dist/manifest.json"),
);

// Create injections directory if it doesn't exist
const injectionsDir = path.resolve(__dirname, "dist/src/injections");
if (!fs.existsSync(injectionsDir)) {
  fs.mkdirSync(injectionsDir, { recursive: true });
}
// Copy injectionos
const sourceInjectionsDir = path.resolve(__dirname, "src/injections");
if (fs.existsSync(sourceInjectionsDir)) {
  fs.readdirSync(sourceInjectionsDir).forEach((file) => {
    fs.copyFileSync(
      path.join(sourceInjectionsDir, file),
      path.join(injectionsDir, file),
    );
  });
}

// Create images directory if it doesn't exist
const imagesDir = path.resolve(__dirname, "dist/images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Copy images
const sourceImagesDir = path.resolve(__dirname, "public/images");
if (fs.existsSync(sourceImagesDir)) {
  fs.readdirSync(sourceImagesDir).forEach((file) => {
    fs.copyFileSync(
      path.join(sourceImagesDir, file),
      path.join(imagesDir, file),
    );
  });
}

console.log("Post-build completed: manifest and images copied to dist/");
