import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import DraftsPage from './pages/DraftsPage'
import HomePage from './pages/HomePage'
import QuizPage from './pages/QuizPage'
import SectionPage from './pages/SectionPage'
import { NAV_ITEMS } from './data/navigation'

const SPECIAL_ROUTES = new Set(['drafts', 'quiz'])

export default function App() {
  const sectionItems = NAV_ITEMS.filter((item) => !SPECIAL_ROUTES.has(item.id))

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          {sectionItems.map((item) => (
            <Route
              key={item.id}
              path={item.path.slice(1)}
              element={<SectionPage />}
            />
          ))}
          <Route path="quiz" element={<QuizPage />} />
          <Route path="drafts" element={<DraftsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
