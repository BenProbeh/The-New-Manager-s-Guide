export default function PageCard({ children, className = '', variant = 'default' }) {
  return (
    <div className={`page-card page-card--${variant} ${className}`.trim()}>
      <div className="page-card__halo page-card__halo--a" aria-hidden="true" />
      <div className="page-card__halo page-card__halo--b" aria-hidden="true" />
      <div className="page-card__halo page-card__halo--c" aria-hidden="true" />
      <div className="page-card__surface">
        <div className="page-card__sheen" aria-hidden="true" />
        {children}
      </div>
    </div>
  )
}
