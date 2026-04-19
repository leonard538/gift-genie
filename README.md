# Gift Genie

Gift Genie is an AI-powered gift idea generator. You describe the person, occasion, budget, and any constraints, then Gift Genie returns thoughtful, practical recommendations in clean, readable format.

## What It Does

- Accepts a natural-language gift request from the user
- Sends the request to an AI backend endpoint
- Returns structured gift suggestions
- Renders markdown output in the UI
- Sanitizes rendered HTML for safer display

## Tech Stack

- Frontend: HTML, CSS, JavaScript (ES modules)
- Build tool / dev server: Vite
- Backend API: Node.js + Express
- AI SDK: OpenAI JavaScript SDK
- Markdown rendering: marked
- Output sanitization: DOMPurify
- Environment config: dotenv

## Project Structure

- `index.html` - main app shell
- `src/index.js` - client logic and request handling
- `src/server.js` - Express server and AI call
- `src/utils.js` - UI helpers and utility functions
- `src/style.css` - styles and UI presentation
- `vite.config.js` - Vite config and API proxy setup

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment variables

Create a `.env` file in the project root with:

```env
AI_KEY=your_api_key
AI_URL=your_provider_base_url
AI_MODEL=your_model_name
PORT=3001
```

### 3. Run backend server

```bash
node src/server.js
```

### 4. Run frontend dev server

In a second terminal:

```bash
npm run dev
```

Then open the Vite URL shown in terminal (usually `http://localhost:5173`).

## Notes

- The frontend sends requests to `/api/gift`.
- Vite proxies `/api` requests to the Express server running on port `3001`.
- The app currently keeps conversation context in memory while the server is running.

## Future Improvements

- Add streaming AI responses for faster feedback
- Add rate limiting and request validation
- Persist history per user/session
- Improve prompt controls for gift style and tone

---

This project was built with Scrimba: https://scrimba.com/?via=u42c5f8e
