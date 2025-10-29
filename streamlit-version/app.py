import streamlit as st
from openai import OpenAI
from pydantic import BaseModel
import os

# Simple AI function using OpenAI structured outputs
# This can be easily converted to a FastAPI endpoint later
def extract_event_info(text: str) -> dict:
    """
    Extract event information from text using OpenAI structured outputs.
    Easy to convert to FastAPI endpoint: @app.post("/extract-event")
    """
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    class CalendarEvent(BaseModel):
        name: str
        date: str
        participants: list[str]
    
    try:
        # Call OpenAI API with structured output using .parse()
        # This is simpler than using response_format with json_schema
        response = client.responses.parse(
            model="gpt-4o-2024-08-06",
            input=[
                {"role": "system", "content": "Extract the event information."},
                {"role": "user", "content": text}
            ],
            text_format=CalendarEvent,
        )
        
        # Get the parsed event directly from response
        event = response.output_parsed
        
        # Convert Pydantic model to dict for Streamlit display
        return event.model_dump()
    except Exception as e:
        return {"error": str(e)}

# Page configuration
st.set_page_config(page_title="Simple Demo", layout="centered")

# Title
st.title("🎉 Welcome!")

# Description
st.write("This is a simple Streamlit application.")

# Text input
name = st.text_input("Enter your name:")
if name:
    st.write(f"Hello, {name}! 👋")

# Slider
age = st.slider("Select your age:", 0, 120, 25)
st.write(f"Your age: {age} years old")

# Selectbox
st.subheader("What do you enjoy doing?")
activity = st.selectbox(
    "Choose your favorite activity:",
    ["Programming", "Walking", "Reading", "Sports", "Other"]
)
st.write(f"You selected: **{activity}**")

# AI Demo Section
st.divider()
st.subheader("🤖 AI Event Extractor Demo")
st.write("Test the OpenAI structured output parser:")

event_text = st.text_area(
    "Enter event description:",
    "Alice and Bob are going to a science fair on Friday."
)

if st.button("Extract Event Info"):
    with st.spinner("Processing..."):
        result = extract_event_info(event_text)
        st.json(result)

# Button
if st.button("Click me!"):
    st.success("Great! 🎊")

# Divider
st.divider()
st.write("✨ Demo complete! ✨")
