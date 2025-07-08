'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ThemeToggle from '@/components/shared/ModeToggle';
import useGlobalContextProvider from '@/app/_context/ContextApi';

export default function ChallengePlayPage() {
  const { challengeId } = useParams();
  const router = useRouter();
const {username} = useGlobalContextProvider()
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [marked, setMarked] = useState([]);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/challenge/${challengeId}`);
        const data = await res.json();

        if (!data?.challenge?.questions || !Array.isArray(data.challenge.questions)) {
          throw new Error('Invalid challenge format');
        }

        setQuestions(data.challenge.questions);
        console.log(data.challenge.questions);
        
        setAnswers(new Array(data.challenge.questions.length).fill(null));
      } catch (err) {
        toast.error('Failed to load challenge.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [challengeId]);

  const handleAnswer = (choice) => {
    const updated = [...answers];
    updated[current] = {
      selected: choice,
      correct: questions[current].correctAnswer,
    };
    setAnswers(updated);
  };

  const next = () => setCurrent((c) => Math.min(c + 1, questions.length - 1));
  const prev = () => setCurrent((c) => Math.max(c - 1, 0));
  const jumpTo = (i) => setCurrent(i);

  const toggleMark = () => {
    setMarked((prev) =>
      prev.includes(current) ? prev.filter((i) => i !== current) : [...prev, current]
    );
  };

  const submit = async () => {
    let total = 0;
  
    const formattedAnswers = [];
  
    for (let i = 0; i < answers.length; i++) {
      const selected = answers[i]?.selected;
      const correct = answers[i]?.correct;
  
      if (!selected || !correct) continue; // skip if unanswered or malformed
  
      const selectedLabel = selected.charAt(0); // "C" from "C. 40%"
  
      formattedAnswers.push({
        questionId: questions[i].id,
        selectedOption: selectedLabel,
      });
  
      if (selectedLabel === correct) {
        total += 1;
      }
    }
  
    console.log("Final Score:", total);
    console.log("Submitted Answers:", formattedAnswers);
  
    setScore(total);
    toast.success("Challenge submitted!");
  
    try {
      await fetch(`/api/challenge/${challengeId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          answers: formattedAnswers,
          score: total,
          timeTaken: 0,
        }),
      });
    } catch (err) {
      console.error("Submit error:", err);
    }
  };
  

  const restart = () => {
    setAnswers(new Array(questions.length).fill(null));
    setMarked([]);
    setScore(null);
    setCurrent(0);
    router.push('/dashboard');
  };

  if (loading) return <p className="p-10 text-center">Loading challenge...</p>;
  if (!questions.length) return <p className="p-10 text-center">No questions found.</p>;

  const q = questions[current];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 relative">
      <div className="absolute top-2 left-2">
        <ThemeToggle />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/5 space-y-4">
          <h2 className="text-lg font-bold">Questions</h2>
          <div className="grid grid-cols-5 lg:grid-cols-1 gap-2">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => jumpTo(i)}
                className={`rounded-lg p-2 font-semibold border transition-all
                  ${current === i
                    ? 'bg-blue-600 text-white'
                    : marked.includes(i)
                    ? 'bg-yellow-600 text-white'
                    : answers[i]
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
              >
                Q{i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400">🎯 Challenge Quiz</h1>

          {score !== null ? (
            <div className="text-center mt-10 space-y-6">
              <h2 className="text-4xl font-bold text-green-600 dark:text-green-400">Quiz Completed!</h2>
              <p className="text-xl">
                Your Score: <span className="font-bold">{score}</span> / {questions.length}
              </p>
              <button
                onClick={restart}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow transition"
              >
                🔁 Back to Dashboard
              </button>
            </div>
          ) : (
            <>
              {/* Progress */}
              <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-blue-600 rounded-full transition-all"
                  style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Block */}
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-xl">
                <h2 className="text-lg font-semibold mb-4">
                  Q{current + 1}. {q.mainQuestion}
                </h2>
                <div className="grid gap-4">
                  {q.choices && Array.isArray(q.choices) ? (
                    q.choices.map((choice, index) => {
                      const selected = answers[current]?.selected === choice;
                      return (
                        <button
                          key={index}
                          onClick={() => handleAnswer(choice)}
                          className={`w-full text-left px-5 py-3 rounded-lg border font-medium transition-all ${selected
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                          <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span> {choice}
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-red-500 font-semibold">⚠️ No options available.</p>
                  )}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                <button
                  onClick={toggleMark}
                  className={`px-4 py-2 rounded-xl shadow font-medium transition-all ${marked.includes(current)
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                      : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-900 dark:bg-yellow-700 dark:text-white'
                    }`}
                >
                  {marked.includes(current) ? '🚫 Remove Mark' : '✔️ Mark for Review'}
                </button>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={prev}
                    disabled={current === 0}
                    className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-6 py-2 rounded-xl shadow disabled:opacity-50"
                  >
                    ⬅️ Previous
                  </button>

                  {current === questions.length - 1 ? (
                    <button
                      onClick={submit}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow"
                    >
                      ✅ Submit
                    </button>
                  ) : (
                    <button
                      onClick={next}
                      disabled={!answers[current]}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow disabled:opacity-50"
                    >
                      Next ➡️
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
