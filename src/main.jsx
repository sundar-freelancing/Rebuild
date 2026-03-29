import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { SpeedInsights } from '@vercel/speed-insights/react'
import 'aos/dist/aos.css'
import 'lenis/dist/lenis.css'
import './index.css'
import './lib/firebase'
import { App } from './App.jsx'

const container = document.getElementById('root')

// If the page was pre-rendered at build time, hydrate the existing HTML.
// Otherwise (dev server or first-ever load) do a normal createRoot render.
const isPrerendered = document.documentElement.hasAttribute('data-prerendered')

if (isPrerendered) {
  hydrateRoot(
    container,
    <StrictMode>
      <HelmetProvider>
        <App />
        <SpeedInsights />
      </HelmetProvider>
    </StrictMode>,
  )
} else {
  createRoot(container).render(
    <StrictMode>
      <HelmetProvider>
        <App />
        <SpeedInsights />
      </HelmetProvider>
    </StrictMode>,
  )
}

