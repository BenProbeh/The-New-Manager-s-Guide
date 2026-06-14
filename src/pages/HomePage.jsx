import BackButton from '../components/BackButton'
import PageCard from '../components/PageCard'
import { APP_TITLE } from '../data/navigation'

export default function HomePage() {
  return (
    <div className="page page--home">
      <div className="page__toolbar">
        <BackButton />
      </div>
      <PageCard variant="hero">
        <header className="page-header page-header--hero">
          <p className="page-header__welcome">
            <span className="page-header__eyebrow-dot" aria-hidden="true" />
            ברוכה הבאה עידן כושר בהצלחה!
          </p>
          <h1 className="page-header__title page-header__title--main">{APP_TITLE}</h1>
          <p className="page-header__subtitle">
            בחרי קטגוריה מהתפריט בצד ימין כדי להתחיל לנהל את המסעדה
          </p>
        </header>
      </PageCard>
    </div>
  )
}
