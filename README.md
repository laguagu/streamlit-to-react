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

| Streamlit | React |
|-----------|-------|
| `st.text_area()` | `<textarea>` + `useState` |
| `st.button()` | `<button onClick={...}>` |
| `st.spinner()` | Loading state |
| `st.json()` | Custom display |

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
const [text, setText] = useState("")
const [result, setResult] = useState(null)

const handleSubmit = async () => {
  const data = await fetch('/api/extract-event', {
    method: 'POST',
    body: JSON.stringify({ text })
  })
  setResult(await data.json())
}
```

## CSC Rahti / OpenShift Deployment

### Internal Service Communication (Secure)

Backend doesn't need public access - frontend calls it internally:

**Backend:** Deploy as Service (no Route)
```bash
oc new-app backend:latest
oc expose deployment/backend --port=8000
# No "oc expose svc/backend" = internal only
```

**Frontend:** Deploy with Route, proxy to backend
```nginx
# In frontend nginx config
location /api {
    proxy_pass http://backend-service:8000;
}
```

**Frontend Route:**
```bash
oc new-app frontend:latest
oc expose svc/frontend
```

### Environment Variables

```bash
# Create secret for backend
oc create secret generic backend-secrets \
  --from-literal=OPENAI_API_KEY=sk-xxx

# Add to deployment
oc set env deployment/backend \
  --from=secret/backend-secrets
```

### Key Points
- Services communicate via DNS: `http://backend-service:8000`
- Only frontend needs public Route
- Backend stays internal = more secure
- Use OpenShift Secrets for API keys

## Using AI to Help Convert

### Complete Conversion Prompt

```
I have a Streamlit app I want to convert to React 19 + FastAPI:

[PASTE YOUR CODE]

Create:
1. FastAPI backend using OpenAI's .parse() method with Pydantic models
2. React 19 + TypeScript frontend with useState hooks
3. API service layer in src/services/api.ts
4. Include error handling and loading states

Keep it simple and well-commented.
```

### Step-by-Step Approach

1. **Analyze:** "List all Streamlit components in this app and their React equivalents"
2. **Backend:** "Create FastAPI endpoint for this Streamlit function"
3. **Frontend:** "Create React component for this Streamlit UI"
4. **Styling:** "Add modern CSS for this component"

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

## Troubleshooting

**CORS errors:** Check backend CORS config and Vite proxy
**API fails:** Verify backend is running on port 8000
**Build errors:** `rm -rf node_modules && npm install`
**Types errors:** Check TypeScript interfaces match API responses
