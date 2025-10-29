/**
 * API Service Layer
 *
 * This file contains all API calls to the backend.
 * It's a good practice to centralize API calls in one place.
 *
 * TypeScript benefits:
 * - Type safety for request/response data
 * - Autocomplete in your IDE
 * - Catch errors at compile time
 */

// Type definitions for our API
export interface EventRequest {
  text: string
}

export interface CalendarEvent {
  name: string
  date: string
  participants: string[]
}

export interface EventResponse {
  success: boolean
  event: CalendarEvent
}

export interface ErrorResponse {
  success: boolean
  error: string
}

/**
 * Extract event information from text
 *
 * @param text - The event description text
 * @returns Promise with extracted event data
 * @throws Error if the API call fails
 *
 * Example usage:
 * ```typescript
 * const result = await extractEvent("Alice and Bob are going to a science fair on Friday.")
 * console.log(result.event.name) // "science fair"
 * ```
 */
export async function extractEvent(text: string): Promise<EventResponse> {
  // Make POST request to our FastAPI backend
  // Thanks to Vite proxy, /api/* requests are forwarded to localhost:8000
  const response = await fetch('/api/extract-event', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  })

  // Check if response is OK (status 200-299)
  if (!response.ok) {
    // Try to parse error message from backend
    let errorMessage = 'Failed to extract event information'
    try {
      const errorData = await response.json()
      errorMessage = errorData.detail || errorMessage
    } catch {
      // If parsing fails, use default message
    }
    throw new Error(errorMessage)
  }

  // Parse and return the JSON response
  const data: EventResponse = await response.json()
  return data
}

/**
 * For CSC Rahti / OpenShift deployment:
 *
 * When deploying to OpenShift, update the API_BASE_URL:
 *
 * Option 1: Internal service (recommended for security)
 * - Backend is NOT exposed via Route
 * - Frontend calls backend via internal service name
 * - Example: 'http://backend-service:8000'
 *
 * Option 2: Public backend API
 * - Backend is exposed via Route
 * - Frontend calls backend via public URL
 * - Example: 'https://backend-api.rahtiapp.fi'
 *
 * You can use environment variables for this:
 * const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
 */
