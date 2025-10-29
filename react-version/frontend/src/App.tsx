/**
 * Main App Component
 *
 * This is the root component of our React application.
 * It contains the EventExtractor component which handles the main functionality.
 *
 * In React, components are the building blocks of the UI.
 * This component is similar to the main page in our Streamlit app (app.py).
 */

import EventExtractor from './components/EventExtractor'
import './App.css'

function App() {
  return (
    <div className="app">
      {/* Header section - similar to st.title() in Streamlit */}
      <header className="app-header">
        <h1>🎉 Event Extractor</h1>
        <p className="subtitle">
          Extract structured event information from natural language using AI
        </p>
      </header>

      {/* Main content area */}
      <main className="app-main">
        {/*
          EventExtractor component
          This is where the main functionality lives
          Components can be reused throughout your app
        */}
        <EventExtractor />
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>✨ Converted from Streamlit to React 19 ✨</p>
        <p className="footer-note">
          Backend: FastAPI | Frontend: React 19 + Vite
        </p>
      </footer>
    </div>
  )
}

export default App
