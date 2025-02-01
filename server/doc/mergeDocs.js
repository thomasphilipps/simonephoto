const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const swaggerMerge = require('swagger-merge');

// A helper function to load YAML from a file and parse it into a JS object
function loadYamlFile(filePath) {
  const fullPath = path.join(__dirname, filePath);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  return yaml.load(fileContents); // parse YAML => JS object
}

// 1) Load each partial spec from YAML
const mainSpec = loadYamlFile('main.yaml');
const gallerySpec = loadYamlFile('gallery.yaml');

// 2) Merge them
const merged = swaggerMerge.merge([mainSpec, gallerySpec]);

// 3) Output as JSON to a final "swagger.json"
const outputPath = path.join(__dirname, 'swagger.json');
fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2), 'utf8');

console.log(`Swagger docs merged into: ${outputPath}`);
