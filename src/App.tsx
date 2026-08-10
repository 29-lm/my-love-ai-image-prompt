import { HashRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HomePage } from '@/pages/HomePage'
import { DetailPage } from '@/pages/DetailPage'
import { useDarkMode } from '@/hooks/useDarkMode'

function App() {
  const { dark, toggle } = useDarkMode()

  return (
    <HashRouter>
      <div className="min-h-screen bg-background text-foreground">
        <Header dark={dark} onToggleDark={toggle} />
        <main className="min-h-[calc(100vh-4rem-5rem)]">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/prompt/:slug" element={<DetailPage />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </HashRouter>
  )
}

export default App
