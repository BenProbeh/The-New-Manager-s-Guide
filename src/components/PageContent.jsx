import { useState } from 'react'
import ImageLightbox from './ImageLightbox'

function Callout({ variant = 'default', text }) {
  return <aside className={`content-callout content-callout--${variant}`}>{text}</aside>
}

function SupplierCard({ label, phone, contact, note }) {
  return (
    <div className="supplier-card">
      <h3 className="supplier-card__label">{label}</h3>
      <a className="supplier-card__phone" href={`tel:${phone.replace(/-/g, '')}`}>
        {phone}
      </a>
      {contact && <p className="supplier-card__contact">{contact}</p>}
      {note && <p className="supplier-card__note">{note}</p>}
    </div>
  )
}

function ContentImage({ heading, src, alt, onOpen }) {
  return (
    <figure className="content-image">
      {heading && <h2 className="content-heading content-heading--image">{heading}</h2>}
      <button
        type="button"
        className="content-image__trigger"
        onClick={() => onOpen({ src, alt, heading })}
        aria-label={`הגדל תמונה: ${heading || alt || 'תמונה'}`}
      >
        <div className="content-image__frame">
          <div className="content-image__glow" aria-hidden="true" />
          <img src={src} alt={alt ?? heading ?? ''} className="content-image__img" loading="lazy" />
          <span className="content-image__zoom" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3M11 8v6M8 11h6" />
            </svg>
          </span>
        </div>
      </button>
      <figcaption className="content-image__caption">לחצי על התמונה להגדלה</figcaption>
    </figure>
  )
}

function renderBlock(block, index, onOpenImage) {
  switch (block.type) {
    case 'heading':
      return (
        <h2 key={index} className="content-heading">
          {block.text}
        </h2>
      )

    case 'paragraph':
      return (
        <p key={index} className="content-paragraph">
          {block.text}
        </p>
      )

    case 'list':
      return (
        <ul key={index} className="content-list">
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex} className="content-list__item">
              {item}
            </li>
          ))}
        </ul>
      )

    case 'callout':
      return <Callout key={index} variant={block.variant} text={block.text} />

    case 'suppliers':
      return (
        <div key={index} className="supplier-grid">
          {block.items.map((item, itemIndex) => (
            <SupplierCard key={itemIndex} {...item} />
          ))}
        </div>
      )

    case 'image':
      return (
        <ContentImage
          key={index}
          heading={block.heading}
          src={block.src}
          alt={block.alt}
          onOpen={onOpenImage}
        />
      )

    default:
      return null
  }
}

export default function PageContent({ blocks }) {
  const [lightboxImage, setLightboxImage] = useState(null)

  if (!blocks?.length) {
    return null
  }

  return (
    <>
      <article className="page-content">
        {blocks.map((block, index) => renderBlock(block, index, setLightboxImage))}
      </article>

      {lightboxImage && (
        <ImageLightbox
          src={lightboxImage.src}
          alt={lightboxImage.alt}
          heading={lightboxImage.heading}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </>
  )
}
