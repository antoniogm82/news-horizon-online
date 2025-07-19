import { createRoot } from 'react-dom/client'
import { lazy, Suspense } from 'react'
import './index.css'

// Lazy load the main App component for better performance
const App = lazy(() => import('./App.tsx'))

// Loading component optimized for CLS
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
)

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<PageLoader />}>
    <App />
  </Suspense>
);
