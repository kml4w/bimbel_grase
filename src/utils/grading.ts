export function calculateQuizGrade(
  answers: Record<string, string>,
  questions: any[],
  questionsCount: number
) {
  let correctCount = 0;
  const total = questionsCount;

  Object.keys(answers).forEach((questionId) => {
    const question = questions.find((q) => q.id === questionId);
    if (question && question.key === answers[questionId]) {
      correctCount++;
    }
  });

  const score = Math.round((correctCount / total) * 100);

  let gradeLetter = 'C';
  if (score >= 85) gradeLetter = 'A';
  else if (score >= 70) gradeLetter = 'B';

  return {
    correctCount,
    total,
    score,
    gradeLetter,
  };
}
