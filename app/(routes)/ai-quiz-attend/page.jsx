'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useGlobalContextProvider from '@/app/_context/ContextApi';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

export default function AIAttendPage() {
    const { aiQuiz,email } = useGlobalContextProvider();
    const router = useRouter();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
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
    }, [aiQuiz,email]);

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
        updated[currentIndex] = selected;
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

    const calculateScore = async() => {
        let correct = 0;
        questions.forEach((q, idx) => {
            if (userAnswers[idx] === q.correctAnswer) correct++;
        });
        setScore(correct);
        setShowScore(true);
        
        try {
            const resp = await axios.post("/api/submit-ai-quiz",{
                quizId:uuidv4(),
                category:aiQuiz.category,
                level:aiQuiz.level,
                totalQuestions:aiQuiz.totalQuestions,
                totalTime:aiQuiz.totalTime,
                score:correct,
                email
            });
            if(resp){
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
        <div className="min-h-screen bg-white dark:bg-[#0f172a] text-gray-900 dark:text-gray-100">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row px-4 py-10 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:w-1/5">
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

                {/* Quiz Content */}
                <div className="flex-1 space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-400">{aiQuiz.category} Quiz</h1>
                        <div className="text-sm text-red-600 dark:text-red-400 font-semibold">
                            Time Left: {formatTime(timeLeft)}
                        </div>
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
                                        const isSelected = userAnswers[currentIndex] === letter;
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
                            <div className="flex justify-between items-center flex-wrap gap-2">
                                <div className="flex gap-3">
                                    <button
                                        onClick={handlePrevious}
                                        disabled={currentIndex === 0}
                                        className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-6 py-2 rounded-xl shadow disabled:opacity-50 transition-all"
                                    >
                                        ⬅️ Previous
                                    </button>
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
                                </div>

                                <button
                                    onClick={handleNext}
                                    disabled={userAnswers[currentIndex] === undefined}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow disabled:opacity-50 transition-all w-full text-center"
                                >
                                    {currentIndex === total - 1 ? '✅ Submit Quiz' : 'Next ➡️'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
