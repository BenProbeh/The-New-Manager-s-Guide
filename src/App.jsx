import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import DraftsPage from './pages/DraftsPage'
import HomePage from './pages/HomePage'
import SectionPage from './pages/SectionPage'
import { NAV_ITEMS } from './data/navigation'

export default function App() {
  const sectionItems = NAV_ITEMS.filter((item) => item.id !== 'drafts')

  return (
    <BrowserRouter>
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
          <Route path="drafts" element={<DraftsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
