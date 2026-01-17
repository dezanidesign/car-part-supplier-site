import fs from "fs";
import path from "path";

const galleryDir = path.join(process.cwd(), "public/gallery");
const outputFile = path.join(process.cwd(), "app/data/gallery.json");

const makes = fs.readdirSync(galleryDir).filter((dir) =>
  fs.statSync(path.join(galleryDir, dir)).isDirectory()
);

const data = {};

for (const make of makes) {
  const files = fs
    .readdirSync(path.join(galleryDir, make))
    .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .map((file) => `/gallery/${make}/${file}`);

  data[make] = files;
}

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));

console.log("✅ Gallery JSON generated");
