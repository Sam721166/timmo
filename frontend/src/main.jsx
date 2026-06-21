import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'
import Maintenance from './Maintenance'

const maintenance = true

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      {maintenance ? <Maintenance/> : <App />}
    </GoogleOAuthProvider>
  </StrictMode>,
)
