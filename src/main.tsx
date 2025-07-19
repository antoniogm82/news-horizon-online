import { createRoot } from 'react-dom/client'
import { lazy, Suspense } from 'react'
import './index.css'

// Lazy load the main App component for better performance
const App = lazy(() => import('./App.tsx'))

// Loading component optimized for CLS and performance
const PageLoader = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
  </div>
)

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<PageLoader />}>
    <App />
  </Suspense>
);
