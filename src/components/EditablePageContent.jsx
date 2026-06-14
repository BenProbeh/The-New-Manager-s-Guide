import { useEffect, useState } from 'react'
import BackButton from './BackButton'
import ToolbarButton, { icons } from './ToolbarButton'
import PageCard from './PageCard'
import PageContent from './PageContent'
import {
  clearPageOverride,
  getPageOverride,
  setPageOverride,
} from '../utils/contentStorage'
import { blocksToEditableText, editableTextToBlocks } from '../utils/contentEditor'

export default function EditablePageContent({ pageId, defaultBlocks, title }) {
  const [blocks, setBlocks] = useState(defaultBlocks ?? [])
  const [isEditing, setIsEditing] = useState(false)
  const [draftText, setDraftText] = useState('')
  const [isModified, setIsModified] = useState(false)

  useEffect(() => {
    const saved = getPageOverride(pageId)
    if (saved) {
      setBlocks(saved)
      setIsModified(true)
    } else {
      setBlocks(defaultBlocks ?? [])
      setIsModified(false)
    }
    setIsEditing(false)
    setDraftText('')
  }, [pageId, defaultBlocks])

  const startEdit = () => {
    setDraftText(blocksToEditableText(blocks))
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setDraftText('')
  }

  const saveEdit = () => {
    const nextBlocks = editableTextToBlocks(draftText)
    setBlocks(nextBlocks)
    setPageOverride(pageId, nextBlocks)
    setIsModified(true)
    setIsEditing(false)
    setDraftText('')
  }

  const resetContent = () => {
    clearPageOverride(pageId)
    setBlocks(defaultBlocks ?? [])
    setIsModified(false)
    setIsEditing(false)
    setDraftText('')
  }

  return (
    <>
      <div className="page__toolbar page__toolbar--actions">
        <BackButton />
        <div className="page__toolbar-group">
          {!isEditing && (
            <>
              <ToolbarButton
                label="עריכה"
                ariaLabel="ערוך את תוכן הדף"
                icon={icons.edit}
                onClick={startEdit}
              />
              {isModified && (
                <ToolbarButton
                  label="שחזור"
                  ariaLabel="החזר את הדף לתוכן המקורי"
                  icon={icons.reset}
                  variant="reset"
                  onClick={resetContent}
                />
              )}
            </>
          )}
          {isEditing && (
            <>
              <ToolbarButton
                label="שמירה"
                ariaLabel="שמור את העריכה"
                icon={icons.save}
                variant="save"
                onClick={saveEdit}
              />
              <ToolbarButton
                label="ביטול"
                ariaLabel="בטל עריכה"
                icon={icons.cancel}
                variant="cancel"
                onClick={cancelEdit}
              />
            </>
          )}
        </div>
      </div>

      <PageCard variant="content">
        <header className="page-header page-header--section">
          <h1 className="page-header__title page-header__title--section">{title}</h1>
          {isModified && !isEditing && (
            <p className="page-header__edited-badge">נערך · ניתן לשחזר למקור</p>
          )}
        </header>

        {isEditing ? (
          <div className="page-editor">
            <label className="page-editor__label" htmlFor={`editor-${pageId}`}>
              עריכת תוכן — כותרות: ## כותרת · רשימות: - פריט · הדגשה: &gt; [important] טקסט
            </label>
            <textarea
              id={`editor-${pageId}`}
              className="page-editor__textarea"
              value={draftText}
              onChange={(event) => setDraftText(event.target.value)}
              dir="rtl"
            />
          </div>
        ) : (
          <PageContent blocks={blocks} />
        )}
      </PageCard>
    </>
  )
}
