import { useEffect, useState } from 'react'
import BackButton from '../components/BackButton'
import PageCard from '../components/PageCard'
import ToolbarButton, { icons } from '../components/ToolbarButton'
import { createDraftId, getDrafts, saveDrafts } from '../utils/contentStorage'

const emptyDraft = { title: '', content: '' }

export default function DraftsPage() {
  const [drafts, setDrafts] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [form, setForm] = useState(emptyDraft)

  useEffect(() => {
    setDrafts(getDrafts())
  }, [])

  const persist = (nextDrafts) => {
    setDrafts(nextDrafts)
    saveDrafts(nextDrafts)
  }

  const startNew = () => {
    setActiveId('new')
    setForm(emptyDraft)
  }

  const editDraft = (draft) => {
    setActiveId(draft.id)
    setForm({ title: draft.title, content: draft.content })
  }

  const saveDraft = () => {
    if (!form.title.trim() && !form.content.trim()) {
      return
    }

    const now = new Date().toISOString()

    if (activeId === 'new') {
      const draft = {
        id: createDraftId(),
        title: form.title.trim() || 'טיוטה ללא כותרת',
        content: form.content,
        updatedAt: now,
      }
      persist([draft, ...drafts])
      setActiveId(draft.id)
      return
    }

    const nextDrafts = drafts.map((draft) =>
      draft.id === activeId
        ? {
            ...draft,
            title: form.title.trim() || 'טיוטה ללא כותרת',
            content: form.content,
            updatedAt: now,
          }
        : draft,
    )
    persist(nextDrafts)
  }

  const deleteDraft = (id) => {
    persist(drafts.filter((draft) => draft.id !== id))
    if (activeId === id) {
      setActiveId(null)
      setForm(emptyDraft)
    }
  }

  return (
    <div className="page page--section page--drafts">
      <div className="page__toolbar">
        <BackButton />
      </div>

      <PageCard variant="content">
        <header className="page-header page-header--section">
          <h1 className="page-header__title page-header__title--section">טיוטות</h1>
          <p className="page-header__subtitle page-header__subtitle--section">
            רשמי כאן הערות וטיוטות — הכל נשמר אוטומטית במכשיר שלך
          </p>
        </header>

        <div className="drafts-layout">
          <aside className="drafts-sidebar">
            <ToolbarButton
              label="טיוטה חדשה"
              icon={icons.add}
              variant="save"
              className="drafts-sidebar__new"
              onClick={startNew}
            />

            {drafts.length === 0 ? (
              <p className="drafts-empty">אין טיוטות עדיין. לחצי על "טיוטה חדשה" כדי להתחיל.</p>
            ) : (
              <ul className="drafts-list">
                {drafts.map((draft) => (
                  <li key={draft.id}>
                    <button
                      type="button"
                      className={`drafts-list__item ${activeId === draft.id ? 'drafts-list__item--active' : ''}`}
                      onClick={() => editDraft(draft)}
                    >
                      <span className="drafts-list__title">{draft.title}</span>
                      <span className="drafts-list__date">
                        {new Date(draft.updatedAt).toLocaleDateString('he-IL')}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          <div className="drafts-editor">
            {activeId ? (
              <>
                <input
                  type="text"
                  className="drafts-editor__title"
                  placeholder="כותרת הטיוטה"
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  dir="rtl"
                />
                <textarea
                  className="drafts-editor__textarea page-editor__textarea"
                  placeholder="כתבי כאן את הטיוטה שלך..."
                  value={form.content}
                  onChange={(event) => setForm({ ...form, content: event.target.value })}
                  dir="rtl"
                />
                <div className="drafts-editor__actions">
                  <ToolbarButton label="שמירה" icon={icons.save} variant="save" onClick={saveDraft} />
                  {activeId !== 'new' && (
                    <ToolbarButton
                      label="מחיקה"
                      icon={icons.delete}
                      variant="cancel"
                      onClick={() => deleteDraft(activeId)}
                    />
                  )}
                </div>
              </>
            ) : (
              <div className="drafts-placeholder">
                בחרי טיוטה מהרשימה או צרי טיוטה חדשה
              </div>
            )}
          </div>
        </div>
      </PageCard>
    </div>
  )
}
