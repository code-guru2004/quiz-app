'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useGlobalContextProvider from '@/app/_context/ContextApi';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import ThemeToggle from '@/components/shared/ModeToggle';

export default function AIAttendPage() {
    const { aiQuiz, email } = useGlobalContextProvider();
    const router = useRouter();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]); //can you do it [{index:index,answer}]
    const [showScore, setShowScore] = useState(false);
    const [score, setScore] = useState(0);
    const [markForReview, setMarkForReview] = useState([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [showTimeAlert, setShowTimeAlert] = useState(false);

    useEffect(() => {
        if (!aiQuiz) {
            router.replace('/dashboard');
        } else {
            setTimeLeft(aiQuiz.totalTime * 60); // totalTime is in minutes
        }
    }, [aiQuiz, email]);

    useEffect(() => {
        if (showScore || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                const newTime = prev - 1;

                if (newTime === 60) {
                    setShowTimeAlert(true);
                }

                if (newTime <= 0) {
                    clearInterval(timer);
                    calculateScore(); // Auto submit
                }

                return newTime;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, showScore]);

    if (!aiQuiz) return null;

    const questions = aiQuiz.mcq;
    const total = questions.length;
    const currentQ = questions[currentIndex];

    const handleOptionSelect = (selected) => {
        const updated = [...userAnswers];
        updated[currentIndex] = {
            index: currentIndex,
            selected,
            correct: questions[currentIndex].correctAnswer
        };
        setUserAnswers(updated);
    };


    const handleNext = () => {
        if (currentIndex < total - 1) setCurrentIndex(currentIndex + 1);
        else calculateScore();
    };

    const handlePrevious = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    };

    const jumpTo = (index) => setCurrentIndex(index);

    const calculateScore = async () => {
        let correct = 0;
        userAnswers.forEach((ua) => {
            if (ua.selected === ua.correct) correct++;
        });

        setScore(correct);
        setShowScore(true);

        try {
            const resp = await axios.post("/api/submit-ai-quiz", {
                quizId: uuidv4(),
                category: aiQuiz.category,
                level: aiQuiz.level,
                totalQuestions: aiQuiz.totalQuestions,
                totalTime: aiQuiz.totalTime,
                score: correct,
                email
            });
            // const resp = await fetch("/api/submit-ai-quiz", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({
            //         quizId: uuidv4(),
            //         category: aiQuiz.category,
            //         level: aiQuiz.level,
            //         totalQuestions: aiQuiz.totalQuestions,
            //         totalTime: aiQuiz.totalTime,
            //         score: correct,
            //         email
            //     }),
            //   });

            if (resp) {
                toast.success("Quiz Submitted")
            }
        } catch (error) {
            toast.error("Failed to submit quiz")
        }
    };

    const handleRestart = () => {
        setUserAnswers([]);
        setScore(0);
        setShowScore(false);
        setCurrentIndex(0);
        router.push('/dashboard');
    };

    const handleAddMarkForReview = () => {
        if (!markForReview.includes(currentIndex)) {
            setMarkForReview([...markForReview, currentIndex]);
        }
    };

    const handleRemoveMarkForReview = () => {
        setMarkForReview(markForReview.filter((i) => i !== currentIndex));
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 relative">
            <div className='absolute top-2 left-2 lg:left-11 mb-4'>
                <ThemeToggle />
            </div>
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row px-4 py-14 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:w-1/5">
                    {
                        !showScore && (
                            <div className={`${showScore ? 'hidden' : 'block'}`}>
                                <h2 className="text-lg font-bold mb-4">Questions</h2>
                                <div className="grid grid-cols-5 lg:grid-cols-1 gap-2">
                                    {questions.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => jumpTo(idx)}
                                            className={`rounded-lg p-2 font-semibold border transition-all ${currentIndex === idx
                                                ? 'bg-blue-600 text-white'
                                                : markForReview.includes(idx)
                                                    ? 'bg-yellow-600 text-white'
                                                    : userAnswers[idx]
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
                                                }`}
                                        >
                                            Q{idx + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        )
                    }
                </div>

                {/* Quiz Content */}
                <div className="flex-1 space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-400">{aiQuiz.category} Quiz</h1>
                        {
                            !showScore &&
                            (
                                <div className="text-sm text-red-600 dark:text-red-400 font-semibold">
                                    Time Left: {formatTime(timeLeft)}
                                </div>
                            )
                        }

                    </div>

                    {showTimeAlert && (
                        <div className="p-4 rounded-xl bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 font-semibold shadow">
                            ⏰ Only 1 minute left. Finish up!
                        </div>
                    )}

                    {showScore ? (
                        <div className="text-center mt-20 space-y-6">
                            <h2 className="text-4xl font-extrabold text-green-600 dark:text-green-400">🎉 Quiz Completed!</h2>
                            <p className="text-xl">
                                You scored <span className="font-bold">{score}</span> out of <span className="font-bold">{total}</span>
                            </p>
                            <button
                                onClick={handleRestart}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-md transition"
                            >
                                🔁 Back to Dashboard
                            </button>
                            <div className="mt-10 space-y-8">
  {questions.map((q, idx) => {
    const userAnswer = userAnswers[idx];
    const isCorrect = userAnswer?.selected === userAnswer?.correct;

    return (
      <div
        key={idx}
        className={`relative p-6 rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-md ${
          isCorrect
            ? 'border-emerald-200/80 bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-900/10 dark:to-gray-900 dark:border-emerald-800/50'
            : 'border-rose-200/80 bg-gradient-to-br from-rose-50/50 to-white dark:from-rose-900/10 dark:to-gray-900 dark:border-rose-800/50'
        }`}
      >
        {/* Question header with number */}
        <div className="flex items-start mb-5">
          <div className={`flex-shrink-0 mr-4 flex items-center justify-center w-10 h-10 rounded-lg ${
            isCorrect
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-100'
              : 'bg-rose-100 text-rose-800 dark:bg-rose-900/80 dark:text-rose-100'
          }`}>
            <span className="font-bold text-lg">{idx + 1}</span>
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100 pt-1">
            {q.mainQuestion}
          </h3>
        </div>

        {/* Choices grid - now single column to handle long text better */}
        <div className="space-y-3 ml-14">
          {q.choices.map((choice, i) => {
            const letter = choice[0];
            const optionText = choice.substring(2);
            const isUserSelected = userAnswer?.selected === letter;
            const isCorrectAnswer = userAnswer?.correct === letter;
            const isIncorrectSelection = isUserSelected && !isCorrectAnswer;

            return (
              <div
                key={i}
                className={`w-full text-left p-3 rounded-xl border-2 font-medium transition-all duration-200 ${
                  isCorrectAnswer
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900 dark:bg-emerald-900/40 dark:border-emerald-600 dark:text-emerald-100 shadow-emerald-100 dark:shadow-emerald-900/20 shadow-sm'
                    : isIncorrectSelection
                      ? 'bg-rose-50 border-rose-400 text-rose-900 dark:bg-rose-900/40 dark:border-rose-600 dark:text-rose-100 shadow-rose-100 dark:shadow-rose-900/20 shadow-sm'
                      : 'bg-white dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                }`}
              >
                <div className="flex">
                  <span className={`flex-shrink-0 inline-flex items-center justify-center w-6 h-6 mr-3 mt-0.5 rounded ${
                    isCorrectAnswer
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100'
                      : isIncorrectSelection
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-800 dark:text-rose-100'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {letter}
                  </span>
                  <span className="break-words">{optionText}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feedback section */}
        <div className="mt-6 ml-14 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className={`flex items-center p-3 rounded-lg border ${
              isCorrect
                ? 'border-emerald-200 bg-emerald-50/50 text-emerald-800 dark:border-emerald-800/50 dark:bg-emerald-900/20 dark:text-emerald-100'
                : 'border-rose-200 bg-rose-50/50 text-rose-800 dark:border-rose-800/50 dark:bg-rose-900/20 dark:text-rose-100'
            }`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                isCorrect ? 'bg-emerald-100 dark:bg-emerald-800' : 'bg-rose-100 dark:bg-rose-800'
              }`}>
                ✅
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Correct answer</p>
                <p className="font-semibold">{userAnswer?.correct}</p>
              </div>
            </div>

            <div className={`flex items-center p-3 rounded-lg border ${
              isCorrect
                ? 'border-emerald-200 bg-emerald-50/50 text-emerald-800 dark:border-emerald-800/50 dark:bg-emerald-900/20 dark:text-emerald-100'
                : 'border-rose-200 bg-rose-50/50 text-rose-800 dark:border-rose-800/50 dark:bg-rose-900/20 dark:text-rose-100'
            }`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                isCorrect ? 'bg-emerald-100 dark:bg-emerald-800' : 'bg-rose-100 dark:bg-rose-800'
              }`}>
                🧑
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Your answer</p>
                <p className={`font-semibold ${isCorrect ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'}`}>
                  {userAnswer?.selected || 'Not answered'}
                </p>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Explanation</h4>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{q.explanation}</p>
          </div>
        </div>

        {/* Corner decoration */}
        <div className={`absolute top-0 right-0 w-16 h-16 overflow-hidden`}>
          <div className={`absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 rounded-full ${
            isCorrect ? 'bg-emerald-100/50 dark:bg-emerald-900/30' : 'bg-rose-100/50 dark:bg-rose-900/30'
          }`}></div>
        </div>
      </div>
    );
  })}
</div>

                        </div>
                    ) : (
                        <>
                            {/* Progress */}
                            <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-2 bg-blue-600 rounded-full transition-all"
                                    style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
                                />
                            </div>

                            {/* Question Box */}
                            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow">
                                <h2 className="text-lg font-semibold mb-4">
                                    Q{currentIndex + 1}. {currentQ.mainQuestion}
                                </h2>
                                <div className="grid gap-4">
                                    {currentQ.choices.map((choice, idx) => {
                                        const letter = choice[0];
                                        const isSelected = userAnswers[currentIndex]?.selected === letter;

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => handleOptionSelect(letter)}
                                                className={`w-full text-left px-5 py-3 rounded-lg border font-medium transition-all ${isSelected
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                    }`}
                                            >
                                                {choice}
                                            </button>
                                        );
                                    })}
                                </div>

                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between items-center flex-col lg:flex-row flex-wrap gap-2">
                                <button
                                    onClick={() =>
                                        markForReview.includes(currentIndex)
                                            ? handleRemoveMarkForReview()
                                            : handleAddMarkForReview()
                                    }
                                    className={`px-4 py-2 rounded-xl shadow font-medium ${markForReview.includes(currentIndex)
                                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                        : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-900 dark:bg-yellow-700 dark:text-white'
                                        } transition-all`}
                                >
                                    {markForReview.includes(currentIndex) ? '🚫Remove Mark' : '✔️Mark for Review'}
                                </button>
                                <div className="flex gap-3 flex-col lg:flex-row">
                                    <button
                                        onClick={handlePrevious}
                                        disabled={currentIndex === 0}
                                        className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-6 py-2 rounded-xl shadow disabled:opacity-50 transition-all"
                                    >
                                        ⬅️ Previous
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        disabled={userAnswers[currentIndex] === undefined}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow disabled:opacity-50 transition-all  text-center"
                                    >
                                        {currentIndex === total - 1 ? '✅ Submit Quiz' : 'Next ➡️'}
                                    </button>
                                </div>



                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
