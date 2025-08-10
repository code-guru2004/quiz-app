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
    const [userAnswers, setUserAnswers] = useState([]);
    const [showScore, setShowScore] = useState(false);
    const [score, setScore] = useState(0);
    const [markForReview, setMarkForReview] = useState([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [showTimeAlert, setShowTimeAlert] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (!aiQuiz) {
            router.replace('/dashboard');
        } else {
            setTimeLeft(aiQuiz.totalTime * 60);
        }
    }, [aiQuiz, email]);

    useEffect(() => {
        if (showScore || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                const newTime = prev - 1;

                if (newTime === 60) {
                    setShowTimeAlert(true);
                    setTimeout(() => setShowTimeAlert(false), 5000);
                }

                if (newTime <= 0) {
                    clearInterval(timer);
                    calculateScore();
                }

                return newTime;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, showScore]);

    if (!aiQuiz) return null;

    const questions = aiQuiz.quizQuestions;
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
        setIsAnimating(true);
        setTimeout(() => {
            if (currentIndex < total - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                calculateScore();
            }
            setIsAnimating(false);
        }, 300);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePrevious = () => {
        setIsAnimating(true);
        setTimeout(() => {
            if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
            }
            setIsAnimating(false);
        }, 300);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const jumpTo = (index) => {
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentIndex(index);
            setIsAnimating(false);
        }, 300);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const calculateScore = async () => {
        setIsSubmitting(true);
        let correct = 0;
        userAnswers.forEach((ua) => {
            if (ua?.selected === ua?.correct) correct++;
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

            if (resp) {
                toast.success("Quiz Submitted Successfully!", {
                    position: 'top-center',
                    style: {
                        background: '#10b981',
                        color: '#fff',
                        padding: '16px',
                        borderRadius: '12px'
                    }
                });
            }
        } catch (error) {
            toast.error("Failed to submit quiz", {
                position: 'top-center',
                style: {
                    background: '#ef4444',
                    color: '#fff',
                    padding: '16px',
                    borderRadius: '12px'
                }
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRestart = () => {
        router.push('/dashboard');
    };

    const handleAddMarkForReview = () => {
        if (!markForReview.includes(currentIndex)) {
            setMarkForReview([...markForReview, currentIndex]);
            toast.success('Question marked for review', {
                position: 'top-right',
                duration: 1500
            });
        }
    };

    const handleRemoveMarkForReview = () => {
        setMarkForReview(markForReview.filter((i) => i !== currentIndex));
        toast.success('Review mark removed', {
            position: 'top-right',
            duration: 1500
        });
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 relative overflow-x-hidden">
            {/* Floating Theme Toggle */}
            <div className='fixed top-6 right-6 z-50'>
                <ThemeToggle />
            </div>
            
            {/* Floating Time Display */}
            {!showScore && (
                <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 shadow-lg rounded-full px-6 py-2 z-50 flex items-center border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2 animate-pulse"></div>
                    <span className="font-bold text-gray-700 dark:text-gray-200">
                        {formatTime(timeLeft)}
                    </span>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 py-20 gap-8">
                {/* Quiz Container */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/10"></div>
                        <div className="absolute -right-20 -bottom-20 w-40 h-40 rounded-full bg-white/5"></div>
                        <div className="relative z-10">
                            <h1 className="text-2xl md:text-3xl font-bold">{aiQuiz.category} Quiz</h1>
                            <div className="flex items-center mt-2 space-x-4">
                                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                                    Level: {aiQuiz.level}
                                </span>
                                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                                    {total} Questions
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row">
                        {/* Sidebar Navigation */}
                        {!showScore && (
                            <div className="lg:w-1/4 p-6 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                                <h2 className="text-lg font-bold mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Question Navigator
                                </h2>
                                <div className="grid grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                                    {questions.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => jumpTo(idx)}
                                            className={`relative rounded-lg p-2 font-medium transition-all transform hover:scale-105 ${
                                                currentIndex === idx
                                                    ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg'
                                                    : markForReview.includes(idx)
                                                        ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-md'
                                                        : userAnswers[idx]
                                                            ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow'
                                                            : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-500'
                                            }`}
                                        >
                                            Q{idx + 1}
                                            {markForReview.includes(idx) && (
                                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-200 rounded-full border border-amber-600"></span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Main Content */}
                        <div className={`flex-1 p-6 transition-opacity duration-300 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
                            {showTimeAlert && (
                                <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-white font-bold shadow-lg animate-pulse">
                                    <div className="flex items-center justify-center">
                                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Only 1 minute left! Finish up quickly!
                                    </div>
                                </div>
                            )}

                            {showScore ? (
                                <div className="text-center py-10">
                                    <div className="max-w-2xl mx-auto">
                                        <div className="relative mb-10">
                                            <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full opacity-30 animate-pulse"></div>
                                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-indigo-100 dark:bg-indigo-900 rounded-full opacity-30 animate-pulse"></div>
                                            <div className="relative bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600">
                                                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
                                                    <span className="text-3xl font-bold text-white">{score}</span>
                                                </div>
                                                <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-2">
                                                    Quiz Completed!
                                                </h2>
                                                <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                                                    You scored <span className="font-bold text-blue-600 dark:text-blue-400">{score}</span> out of <span className="font-bold">{total}</span>
                                                </p>
                                                <div className="flex justify-center gap-4">
                                                    <button
                                                        onClick={handleRestart}
                                                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center"
                                                    >
                                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                                        </svg>
                                                        Back to Dashboard
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center justify-center">
                                                <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Detailed Review
                                            </h3>

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
                                                        {/* Question content */}
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

                                                        {/* Choices */}
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

                                                        {/* Feedback */}
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
                                                            {q.explanation && (
                                                                <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50">
                                                                    <div className="flex items-center mb-2">
                                                                        <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                        </svg>
                                                                        <h4 className="font-medium text-blue-800 dark:text-blue-200">Explanation</h4>
                                                                    </div>
                                                                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{q.explanation}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Progress Bar */}
                                    <div className="mb-8">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                Question {currentIndex + 1} of {total}
                                            </span>
                                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                                {Math.round(((currentIndex + 1) / total) * 100)}% Complete
                                            </span>
                                        </div>
                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                                                style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Question Card */}
                                    <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-8 rounded-2xl shadow-lg mb-8 transition-all duration-300 hover:shadow-xl">
                                        <div className="flex items-start mb-6">
                                            <div className="flex-shrink-0 mr-4 flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900/80 dark:text-blue-100">
                                                <span className="font-bold text-lg">{currentIndex + 1}</span>
                                            </div>
                                            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white pt-1">
                                                {currentQ.mainQuestion}
                                            </h2>
                                        </div>
                                        <div className="grid gap-3 ml-14">
                                            {currentQ.choices.map((choice, idx) => {
                                                const letter = choice[0];
                                                const optionText = choice.substring(2);
                                                const isSelected = userAnswers[currentIndex]?.selected === letter;

                                                return (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleOptionSelect(letter)}
                                                        className={`w-full text-left px-5 py-4 rounded-xl border-2 font-medium transition-all duration-200 ${
                                                            isSelected
                                                                ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-400 text-blue-800 dark:text-blue-100 shadow-sm'
                                                                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-gray-700'
                                                        }`}
                                                    >
                                                        <div className="flex items-center">
                                                            <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 transition-all ${
                                                                isSelected
                                                                    ? 'bg-blue-500 text-white scale-110'
                                                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                                                            }`}>
                                                                {letter}
                                                            </span>
                                                            <span>{optionText}</span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Navigation Buttons */}
                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                        <button
                                            onClick={() =>
                                                markForReview.includes(currentIndex)
                                                    ? handleRemoveMarkForReview()
                                                    : handleAddMarkForReview()
                                            }
                                            className={`px-6 py-3 rounded-xl shadow font-medium transition-all transform hover:scale-105 ${
                                                markForReview.includes(currentIndex)
                                                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white'
                                                    : 'bg-amber-100 hover:bg-amber-200 text-amber-900 dark:bg-amber-700 dark:text-white'
                                            }`}
                                        >
                                            {markForReview.includes(currentIndex) ? (
                                                <span className="flex items-center">
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    Remove Mark
                                                </span>
                                            ) : (
                                                <span className="flex items-center">
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Mark for Review
                                                </span>
                                            )}
                                        </button>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={handlePrevious}
                                                disabled={currentIndex === 0}
                                                className="flex items-center px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-xl shadow transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                                            >
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                                Previous
                                            </button>
                                            <button
                                                onClick={handleNext}
                                                disabled={userAnswers[currentIndex] === undefined}
                                                className={`flex items-center px-6 py-3 rounded-xl shadow transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 ${
                                                    currentIndex === total - 1
                                                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white'
                                                        : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white'
                                                }`}
                                            >
                                                {currentIndex === total - 1 ? (
                                                    <>
                                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Submit Quiz
                                                    </>
                                                ) : (
                                                    <>
                                                        Next
                                                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}