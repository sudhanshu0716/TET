window.onerror = function(msg, url, lineNo, columnNo, error) {
  alert('Error: ' + msg + '\nLine: ' + lineNo + '\nColumn: ' + columnNo);
  return false;
};

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Force uninstall old service workers and reload to clear cache for all users automatically
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    if (registrations.length > 0) {
      for (let registration of registrations) {
        registration.unregister();
      }
      console.log("Old Service Worker cleared. Refreshing for latest version...");
      window.location.reload();
    }
  });
}
