# Mentorcliq

A personalized version of the O&T Growth Engine with an embedded AI navigation assistant from the NBCU capstone project.

## Stack

- Landing page: HTML/CSS with a Python static server
- Assistant UI: vanilla JavaScript widget (`assistant.js`)
- Assistant source (optional React build): `frontend/`
- Assistant API: Node.js + Express + Claude API (optional)

## Setup

Install backend dependencies:

```bash
npm install --prefix backend
```

Optional: copy the backend environment file and add a Claude API key for live AI responses.

```bash
cp backend/.env.example backend/.env
```

Without a key, the assistant still works using deterministic fallback answers from mock NBCU resources.

Optional React development setup:

```bash
npm run install:all
npm run build:assistant
```

## Run locally

Double-click **`start.bat`** in the project folder.

Or run this in a terminal from the project folder:

```bash
python main.py
```

Then open **http://localhost:8000** in your browser.

The server opens the browser automatically. Keep the terminal window open while you use the site.

You do **not** need Node.js for the page or assistant to work. Python serves both the site and the navigation API.

Optional Node backend (only if you want Claude API responses):

```bash
npm install --prefix backend
npm run start:backend
```

If the Node backend is running, Python will use it automatically. Otherwise it uses built-in fallback answers.

## Assistant development

The page uses `assistant.js` by default so it works without a frontend build.

To work on the React source with hot reload:

```bash
npm run start:frontend
```

That runs Vite on `http://localhost:5173` with API proxying enabled. Rebuild with `npm run build:assistant` to update the bundled assets in `assistant/`.

## API

`POST /api/navigate`

```json
{
  "question": "Where do I request software access?"
}
```

Returns guidance with answer, next steps, resources, confidence, and escalation details.
