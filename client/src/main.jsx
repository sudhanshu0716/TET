import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Force uninstall old service workers and clear caches for all users automatically
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    if (registrations.length > 0) {
      for (let registration of registrations) {
        registration.unregister();
      }
      // If we found a SW, also clear the Caches API for good measure
      if ('caches' in window) {
        caches.keys().then(names => {
          for (let name of names) caches.delete(name);
        });
      }
      console.log("Old Service Worker and Caches cleared. Refreshing...");
      window.location.reload();
    }
  });
}
