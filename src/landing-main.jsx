import React from 'react';
import ReactDOM from 'react-dom/client';
import LandingPage from './LandingPage';
import './index.css';

// If launched as an installed PWA, immediately redirect to the core app interface.
// This handles older installations that still have the legacy start_url cached.
const isPWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
if (isPWA) {
  window.location.replace('/app.html' + window.location.search + window.location.hash);
} else {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <LandingPage onLoginClick={() => window.location.href = '/app.html'} />
    </React.StrictMode>,
  );
}
