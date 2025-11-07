import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css' // (நம்முடைய Tailwind CSS-ஐ import செய்கிறது)
import { BrowserRouter } from 'react-router-dom' // <-- 1. இதை import செய்யவும்

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 2. BrowserRouter-ஐ இங்கே சேர்க்கவும் */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)