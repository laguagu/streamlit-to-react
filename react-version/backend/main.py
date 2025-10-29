"""
FastAPI Backend for Event Extractor
====================================

This is a simple FastAPI application that provides a single endpoint
for extracting event information from text using OpenAI's structured outputs.

This backend can be deployed separately from the frontend, allowing for
a clean separation of concerns and better scalability.

For CSC Rahti 2 deployment:
- This backend can run as an internal service (not exposed publicly)
- Frontend communicates with it via internal OpenShift service names
- Only the frontend needs to be exposed via a Route
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os
from typing import List

# Initialize FastAPI app
app = FastAPI(
    title="Event Extractor API",
    description="Extract structured event information from natural language text",
    version="1.0.0"
)

# CORS configuration
# For local development, we allow all origins
# For production (CSC Rahti), configure this to only allow your frontend domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production: ["https://your-frontend-domain.rahtiapp.fi"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
# The API key is read from the OPENAI_API_KEY environment variable
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


# Pydantic models for request and response validation
class EventRequest(BaseModel):
    """Request model for event extraction"""
    text: str

    class Config:
        json_schema_extra = {
            "example": {
                "text": "Alice and Bob are going to a science fair on Friday."
            }
        }


class CalendarEvent(BaseModel):
    """Response model for extracted event information"""
    name: str
    date: str
    participants: List[str]


class EventResponse(BaseModel):
    """Wrapper for successful event extraction"""
    success: bool = True
    event: CalendarEvent


class ErrorResponse(BaseModel):
    """Error response model"""
    success: bool = False
    error: str


# API Endpoints
@app.get("/")
def read_root():
    """
    Root endpoint - provides API information
    """
    return {
        "message": "Event Extractor API",
        "version": "1.0.0",
        "endpoints": {
            "POST /api/extract-event": "Extract event information from text"
        }
    }


@app.post("/api/extract-event", response_model=EventResponse)
def extract_event(request: EventRequest):
    """
    Extract event information from text using OpenAI structured outputs

    Args:
        request: EventRequest with text field

    Returns:
        EventResponse with extracted event information

    Raises:
        HTTPException: If OpenAI API call fails or API key is missing
    """
    # Check if OpenAI API key is configured
    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(
            status_code=500,
            detail="OpenAI API key not configured. Set OPENAI_API_KEY environment variable."
        )

    try:
        # Call OpenAI API with structured output using .parse()
        # This is simpler than using response_format with json_schema
        response = client.responses.parse(
            model="gpt-4o-2024-08-06",
            input=[
                {"role": "system", "content": "Extract the event information."},
                {"role": "user", "content": request.text}
            ],
            text_format=CalendarEvent,
        )

        # Get the parsed event directly from response
        event = response.output_parsed

        # Return structured response
        return EventResponse(
            success=True,
            event=event
        )

    except Exception as e:
        # Log the error (in production, use proper logging)
        print(f"Error extracting event: {str(e)}")

        # Return error response
        raise HTTPException(
            status_code=500,
            detail=f"Failed to extract event information: {str(e)}"
        )


# Run the application
# For local development: uvicorn main:app --reload --port 8000
# For production: uvicorn main:app --host 0.0.0.0 --port 8000
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
