/*
 * Un serveur statique de trois lignes, pour REGARDER le jeu.
 *
 * Le jeu s'ouvre en double-cliquant sur index.html et n'a besoin de rien —
 * c'est une règle du projet. Mais un fichier ouvert en file:// ne charge ni
 * la feuille de style ni les scripts dans un navigateur piloté : pour
 * vérifier une passe graphique, il faut un serveur. Celui-ci ne sert que ça,
 * il ne construit rien et il n'est jamais nécessaire pour jouer.
 *
 *   node tools/serve.js [port]
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PORT = Number(process.argv[2] || 8123);
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
                ".css": "text/css; charset=utf-8", ".json": "application/json",
                ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon" };

http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split("?")[0]).replace(/^\/+/, "") || "index.html";
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { "content-type": "text/plain" }).end("404"); return; }
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream",
                         "cache-control": "no-store" });
    res.end(data);
  });
}).listen(PORT, () => console.log("President Material sur http://localhost:" + PORT));
