# FastAPI Backend - Event Extractor API

Simple FastAPI backend that provides an API endpoint for extracting structured event information from natural language text using OpenAI.

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-...your-key-here
```

### 3. Run the Server

**Development mode (with auto-reload):**
```bash
uvicorn main:app --reload --port 8000
```

**Production mode:**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

## API Documentation

Once the server is running, you can access:
- **Interactive API docs**: http://localhost:8000/docs
- **Alternative docs**: http://localhost:8000/redoc

## API Endpoints

### `GET /`
Root endpoint with API information

### `GET /health`
Health check endpoint (useful for OpenShift probes)

### `POST /api/extract-event`
Extract event information from text

**Request body:**
```json
{
  "text": "Alice and Bob are going to a science fair on Friday."
}
```

**Response:**
```json
{
  "success": true,
  "event": {
    "name": "science fair",
    "date": "Friday",
    "participants": ["Alice", "Bob"]
  }
}
```

## Testing the API

### Using curl
```bash
curl -X POST "http://localhost:8000/api/extract-event" \
  -H "Content-Type: application/json" \
  -d '{"text": "Alice and Bob are going to a science fair on Friday."}'
```

### Using Python
```python
import requests

response = requests.post(
    "http://localhost:8000/api/extract-event",
    json={"text": "Alice and Bob are going to a science fair on Friday."}
)

print(response.json())
```

## For CSC Rahti 2 / OpenShift

This backend is designed to run as an internal service:
- Deploy as a separate pod/service
- No public Route needed (frontend will access it internally)
- Frontend communicates via internal service name: `http://backend-service:8000`
- Set `OPENAI_API_KEY` as a Secret in OpenShift

See the main documentation for detailed OpenShift deployment instructions.
