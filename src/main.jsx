import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './home.jsx'
import DentalPlanningTool from './dental.jsx'
import DVMPlanningTool from './veterinarian.jsx'
import PharmDPlanningTool from './pharmd.jsx'
import PAPlanningTool from './physician_assistant.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dental" element={<DentalPlanningTool />} />
        <Route path="/veterinary" element={<DVMPlanningTool />} />
        <Route path="/pharmacy" element={<PharmDPlanningTool />} />
        <Route path="/physician-assistant" element={<PAPlanningTool />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
)
