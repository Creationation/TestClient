import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './fonts.js'
import './index.css'
import Legal from './Legal.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Legal page={document.body.dataset.page} />
  </StrictMode>,
)
