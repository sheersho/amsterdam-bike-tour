import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { registerServiceWorker } from './lib/offlineCache.js'

// Register Phase 2 service worker for offline map / audio caching
registerServiceWorker();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)