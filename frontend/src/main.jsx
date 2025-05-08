import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <GoogleOAuthProvider clientId="876792457486-43j6p7k79nfi39d5u7knmai9nkla1tgb.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
  // </StrictMode>,
)
