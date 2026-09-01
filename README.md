# WebGPU AI Chat

https://mspnetdev.github.io/WebGPUChat/

A lightweight browser-based AI chat application that runs supported language models locally on the GPU through WebGPU and `@mlc-ai/web-llm`.

The interface provides:

- Automatic WebGPU availability checks
- Model filtering based on estimated GPU memory
- Local model loading and inference
- Streaming chat responses
- Live prompt-processing and token-generation metrics
- VRAM release and chat reset controls

## Requirements

- A WebGPU-compatible browser, preferably a recent version of Google Chrome or Microsoft Edge
- A compatible GPU with updated drivers
- Node.js and npm
- An internet connection for the initial model download

You can inspect browser GPU support by opening:

```text
chrome://gpu
```

## Project structure

```text
project-folder/
├── WebGPUChat_EN.html
├── README.rd
└── node_modules/
```

The HTML file imports WebLLM directly from:

```javascript
./node_modules/@mlc-ai/web-llm/lib/index.js
```

The `node_modules` directory must therefore be available in the deployed project unless the import is replaced with a bundled or CDN-based dependency.

## Local installation

Create a project directory and place `WebGPUChat_EN.html` inside it, then run:

```bash
npm init -y
npm install @mlc-ai/web-llm
```

## Run locally

The application must be served through HTTP. Do not open the HTML file directly with a `file://` URL.

Using `npx serve`:

```bash
npx serve .
```

Alternatively, using Python:

```bash
python3 -m http.server 8080
```

Then open one of the following addresses:

```text
http://localhost:3000/WebGPUChat_EN.html
```

or, when using the Python server:

```text
http://localhost:8080/WebGPUChat_EN.html
```

The exact port displayed by `npx serve` may differ if the default port is already in use.

## Production deployment

### Option 1: Static web server

1. Install the dependencies:

```bash
npm install
```

2. Upload the complete project directory, including `node_modules`, to a server that supports HTTPS.
3. Configure the server to expose `WebGPUChat_EN.html` and the dependency files with the correct MIME types.
4. Open the deployed HTML page through HTTPS.

Example Nginx configuration:

```nginx
server {
    listen 443 ssl;
    server_name example.com;

    root /var/www/webgpu-chat;
    index WebGPUChat_EN.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

### Option 2: Deploy with a Node.js static server

Install a static server package:

```bash
npm install serve
```

Add the following script to `package.json`:

```json
{
  "scripts": {
    "start": "serve ."
  }
}
```

Start the application with:

```bash
npm start
```

### Option 3: Static hosting platforms

The project can be deployed to platforms such as Azure Static Web Apps, Netlify, Vercel, or GitHub Pages, but the current relative import requires the `node_modules/@mlc-ai/web-llm` files to be included in the published output.

For a cleaner production deployment, use a JavaScript bundler such as Vite so that WebLLM is included in the generated build assets instead of publishing the complete `node_modules` directory.

## Important deployment notes

- Use HTTPS in production because WebGPU availability may depend on a secure browser context.
- Model files are downloaded when a model is initialized and may require significant bandwidth and browser storage.
- Performance and available models depend on GPU capabilities and available VRAM.
- Browser security policies prevent automatically opening internal URLs such as `chrome://gpu`.
- The application performs inference locally in the browser after the selected model has been downloaded.

## Start the application

1. Open the deployed page in a WebGPU-compatible browser.
2. Wait for the hardware compatibility check.
3. Select one of the available models.
4. Click **Initialize**.
5. Wait for the model download and GPU initialization to complete.
6. Enter a message and click **Send**.
7. Use **Clear VRAM / Reset** to unload the model and clear the chat session.
