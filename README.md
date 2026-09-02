# WebGPU AI Chat

Live demo:

<https://mspnetdev.github.io/WebGPUChat/>

WebGPU AI Chat is a browser-based application that runs supported language models locally through WebGPU and `@mlc-ai/web-llm`.

The application also exposes diagnostic tools through the experimental WebMCP API, allowing the registered tools to be discovered, inspected, and executed from both the interface and Chrome DevTools.

## Features

### WebMCP Test Console

- Detects whether WebMCP is available in the browser
- Registers WebMCP tools through `document.modelContext`
- Lists the tools exposed by the page
- Executes tools directly from the application interface
- Displays structured JSON results
- Integrates with Chrome DevTools under **Application > WebMCP**

Available tools:

- `get_webgpu_chat_status`
- `list_compatible_models`

### WebGPU Test Console

- Checks WebGPU browser support
- Displays selected WebGPU adapter limits
- Filters models according to estimated GPU memory
- Loads and runs supported language models locally
- Streams chat responses
- Displays prompt-processing, token-generation, and total-time metrics
- Releases allocated VRAM and resets the chat session
- Provides access instructions for `chrome://gpu`

### Responsive interface

- Desktop, tablet, and mobile layouts
- Full-width diagnostic panels
- Touch-friendly controls
- Responsive model configuration and GPU metrics
- Mobile chat area with adaptive height
- Input controls optimized to prevent automatic zoom on mobile browsers
- Wrapped diagnostic output without horizontal page overflow

## Browser requirements

- A recent WebGPU-compatible version of Google Chrome or Microsoft Edge
- A compatible GPU with updated drivers
- JavaScript enabled
- An internet connection for the WebLLM library and initial model download
- HTTPS when deployed publicly

Node.js is not required for the GitHub Pages deployment because WebLLM is imported from a CDN.

## Required Chrome settings

### 1. Inspect WebGPU support

Open the following internal Chrome page:

```text
chrome://gpu
```

Under **Graphics Feature Status**, verify that WebGPU is enabled and hardware accelerated.

The application includes a **Copy chrome://gpu** button. Chrome does not allow a normal web page to open internal `chrome://` URLs directly, so the address must be copied and pasted into a new tab.

### 2. Enable WebMCP testing

Open:

```text
chrome://flags/#enable-webmcp-testing
```

Then:

1. Set the WebMCP testing flag to **Enabled**.
2. Select **Relaunch** or completely close and restart Chrome.
3. Open the application again.
4. Open Chrome DevTools.
5. Navigate to **Application > WebMCP**.

The following tools should appear under **Available Tools**:

```text
get_webgpu_chat_status
list_compatible_models
```

The application includes a **Copy WebMCP Chrome Flag** button because a web page cannot directly navigate to a `chrome://flags` address.

## Test WebMCP from the interface

1. Enable the WebMCP Chrome flag and relaunch the browser.
2. Open the deployed application.
3. Check that the WebMCP status reports the available tools.
4. Select **Refresh WebMCP Tools** if the list is not immediately visible.
5. Select **Run Tool** under `get_webgpu_chat_status`.
6. Inspect the JSON result displayed in the WebMCP console.
7. Select **Run Tool** under `list_compatible_models`.
8. Open **Chrome DevTools > Application > WebMCP** to inspect the corresponding tool activity, inputs, outputs, and status.

## Test WebGPU and the local chat

1. Open the application in a WebGPU-compatible browser.
2. Select **Refresh WebGPU Status**.
3. Inspect the WebGPU diagnostic output.
4. Select a compatible model.
5. Select **Initialize**.
6. Wait for the model download and WebGPU initialization.
7. Enter a message in the chat field.
8. Select **Send**.
9. Inspect the live GPU metrics.
10. Select **Clear VRAM / Reset** to unload the model and reset the session.

## Project structure

```text
WebGPUChat/
├── index.html          # the whole application: markup, styles, module script
├── server.js           # optional static server for local development
├── package.json        # local tooling metadata and the pinned WebLLM version
├── package-lock.json
├── README.md
└── .gitignore
```

The application imports WebLLM from the CDN, pinned to an exact version so an
upstream release cannot change the behaviour of the deployed page:

```javascript
import * as webllm from "https://esm.run/@mlc-ai/web-llm@0.2.84";
```

The same version is declared in `package.json`. When upgrading WebLLM, change
the version in both places so the local dependency and the CDN import stay in
sync.

Do not publish `node_modules` to GitHub Pages.

## Run locally

The application must be served through HTTP or HTTPS. Do not open `index.html` directly through a `file://` URL.

### Python

```bash
python3 -m http.server 8080
```

Open:

```text
http://localhost:8080/
```

### Node.js

The repository includes a small static server:

```bash
npm start
```

Open:

```text
http://localhost:3000/
```

Any other static server works as well:

```bash
npx serve .
```

Open the address printed by `serve` in the terminal.

## Deploy to GitHub Pages

1. Ensure the main application file is named:

```text
index.html
```

2. Commit and push the project:

```bash
git add index.html server.js package.json package-lock.json README.md .gitignore
git commit -m "Update WebGPU and WebMCP test interface"
git push
```

3. Open the repository settings on GitHub.
4. Navigate to **Pages**.
5. Under **Build and deployment**, select **Deploy from a branch**.
6. Select the deployment branch, normally `main`.
7. Select the root folder `/`.
8. Save the configuration.
9. Wait for the Pages deployment workflow to complete.
10. Reload the deployed page with an uncached refresh:

```text
Ctrl + Shift + R
```

## Important notes

- WebMCP is experimental and requires a compatible Chrome version and the testing flag.
- The Chrome flag must be enabled separately on every browser profile or device used for testing.
- Mobile Chrome availability may differ from desktop Chrome, especially for experimental WebMCP functionality.
- WebGPU performance depends on the GPU, drivers, browser, available memory, and selected model.
- The first model initialization downloads model data and can require significant bandwidth and browser storage.
- Model inference runs locally in the browser after the required model assets have been downloaded.
- Internal Chrome pages such as `chrome://gpu` and `chrome://flags` cannot be opened directly by normal website JavaScript.
- GitHub Pages must serve `index.html` over HTTPS for the production deployment.
