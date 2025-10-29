/**
 * EventExtractor Component
 *
 * This component handles the event extraction functionality.
 * It's similar to the AI Demo Section in our Streamlit app.
 *
 * Key React concepts used here:
 * - useState: Hook for managing component state
 * - Event handlers: Functions that respond to user actions
 * - Conditional rendering: Showing different UI based on state
 * - Async/await: Handling asynchronous API calls
 * - TypeScript: Type safety for props and state
 */

import { useState } from 'react'
import { extractEvent, type EventResponse } from '../services/api'
import './EventExtractor.css'

function EventExtractor() {
  // State management using React hooks
  // In Streamlit, state is managed automatically
  // In React, we use useState hook to create and update state

  // Text input state - similar to st.text_area() in Streamlit
  const [eventText, setEventText] = useState<string>(
    'Alice and Bob are going to a science fair on Friday.'
  )

  // Loading state - similar to st.spinner() in Streamlit
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Result state - stores the extracted event data
  const [result, setResult] = useState<EventResponse | null>(null)

  // Error state - stores any error messages
  const [error, setError] = useState<string | null>(null)

  /**
   * Handle form submission
   * This function is called when user clicks "Extract Event Info"
   *
   * In Streamlit: if st.button("Extract Event Info"):
   * In React: <button onClick={handleSubmit}>
   */
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission (page reload)
    e.preventDefault()

    // Validation - check if text is empty
    if (!eventText.trim()) {
      setError('Please enter some text to extract event information.')
      return
    }

    // Reset previous results and errors
    setError(null)
    setResult(null)

    // Set loading state (like st.spinner in Streamlit)
    setIsLoading(true)

    try {
      // Call the API service
      // This is similar to calling extract_event_info() in Streamlit
      const data = await extractEvent(eventText)

      // Update state with the result
      setResult(data)
    } catch (err) {
      // Handle errors
      const errorMessage = err instanceof Error ? err.message : 'Failed to extract event information'
      setError(errorMessage)
    } finally {
      // Always set loading to false when done
      setIsLoading(false)
    }
  }

  /**
   * Handle textarea input changes
   * This updates the eventText state as user types
   *
   * In Streamlit: st.text_area() returns the current value automatically
   * In React: We need to explicitly handle the onChange event
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEventText(e.target.value)
  }

  return (
    <div className="event-extractor">
      <div className="card">
        <h2>🤖 AI Event Extractor</h2>
        <p className="description">
          Enter a description of an event, and AI will extract structured information.
        </p>

        {/* Form - similar to Streamlit's interactive elements */}
        <form onSubmit={handleSubmit}>
          {/* Textarea - similar to st.text_area() */}
          <div className="form-group">
            <label htmlFor="event-text">Event Description:</label>
            <textarea
              id="event-text"
              value={eventText}
              onChange={handleInputChange}
              rows={4}
              placeholder="e.g., Alice and Bob are going to a science fair on Friday."
              disabled={isLoading}
            />
          </div>

          {/* Submit button - similar to st.button() */}
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading || !eventText.trim()}
          >
            {isLoading ? 'Processing...' : 'Extract Event Info'}
          </button>
        </form>

        {/* Conditional rendering of loading spinner */}
        {/* In Streamlit: with st.spinner("Processing...") */}
        {isLoading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Processing your request...</p>
          </div>
        )}

        {/* Display error if any */}
        {/* In Streamlit: st.error() */}
        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Display result */}
        {/* In Streamlit: st.json() */}
        {result && !error && (
          <div className="result">
            <h3>Extracted Event Information:</h3>
            <div className="event-details">
              <div className="detail-item">
                <strong>Event Name:</strong>
                <span>{result.event.name}</span>
              </div>
              <div className="detail-item">
                <strong>Date:</strong>
                <span>{result.event.date}</span>
              </div>
              <div className="detail-item">
                <strong>Participants:</strong>
                <ul>
                  {result.event.participants.map((participant, index) => (
                    <li key={index}>{participant}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Raw JSON view - similar to st.json() */}
            <details className="json-details">
              <summary>View Raw JSON</summary>
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </details>
          </div>
        )}
      </div>

      {/* Info section explaining the conversion */}
      <div className="info-card">
        <h3>💡 From Streamlit to React</h3>
        <p>
          This component replaces the Streamlit app's interactive elements:
        </p>
        <ul>
          <li><code>st.text_area()</code> → <code>&lt;textarea&gt;</code> with <code>useState</code></li>
          <li><code>st.button()</code> → <code>&lt;button onClick=&#123;...&#125;&gt;</code></li>
          <li><code>st.spinner()</code> → Conditional rendering with loading state</li>
          <li><code>st.json()</code> → Custom result display component</li>
        </ul>
      </div>
    </div>
  )
}

export default EventExtractor
