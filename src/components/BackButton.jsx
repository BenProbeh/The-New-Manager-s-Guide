import { useNavigate } from 'react-router-dom'

export default function BackButton() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <button
      type="button"
      className="back-btn"
      onClick={handleBack}
      aria-label="חזור לדף הקודם"
    >
      <span className="back-btn__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </span>
      <span className="back-btn__label">חזור</span>
    </button>
  )
}
