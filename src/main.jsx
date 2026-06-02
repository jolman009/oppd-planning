import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './home.jsx'
import DentalPlanningTool from './dental.jsx'
import DVMPlanningTool from './veterinarian.jsx'
import PharmDPlanningTool from './pharmd.jsx'
import PAPlanningTool from './physician_assistant.jsx'
import MedicinePlanningTool from './medicine.jsx'
import OTPlanningTool from './occupational_therapy.jsx'
import PTPlanningTool from './physical_therapy.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dental" element={<DentalPlanningTool />} />
        <Route path="/veterinary" element={<DVMPlanningTool />} />
        <Route path="/pharmacy" element={<PharmDPlanningTool />} />
        <Route path="/physician-assistant" element={<PAPlanningTool />} />
        <Route path="/medicine" element={<MedicinePlanningTool />} />
        <Route path="/occupational-therapy" element={<OTPlanningTool />} />
        <Route path="/physical-therapy" element={<PTPlanningTool />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
)
