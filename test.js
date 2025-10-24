import fs from "fs";
import path from "path";

const OUTPUT_FILE = "repo_code.txt";
const EXCLUDED_DIRS = [
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "out",
  "yarn.lock",
];

const EXCLUDED_FILES = [
  "package-lock.json", // 👈 se excluye por nombre en cualquier carpeta
  "yarn.lock",
];

const outputStream = fs.createWriteStream(OUTPUT_FILE, { flags: "w" });

function processDirectory(dirPath, rootPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    // Ignorar carpetas excluidas
    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.includes(entry.name)) {
        processDirectory(fullPath, rootPath);
      }
      continue;
    }

    // Ignore specific files
    if (EXCLUDED_FILES.includes(entry.name)) continue; // 👈 esto hace el truco

    // Filter by extension
    const ext = path.extname(entry.name);
    const allowed = [
      ".js",
      ".ts",
      ".tsx",
      ".json",
      ".md",
      ".html",
      ".css",
      ".yml",
      ".yaml",
      ".env",
      ".txt",
      ".cjs",
      ".mjs",
    ];
    if (!allowed.includes(ext)) continue;

    try {
      const content = fs.readFileSync(fullPath, "utf8");
      const relativePath = path.relative(rootPath, fullPath);
      const lineCount = content.split("\n").length;

      outputStream.write("\n\n");
      outputStream.write("========================================\n");
      outputStream.write(`📄 Archivo: ${entry.name}\n`);
      outputStream.write(`📂 Ruta: ${relativePath}\n`);
      outputStream.write(`📏 Líneas: ${lineCount}\n`);
      outputStream.write("========================================\n\n");
      outputStream.write(content);
    } catch (err) {
      console.warn(`⚠️ No se pudo leer ${fullPath}:`, err.message);
    }
  }
}

console.log("📁 Escaneando repositorio...\n");
processDirectory(process.cwd(), process.cwd());
outputStream.end(() => console.log(`✅ Código guardado en ${OUTPUT_FILE}`));
