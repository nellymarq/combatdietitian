import { useState } from 'react';

interface Question {
  id: string;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface Props {
  moduleSlug: string;
  questions: Question[];
  passingScore: number;
  previousScore?: number | null;
}

export default function Quiz({ moduleSlug, questions, passingScore, previousScore }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const allAnswered = Object.keys(answers).length === questions.length;
  const passed = score !== null && score >= passingScore;

  function selectAnswer(questionId: string, optionIndex: number) {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  }

  async function handleSubmit() {
    if (!allAnswered || submitted) return;

    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct) correct++;
    });
    const pct = Math.round((correct / questions.length) * 100);
    setScore(pct);
    setSubmitted(true);

    // Save progress
    setSaving(true);
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleSlug,
          quizScore: pct,
          quizAnswers: answers,
        }),
      });
      if (!res.ok) throw new Error('Failed to save');
    } catch {
      setError('Score saved locally but failed to sync. Try refreshing.');
    } finally {
      setSaving(false);
    }
  }

  function retake() {
    setAnswers({});
    setSubmitted(false);
    setScore(null);
    setError('');
  }

  return (
    <div className="space-y-8">
      {previousScore !== null && previousScore !== undefined && !submitted && (
        <div className="bg-brand-800/40 border border-white/5 rounded-xl p-4">
          <p className="text-white/60 text-sm">
            Previous best: <span className="text-white font-semibold">{previousScore}%</span>
            {previousScore >= passingScore ? ' (Passed)' : ' (Below passing)'}
          </p>
        </div>
      )}

      {questions.map((q, qi) => (
        <div key={q.id} className="bg-brand-800/40 border border-white/5 rounded-xl p-6">
          <p className="font-semibold mb-4">
            <span className="text-accent-500">{qi + 1}.</span> {q.text}
          </p>
          <div className="space-y-2">
            {q.options.map((option, oi) => {
              const selected = answers[q.id] === oi;
              const isCorrect = q.correct === oi;
              let optionClass = 'border-white/10 hover:border-white/20';
              if (submitted) {
                if (isCorrect) optionClass = 'border-green-500/50 bg-green-500/10';
                else if (selected && !isCorrect) optionClass = 'border-red-500/50 bg-red-500/10';
              } else if (selected) {
                optionClass = 'border-accent-500/50 bg-accent-500/10';
              }

              return (
                <button
                  key={oi}
                  onClick={() => selectAnswer(q.id, oi)}
                  disabled={submitted}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-colors text-sm ${optionClass} disabled:cursor-default`}
                >
                  <span className="text-white/40 mr-2">{String.fromCharCode(65 + oi)}.</span>
                  {option}
                </button>
              );
            })}
          </div>
          {submitted && (
            <div className={`mt-3 text-sm ${answers[q.id] === q.correct ? 'text-green-400' : 'text-white/50'}`}>
              {q.explanation}
            </div>
          )}
        </div>
      ))}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="w-full bg-accent-500 hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-lg text-lg transition-colors"
        >
          {allAnswered ? 'Submit Quiz' : `Answer all questions (${Object.keys(answers).length}/${questions.length})`}
        </button>
      ) : (
        <div className="bg-brand-800/40 border border-white/5 rounded-xl p-6 text-center">
          <div className={`text-4xl font-bold ${passed ? 'text-green-400' : 'text-red-400'}`}>
            {score}%
          </div>
          <p className="mt-2 text-white/60">
            {passed
              ? 'You passed! This module is now marked as complete.'
              : `You need ${passingScore}% to pass. Review the material and try again.`}
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            {!passed && (
              <button
                onClick={retake}
                className="bg-accent-500 hover:bg-accent-600 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
              >
                Retake Quiz
              </button>
            )}
            <a
              href="/academy/dashboard"
              className="border border-white/20 hover:border-white/40 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              Back to Dashboard
            </a>
          </div>
          {saving && <p className="mt-3 text-white/30 text-sm">Saving progress...</p>}
        </div>
      )}
    </div>
  );
}
