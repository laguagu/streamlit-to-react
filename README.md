# Streamlit to React Conversion Demo

Demo showing how to convert a Streamlit app to React 19 + FastAPI.

## What's This?

A simple AI event extractor app in two versions:

- **Streamlit** (original) - Single Python file
- **React + FastAPI** - Separated frontend/backend

Both do the same thing: Extract event info (name, date, participants) from text using OpenAI.

## Quick Start

### Streamlit Version

```bash
cd streamlit-version
pip install -r requirements.txt
export OPENAI_API_KEY=your_key_here
streamlit run app.py
```

Open: `http://localhost:8501`

### React Version

**Backend:**

```bash
cd react-version/backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add OPENAI_API_KEY
uvicorn main:app --reload
```

**Frontend (new terminal):**

```bash
cd react-version/frontend
npm install
npm run dev
```

Open: `http://localhost:3000`

## Key Differences

### Streamlit

- Everything in one `app.py` file
- State managed automatically
- Quick prototyping
- Python only

### React + FastAPI

- Frontend (React) and backend (FastAPI) separated
- Manual state management with `useState`
- More control over UI/UX
- TypeScript + Python

## Architecture

**Streamlit:**

```
app.py → UI + Logic + API calls
```

**React + FastAPI:**

```
React Frontend → HTTP → FastAPI Backend → OpenAI
```

## Converting Streamlit to React

### 1. Identify Components

| Streamlit        | React                     |
| ---------------- | ------------------------- |
| `st.text_area()` | `<textarea>` + `useState` |
| `st.button()`    | `<button onClick={...}>`  |
| `st.spinner()`   | Loading state             |
| `st.json()`      | Custom display            |

### 2. Create Backend API

Extract logic from Streamlit to FastAPI:

```python
# Streamlit
def extract_event(text):
    response = client.responses.parse(...)
    return response.output_parsed

# FastAPI
@app.post("/api/extract-event")
def extract_event(request: EventRequest):
    response = client.responses.parse(...)
    return {"event": response.output_parsed}
```

### 3. Create React Component

```tsx
const [text, setText] = useState("");
const [result, setResult] = useState(null);

const handleSubmit = async () => {
  const data = await fetch("/api/extract-event", {
    method: "POST",
    body: JSON.stringify({ text }),
  });
  setResult(await data.json());
};
```

## Deployment

### Deployment Architecture

- **Backend:** Internal service (no public route needed)
- **Frontend:** Public route with proxy to backend
- **Communication:** Frontend proxies API calls to backend internally
- **Security:** API keys stored in secrets/environment variables

### Key Considerations

- Backend service accessible only within cluster
- Frontend handles all external traffic and proxies to backend
- Use secrets management for sensitive credentials
- Configure CORS appropriately for your setup

## React Quick Reference

```tsx
// State
const [value, setValue] = useState(initial)

// Event handler
<button onClick={handleClick}>Click</button>

// Form input
<input
  value={text}
  onChange={(e) => setText(e.target.value)}
/>

// Conditional rendering
{loading && <Spinner />}
{error && <Error />}

// API call
const data = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ data })
}).then(r => r.json())
```

## Project Structure

```
streamlit-version/
├── app.py                 # Streamlit app
└── requirements.txt

react-version/
├── backend/
│   ├── main.py           # FastAPI endpoints
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/   # React components
    │   ├── services/     # API calls
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    └── vite.config.ts
```
