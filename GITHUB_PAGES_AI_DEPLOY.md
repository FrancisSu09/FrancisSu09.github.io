# GitHub Pages AI ChatBot Deployment

GitHub Pages can host only static files. It cannot run `server.js`, read `.env`, or safely keep `GEMINI_API_KEY`.

Use this layout:

1. GitHub Pages hosts the website files.
2. A backend platform hosts `api/chat.js` or `server.js`.
3. The backend platform stores `GEMINI_API_KEY` as an environment variable.
4. `config.js` on GitHub Pages stores only the backend URL, never the API key.

## Local Test

Create `.env`:

```env
GEMINI_API_KEY=your_real_key
PORT=3000
ALLOWED_ORIGINS=http://127.0.0.1:3000,http://localhost:3000
```

Run:

```bash
npm start
```

Open:

```text
http://127.0.0.1:3000
```

## GitHub Pages Frontend

Keep this in `config.js` after your backend is deployed:

```js
window.IHEALTH_CONFIG = {
    chatApiUrl: "https://your-backend-domain.example/api/chat"
};
```

Do not put `GEMINI_API_KEY` in `config.js`, `main.js`, or any frontend file.

## Vercel Backend Option

This project includes `api/chat.js`, which can run as a Vercel Serverless Function.

In Vercel, set environment variables:

```text
GEMINI_API_KEY=your_real_key
ALLOWED_ORIGINS=https://your-github-username.github.io
```

After Vercel deploys, your API endpoint will look like:

```text
https://your-vercel-project.vercel.app/api/chat
```

Put that endpoint into `config.js`, then push the frontend to GitHub Pages.

## Render Backend Option

Render can run the local Node server with:

```bash
npm start
```

Set environment variables:

```text
GEMINI_API_KEY=your_real_key
ALLOWED_ORIGINS=https://your-github-username.github.io
HOST=0.0.0.0
PORT=10000
```

Render will provide a public URL. Use:

```text
https://your-render-service.onrender.com/api/chat
```

in `config.js`.
