import React from 'react';
import ReactDOM from 'react-dom/client';
import LandingPage from './LandingPage';
import './index.css';
import { supabase } from './supabase';

supabase.auth.getSession().then(({ data }) => {
  if (data?.session) {
    window.location.href = '/app.html';
  } else {
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <LandingPage onLoginClick={() => window.location.href = '/app.html'} />
      </React.StrictMode>,
    );
  }
});
