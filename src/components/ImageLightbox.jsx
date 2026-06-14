import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function ImageLightbox({ src, alt, heading, onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return createPortal(
    <div
      className="image-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={heading || alt || 'תמונה מוגדלת'}
      onClick={onClose}
    >
      <button
        type="button"
        className="image-lightbox__close"
        onClick={onClose}
        aria-label="סגור תמונה"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      {heading && <p className="image-lightbox__title">{heading}</p>}

      <div className="image-lightbox__stage" onClick={(event) => event.stopPropagation()}>
        <img src={src} alt={alt ?? heading ?? ''} className="image-lightbox__img" />
      </div>
    </div>,
    document.body,
  )
}
