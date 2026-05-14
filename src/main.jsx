import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import DentalPlanningTool from './oppd.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DentalPlanningTool />
  </StrictMode>,
)
