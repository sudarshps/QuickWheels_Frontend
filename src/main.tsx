import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// import {AuthProvider} from './components/User/Auth Context/authContext.tsx'
import { Provider } from 'react-redux'
import store from './redux/store.ts'
import {GoogleOAuthProvider} from '@react-oauth/google'

const googleClientID = import.meta.env.VITE_AUTH_GOOGLE_CLIENT_ID
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientID}>
    <Provider store={store}>
    <App />
    </Provider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
