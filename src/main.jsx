import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import {FirebaseContext} from './store/Context';
import {
  auth,
  db,
  storage,
  googleProvider,
  signup,
  login,
  signupWithGoogle,
  logout,
  createProduct,
} from "./firebase/config.js";

import Context from './store/Context'


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <FirebaseContext.Provider value={{
        auth,
        db,
        storage,
        googleProvider,
        signup,
        login,
        signupWithGoogle,
        logout,
        createProduct
      }}>
     <Context>
     <App />
     </Context> 
    </FirebaseContext.Provider>
  </StrictMode>,
)
