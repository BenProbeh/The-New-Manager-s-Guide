import { useCallback, useState } from 'react'
import BackButton from '../components/BackButton'
import PageCard from '../components/PageCard'
import { QUIZ_QUESTIONS_PER_ROUND } from '../data/quizQuestions'
import { buildQuizRound, getScoreMessage, gradeQuiz } from '../utils/quizEngine'

const LETTERS = ['א', 'ב', 'ג', 'ד']

export default function QuizPage() {
  const [phase, setPhase] = useState('intro')
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [grade, setGrade] = useState(null)

  const startQuiz = useCallback(() => {
    const round = buildQuizRound(QUIZ_QUESTIONS_PER_ROUND)
    setQuestions(round)
    setAnswers(Array(round.length).fill(null))
    setCurrentIndex(0)
    setGrade(null)
    setPhase('quiz')
  }, [])

  const selectAnswer = (optionIndex) => {
    setAnswers((prev) => {
      const next = [...prev]
      next[currentIndex] = optionIndex
      return next
    })
  }

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1)
      return
    }
    setAnswers((latestAnswers) => {
      setGrade(gradeQuiz(questions, latestAnswers))
      setPhase('results')
      return latestAnswers
    })
  }

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1)
  }

  const currentQuestion = questions[currentIndex]
  const progress = questions.length ? ((currentIndex + 1) / questions.length) * 100 : 0
  const canProceed = answers[currentIndex] !== null && answers[currentIndex] !== undefined

  return (
    <div className="page page--quiz">
      <div className="page__toolbar">
        <BackButton />
      </div>

      <PageCard variant="content" className="quiz-card">
        {phase === 'intro' && (
          <div className="quiz-intro">
            <header className="page-header page-header--section">
              <h1 className="page-header__title page-header__title--section">מבחן</h1>
              <p className="page-header__subtitle page-header__subtitle--section">
                מבחן אמריקאי על כל התוכן במדריך — {QUIZ_QUESTIONS_PER_ROUND} שאלות אקראיות בכל
                סיבוב, עם ציון, סיכום טעויות והסברים.
              </p>
            </header>
            <ul className="quiz-intro__list">
              <li>שאלות מכל הדפים: פלור, משלוחים, אחמשים, מטבח, משכורות ועוד</li>
              <li>בסיום — ציון באחוזים ופירוט מה טעית ומה התשובה הנכונה</li>
              <li>אפשר להתחיל מבחן חדש עם שאלות אחרות</li>
            </ul>
            <button type="button" className="quiz-btn quiz-btn--primary" onClick={startQuiz}>
              התחלת מבחן
            </button>
          </div>
        )}

        {phase === 'quiz' && currentQuestion && (
          <div className="quiz-active">
            <div className="quiz-progress">
              <div className="quiz-progress__meta">
                <span className="quiz-progress__section">{currentQuestion.section}</span>
                <span className="quiz-progress__count">
                  שאלה {currentIndex + 1} מתוך {questions.length}
                </span>
              </div>
              <div className="quiz-progress__bar" aria-hidden="true">
                <div className="quiz-progress__fill" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <h2 className="quiz-question">{currentQuestion.question}</h2>

            <div className="quiz-options" role="radiogroup" aria-label={currentQuestion.question}>
              {currentQuestion.options.map((option, index) => {
                const isSelected = answers[currentIndex] === index
                return (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className={`quiz-option ${isSelected ? 'quiz-option--selected' : ''}`}
                    onClick={() => selectAnswer(index)}
                  >
                    <span className="quiz-option__letter">{LETTERS[index]}</span>
                    <span className="quiz-option__text">{option}</span>
                  </button>
                )
              })}
            </div>

            <div className="quiz-nav">
              <button
                type="button"
                className="quiz-btn quiz-btn--ghost"
                onClick={goPrev}
                disabled={currentIndex === 0}
              >
                הקודם
              </button>
              <button
                type="button"
                className="quiz-btn quiz-btn--primary"
                onClick={goNext}
                disabled={!canProceed}
              >
                {currentIndex === questions.length - 1 ? 'סיום וציון' : 'הבא'}
              </button>
            </div>
          </div>
        )}

        {phase === 'results' && grade && (
          <div className="quiz-results">
            <header className="quiz-results__header">
              <p className="quiz-results__eyebrow">סיכום מבחן</p>
              <div
                className={`quiz-score quiz-score--${grade.scorePercent >= 75 ? 'good' : grade.scorePercent >= 60 ? 'ok' : 'low'}`}
              >
                <span className="quiz-score__value">{grade.scorePercent}%</span>
                <span className="quiz-score__detail">
                  {grade.correctCount} נכונות מתוך {grade.total}
                </span>
              </div>
              <p className="quiz-results__message">{getScoreMessage(grade.scorePercent)}</p>
            </header>

            {grade.results.some((item) => !item.isCorrect) ? (
              <section className="quiz-review">
                <h3 className="quiz-review__title">טעויות ותשובות נכונות</h3>
                <ul className="quiz-review__list">
                  {grade.results
                    .filter((item) => !item.isCorrect)
                    .map((item) => (
                      <li key={item.question.id} className="quiz-review__item">
                        <span className="quiz-review__section">{item.question.section}</span>
                        <p className="quiz-review__question">{item.question.question}</p>
                        <p className="quiz-review__wrong">
                          <strong>בחרת:</strong>{' '}
                          {item.selectedAnswer ?? 'לא נענתה'}
                        </p>
                        <p className="quiz-review__correct">
                          <strong>תשובה נכונה:</strong> {item.correctAnswer}
                        </p>
                        {item.question.explanation && (
                          <p className="quiz-review__explain">{item.question.explanation}</p>
                        )}
                      </li>
                    ))}
                </ul>
              </section>
            ) : (
              <p className="quiz-results__perfect">כל הכבוד — לא היו טעויות במבחן הזה.</p>
            )}

            <div className="quiz-results__actions">
              <button type="button" className="quiz-btn quiz-btn--primary" onClick={startQuiz}>
                מבחן חדש
              </button>
            </div>
          </div>
        )}
      </PageCard>
    </div>
  )
}
