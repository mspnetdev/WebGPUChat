const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // Gestione della rotta principale
    let filePath = req.url === '/' || req.url === '/index.html' 
        ? path.join(__dirname, 'index.html') 
        : path.join(__dirname, req.url);

    // Identifica l'estensione del file per impostare i giusti Header di sicurezza
    const extname = path.extname(filePath);
    let contentType = 'text/html; charset=utf-8';
    
    if (extname === '.js') {
        contentType = 'application/javascript; charset=utf-8';
    } else if (extname === '.css') {
        contentType = 'text/css; charset=utf-8';
    } else if (extname === '.json') {
        contentType = 'application/json; charset=utf-8';
    }

    // Legge e restituisce il file richiesto
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end(`File non trovato: ${req.url}`);
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end(`Errore interno del server: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`\x1b[32m%s\x1b[0m`, `[OK] Server WebGPU Chat avviato correttamente!`);
    console.log(`Apri il browser su: http://localhost:${PORT}`);
});
