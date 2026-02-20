Visa Application Guide — Static site + chatbot

Overview
- A simple static site with a rule-based chatbot for quick answers about visa applications.

Files
- index.html — main guide and chat UI
- styles.css — styles and responsive rules
- script.js — rule-based chatbot engine and API hook example

Run locally
1. Open `index.html` in a browser (double-click or use Live Server).

Optional: connect to an LLM backend
- The client includes an example fetch to `/api/chat`. Do NOT put API keys in client-side code.
- Create a small server to proxy requests to an LLM provider (OpenAI or others). Example Node/Express pseudocode:

```js
// Minimal example (do not use in production without auth)
const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());
app.post('/api/chat', async (req, res) => {
  const user = req.body.message;
  // call your provider with server-side key and return reply
  // e.g., call OpenAI or other model and return {reply: '...'}
  res.json({reply: 'Example server reply (implement provider call)'});
});
app.listen(3000);
```

Next steps
- I can implement the Node server proxy and example environment variables for OpenAI if you want.
- I can expand the FAQ dataset or add NLP matching for better intent handling.
 - I implemented a minimal Node/Express proxy server example to securely call an LLM from the client.
Additional UI features
- I added a small SVG logo at `assets/logo.svg` and placed it in the header.
- Dark mode: use the moon/sun button in the header to toggle; the choice is saved in `localStorage`.
- FAQ accordion: interactive accordion items in the FAQ section for better readability.
- Smooth navigation: top navigation links scroll smoothly to sections.

If you want more polish (logo image, custom colors, dark-mode preferences, or animations), tell me which items to prioritize and I will implement them.

Local server (example)
- Requirements: Node 18+ recommended.
- Install dependencies and start the server from the project folder:

```bash
npm install
cp .env.example .env
# edit .env to add your OPENAI_API_KEY
npm start
```

- Open the guide via the server at: http://localhost:3000/index.html

Server notes
- The server exposes `POST /api/chat` which proxies messages to the LLM provider using the `OPENAI_API_KEY` stored in the server environment. This keeps your API key off the client.
- The client-side `script.js` contains an example `sendToServer()` hook that POSTs `{message}` to `/api/chat` and expects a `{reply}` JSON response.

If you want, I can:
- Add input validation and rate-limiting to the server.
- Use the official OpenAI SDK or support multiple providers.
