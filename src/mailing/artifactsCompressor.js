const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

function compressArtifacts() {
  try {
    const rootDir = path.join(__dirname, "../../"); // Ruta absoluta a la raíz del repositorio
    const archives = [
      {
        src: path.join(rootDir, "results/playwright-report-e2e"),
        dest: path.join(rootDir, "results/playwright-report-e2e.zip"),
      },
      {
        src: path.join(rootDir, "results/playwright-report-api"),
        dest: path.join(rootDir, "results/playwright-report-api.zip"),
      },
    ];

    archives.forEach(({ src, dest }) => {
      console.log(`Comenzando a comprimir ${src} en ${dest}...`);

      // Eliminar archivo existente si existe
      if (fs.existsSync(dest)) {
        fs.unlinkSync(dest);
      }

      const output = fs.createWriteStream(dest);
      const archive = archiver("zip", { zlib: { level: 9 } }); // Cambiado a "zip"

      output.on("close", () => {
        console.log(`${dest} creado (${archive.pointer()} bytes).`);
      });

      archive.on("error", (err) => {
        throw err;
      });

      archive.pipe(output);
      archive.directory(src, false);
      archive.finalize();
    });
  } catch (error) {
    console.error("Error al comprimir artefactos:", error);
    process.exit(1);
  }
}

compressArtifacts();
