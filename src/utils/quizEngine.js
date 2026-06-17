import { QUIZ_QUESTION_POOL, QUIZ_QUESTIONS_PER_ROUND } from '../data/quizQuestions'

function shuffleArray(items) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function buildQuizRound(count = QUIZ_QUESTIONS_PER_ROUND) {
  const picked = shuffleArray(QUIZ_QUESTION_POOL).slice(0, count)

  return picked.map((question) => {
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
  })
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
  if (percent === 100) return 'מושלם! את מכירה את המדריך כמו כף היד.'
  if (percent >= 90) return 'מצוין! את מוכנה לנהל את הסניף ברמה גבוהה.'
  if (percent >= 75) return 'יפה מאוד — יש בסיס חזק, כדאי לחזור על הנקודות שפספסת.'
  if (percent >= 60) return 'לא רע — מומלץ לעבור שוב על הדפים הרלוונטיים.'
  return 'כדאי לקרוא שוב את המדריך ולנסות מבחן חדש.'
}
