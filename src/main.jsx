import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css'; // This still imports all the CSS files

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
