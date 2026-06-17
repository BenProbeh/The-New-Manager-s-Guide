import {
  QUIZ_PRIORITY_PICKS,
  QUIZ_QUESTION_POOL,
  QUIZ_QUESTIONS_PER_ROUND,
} from '../data/quizQuestions'

function shuffleArray(items) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function pickFromSection(section, count, excludeIds = new Set()) {
  const pool = shuffleArray(
    QUIZ_QUESTION_POOL.filter((q) => q.section === section && !excludeIds.has(q.id)),
  )
  return pool.slice(0, count)
}

function prepareQuestion(question) {
  const indexedOptions = question.options.map((text, index) => ({
    text,
    originalIndex: index,
  }))
  const shuffled = shuffleArray(indexedOptions)

  return {
    id: question.id,
    section: question.section,
    question: question.question,
    explanation: question.explanation,
    options: shuffled.map((item) => item.text),
    correctIndex: shuffled.findIndex((item) => item.originalIndex === question.correctIndex),
  }
}

export function buildQuizRound(count = QUIZ_QUESTIONS_PER_ROUND) {
  const usedIds = new Set()
  const picked = []

  Object.entries(QUIZ_PRIORITY_PICKS).forEach(([section, sectionCount]) => {
    const fromSection = pickFromSection(section, sectionCount, usedIds)
    fromSection.forEach((q) => {
      usedIds.add(q.id)
      picked.push(q)
    })
  })

  const priorityTotal = Object.values(QUIZ_PRIORITY_PICKS).reduce((sum, n) => sum + n, 0)
  const remaining = count - priorityTotal

  if (remaining > 0) {
    const others = shuffleArray(
      QUIZ_QUESTION_POOL.filter((q) => !usedIds.has(q.id) && !QUIZ_PRIORITY_PICKS[q.section]),
    ).slice(0, remaining)
    others.forEach((q) => picked.push(q))
  }

  return shuffleArray(picked).map(prepareQuestion)
}

export function gradeQuiz(questions, answers) {
  const results = questions.map((question, index) => {
    const selectedIndex = answers[index]
    const isCorrect = selectedIndex === question.correctIndex

    return {
      question,
      selectedIndex,
      isCorrect,
      correctAnswer: question.options[question.correctIndex],
      selectedAnswer:
        selectedIndex !== null && selectedIndex !== undefined
          ? question.options[selectedIndex]
          : null,
    }
  })

  const correctCount = results.filter((item) => item.isCorrect).length
  const total = questions.length
  const scorePercent = total > 0 ? Math.round((correctCount / total) * 100) : 0

  return { results, correctCount, total, scorePercent }
}

export function getScoreMessage(percent) {
  if (percent === 100) return 'מושלם! שליטה מלאה בנושאים הקריטיים.'
  if (percent >= 90) return 'מצוין! את מוכנה לנהל שימועים, משכורות ודוחות ברמה גבוהה.'
  if (percent >= 75) return 'יפה מאוד — חזרי על פיטורים, משכורות ודוחות בנקודות שפספסת.'
  if (percent >= 60) return 'בסיס סביר — מומלץ לעבור שוב על דפי השימוע, המשכורות והדוחות.'
  return 'כדאי ללמוד לעומק את נושאי השימוע, המשכורות והדוחות ולנסות שוב.'
}
