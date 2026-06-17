import { Navigate, useLocation } from 'react-router-dom'
import EditablePageContent from '../components/EditablePageContent'
import { PAGE_CONTENT } from '../data/pageContent'
import { NAV_ITEMS } from '../data/navigation'

export default function SectionPage() {
  const location = useLocation()
  const section = NAV_ITEMS.find(
    (item) => item.path === location.pathname && !['drafts', 'quiz'].includes(item.id),
  )

  if (!section) {
    return <Navigate to="/" replace />
  }

  const content = PAGE_CONTENT[section.id]

  return (
    <div className="page page--section">
      {content && (
        <EditablePageContent
          pageId={section.id}
          defaultBlocks={content.blocks}
          title={section.label}
        />
      )}
    </div>
  )
}
