const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(process.cwd(), 'app'); // carpeta raíz del código, ajústala si quieres

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

function isInsideTextTag(lines, index) {
  // Busca hacia arriba y abajo si hay <Text> abierto y cerrado para determinar si la línea está dentro
  let openTags = 0;
  for (let i = index; i >= 0; i--) {
    const line = lines[i];
    if (line.includes('</Text>')) openTags--;
    if (line.includes('<Text')) openTags++;
  }
  return openTags > 0;
}

function searchFile(file) {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    // Regex simple para detectar strings literales en JSX (texto entre comillas que no sean parte de un atributo)
    // Esta regex detecta texto dentro de > "texto" < o > 'texto' <
    const textMatch = line.match(/>\s*["'][^"']+["']\s*</);
    if (textMatch) {
      if (!isInsideTextTag(lines, idx)) {
        console.log(`Texto fuera de <Text> en archivo: ${file} línea ${idx + 1}:`);
        console.log(`  ${line.trim()}\n`);
      }
    }
  });
}

console.log('Buscando texto fuera de <Text> en archivos .tsx y .jsx dentro de ./src ...\n');

walkDir(rootDir, (file) => {
  if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
    searchFile(file);
  }
});

console.log('Búsqueda terminada.');
