import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { SpeedInsights } from '@vercel/speed-insights/react'
import 'aos/dist/aos.css'
import 'lenis/dist/lenis.css'
import './index.css'
import './lib/firebase'
import { App } from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
      {/* 
        Vercel Speed Insights - Tracks Core Web Vitals and performance metrics
        Available props:
        - debug: Enable console logging (auto-enabled in development)
        - sampleRate: Control % of events sent (e.g., 0.5 for 50%)
        - beforeSend: Filter/modify events before sending
        - route: Specify dynamic routes for aggregation
        - endpoint: Custom endpoint for multi-project setups
        - scriptSrc: Alternative script source URL
        
        Learn more: https://vercel.com/docs/speed-insights
      */}
      <SpeedInsights />
    </HelmetProvider>
  </StrictMode>,
)
