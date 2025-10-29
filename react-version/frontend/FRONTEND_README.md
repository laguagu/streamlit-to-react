# React 19 Frontend - Event Extractor

Modern React 19 application built with Vite and TypeScript. This frontend communicates with the FastAPI backend to extract structured event information from natural language.

## Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- Backend API running on `http://localhost:8000` (see `../backend/README.md`)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment (Optional)

For local development, the Vite proxy automatically forwards API requests to the backend, so no configuration is needed.

For production deployment:

```bash
cp .env.example .env
```

Edit `.env` and set your backend URL:
```
VITE_API_URL=https://your-backend-url.com
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at: `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── EventExtractor.tsx
│   │   └── EventExtractor.css
│   ├── services/            # API service layer
│   │   └── api.ts
│   ├── App.tsx              # Main app component
│   ├── App.css
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript config
└── package.json
```

## Key Concepts for React Beginners

### 1. Components
Components are the building blocks of React apps. Each component is a reusable piece of UI.

```tsx
function MyComponent() {
  return <div>Hello World</div>
}
```

### 2. State with useState
State allows components to remember information and react to changes.

```tsx
const [count, setCount] = useState(0)  // Initialize state
setCount(count + 1)                    // Update state
```

### 3. Event Handlers
Functions that run when users interact with your UI.

```tsx
<button onClick={handleClick}>Click me</button>
```

### 4. Conditional Rendering
Show different UI based on conditions.

```tsx
{isLoading && <Spinner />}
{error && <ErrorMessage />}
```

### 5. TypeScript Benefits
- Autocomplete in your IDE
- Catch errors before running code
- Better documentation through types

## Comparison with Streamlit

| Streamlit | React |
|-----------|-------|
| `st.text_area()` | `<textarea>` with `useState` |
| `st.button()` | `<button onClick={...}>` |
| `st.spinner()` | Conditional rendering with loading state |
| `st.json()` | Custom component to display JSON |
| Automatic state | Manual state with `useState` |
| Python backend | Separate API calls |

## Building for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized static files ready for deployment.

## Deploying to CSC Rahti / OpenShift

1. Build the production bundle: `npm run build`
2. Serve the `dist/` folder using a web server (e.g., nginx, serve)
3. Configure environment variables to point to your backend
4. Set up an OpenShift Route to expose the frontend

See `../../docs/CSC_RAHTI_GUIDE.md` for detailed deployment instructions.

## API Integration

The frontend communicates with the backend via the `/api/extract-event` endpoint.

**Request:**
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

All API calls are centralized in `src/services/api.ts` for easy maintenance.

## Troubleshooting

### CORS Errors
- For local development, ensure the backend is running on port 8000
- The Vite proxy in `vite.config.ts` handles CORS during development
- For production, configure CORS in the FastAPI backend

### Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `rm -rf node_modules/.vite`
- Update dependencies: `npm update`

### TypeScript Errors
- Check `tsconfig.json` configuration
- Ensure all imports have correct paths
- Run `npm run build` to see all type errors

## Learning Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- See `../../docs/REACT_CHEATSHEET.md` for quick reference
