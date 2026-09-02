const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Radice da cui e' consentito servire i file
const ROOT = __dirname;

// Content type per estensione, con fallback binario generico
const CONTENT_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.ico': 'image/x-icon',
    '.wasm': 'application/wasm'
};

function sendError(res, statusCode, message) {
    res.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(message);
}

const server = http.createServer((req, res) => {
    // Scarta query string e fragment, poi decodifica il percorso richiesto
    let requestPath;

    try {
        const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        requestPath = decodeURIComponent(requestUrl.pathname);
    } catch {
        sendError(res, 400, 'Richiesta non valida.');
        return;
    }

    // Un byte NUL nel percorso farebbe lanciare fs.readFile in modo sincrono,
    // abbattendo il processo: la richiesta va rifiutata prima
    if (requestPath.includes('\0')) {
        sendError(res, 400, 'Richiesta non valida.');
        return;
    }

    // Gestione della rotta principale
    if (requestPath === '/' || requestPath === '') {
        requestPath = '/index.html';
    }

    // path.join normalizza il percorso: il controllo successivo impedisce
    // che una richiesta tipo /../../file esca dalla radice del progetto
    const filePath = path.join(ROOT, requestPath);

    if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) {
        sendError(res, 403, 'Accesso negato.');
        return;
    }

    const contentType = CONTENT_TYPES[path.extname(filePath).toLowerCase()]
        || 'application/octet-stream';

    // Legge e restituisce il file richiesto
    try {
        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT' || err.code === 'EISDIR') {
                    sendError(res, 404, `File non trovato: ${requestPath}`);
                } else {
                    sendError(res, 500, `Errore interno del server: ${err.code}`);
                }
                return;
            }

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        });
    } catch (error) {
        sendError(res, 400, `Percorso non valido: ${error.code || 'ERR'}`);
    }
});

server.listen(PORT, () => {
    console.log(`\x1b[32m%s\x1b[0m`, `[OK] Server WebGPU Chat avviato correttamente!`);
    console.log(`Apri il browser su: http://localhost:${PORT}`);
});
