'use client';

import useGlobalContextProvider from '@/app/_context/ContextApi';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ICONS } from '@/app/Icon';
import ThemeToggle from '@/components/shared/ModeToggle';
import Link from 'next/link';
import { CircleChevronLeft } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

function QuizAnswer() {
    const params = useParams();
    const quizId = params.id;
    const prefixes = ["A", "B", "C", "D", "E"];
    const { email } = useGlobalContextProvider();

    const [allUserAnswers, setAllUserAnswers] = useState([]);
    const [quizQuiestions, setQuizQuiestions] = useState([]);
    const [currQuizIndex, setCurrQuizIndex] = useState(0);
    const [quizTitle, setQuizTitle] = useState('');
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [showPlusOne, setShowPlusOne] = useState(false);
    const [isWrong, setIsWrong] = useState(false);
    const [totalScore, setTotalScore] = useState(0);
    const [timeOfSubmission, setTimeOfSubmission] = useState('');
    const [icon, setIcon] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);

    async function fetchQuiz() {
        setIsLoading(true);
        setHasFetched(true);

        try {
            const resp = await axios.get(`/api/get-quiz-id/${quizId}`);
            const quizData = resp?.data?.quizData;

            if (quizData) {
                const matchedSubmission = quizData.userSubmissions?.find(
                    (submission) => submission.email === email
                );

                if (matchedSubmission) {
                    setIsSubmitted(true);
                    setQuizTitle(quizData.quizTitle);
                    setAllUserAnswers(matchedSubmission.selectedAnswers || []);
                    setQuizQuiestions(quizData.quizQuestions || []);
                    setTotalQuestions(quizData.quizQuestions?.length || 0);
                    setTotalScore(matchedSubmission.score || 0);
                    setTimeOfSubmission(
                        new Date(matchedSubmission.submittedAt).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                        })
                    );
                    setIcon(quizData?.quizIcon);
                } else {
                    setIsSubmitted(false);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch quiz data");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (!quizId || !email) return;
        fetchQuiz();
    }, [quizId, email]);

    useEffect(() => {
        const question = quizQuiestions[currQuizIndex];
        const userAnswer = allUserAnswers.find(ans => ans.questionId === question?._id);

        if (!question || !userAnswer) return;

        const isCorrect = userAnswer?.selectedOption === question?.correctAnswer;

        if (isCorrect) {
            setShowPlusOne(true);
            const timer = setTimeout(() => setShowPlusOne(false), 1000);
            return () => clearTimeout(timer);
        } else {
            setIsWrong(true);
            const timer = setTimeout(() => setIsWrong(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [currQuizIndex, quizQuiestions, allUserAnswers]);

    const handleNext = () => {
        if (currQuizIndex < quizQuiestions.length - 1) {
            setCurrQuizIndex((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currQuizIndex > 0) {
            setCurrQuizIndex((prev) => prev - 1);
        }
    };

    // Loading UI
    if (isLoading || !hasFetched) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-xl font-semibold text-primary">
                        Loading Quiz Results...
                    </div>
                </div>
            </div>
        );
    }

    if (!isSubmitted) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center gap-6 text-center px-4 bg-background">
                <div className="max-w-md mx-auto">
                    <div className="text-2xl font-bold text-destructive mb-2">
                        Quiz Not Submitted
                    </div>
                    <p className="text-muted-foreground mb-6">
                        You haven't submitted this quiz yet, so answers are not available.
                    </p>
                    <div className='flex justify-center items-center gap-4'>
                        <Link 
                            href={'/dashboard/live-quizzes'} 
                            className='bg-primary px-6 py-3 text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium'
                        >
                            Live Quizzes
                        </Link>
                        <Link 
                            href={'/dashboard/practice-quizzes'} 
                            className='bg-secondary px-6 py-3 text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium'
                        >
                            Practice Quizzes
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = quizQuiestions[currQuizIndex];
    const progressValue = ((currQuizIndex + 1) / totalQuestions) * 100;

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 relative bg-background min-h-screen">
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
                <Link 
                    href={'/dashboard'} 
                    className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                    <CircleChevronLeft className="size-6" />
                    <span className="font-medium">Back to Dashboard</span>
                </Link>
                <ThemeToggle />
            </header>

            {/* Progress indicator */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                        Question {currQuizIndex + 1} of {totalQuestions}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                        {Math.round(progressValue)}% complete
                    </span>
                </div>
                <Progress value={progressValue} className="h-2" />
            </div>

            {/* Score and submission info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 p-4 bg-card rounded-lg border">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {ICONS[icon]?.icon}
                    </div>
                    <h1 className="text-xl font-bold text-foreground">
                        {quizTitle}
                    </h1>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Score:</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                            {totalScore}/{totalQuestions}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Submitted:</span>
                        <span className="font-medium text-foreground">
                            {timeOfSubmission}
                        </span>
                    </div>
                </div>
            </div>

            {/* Animation effects */}
            <AnimatePresence>
                {showPlusOne && (
                    <motion.div
                        key="plus-one"
                        initial={{ opacity: 0, y: 600, scale: 0.5 }}
                        animate={{ opacity: 2, y: -50, scale: 1.2 }}
                        exit={{ opacity: 0, y: -80, scale: 1 }}
                        transition={{ duration: 2, ease: 'easeOut' }}
                        className="absolute top-32 left-1/2 transform -translate-x-1/2 text-yellow-600 text-5xl font-bold z-50 pointer-events-none"
                    >
                        +1
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isWrong && (
                    <motion.div
                        key="wrong"
                        initial={{ opacity: 0, y: 600, scale: 0.5 }}
                        animate={{ opacity: 1, y: -50, scale: 1.2 }}
                        exit={{ opacity: 0, y: -80, scale: 1 }}
                        transition={{ duration: 2, ease: 'easeOut' }}
                        className="absolute top-32 left-1/2 transform -translate-x-1/2 text-rose-500 text-5xl font-bold z-50 pointer-events-none"
                    >
                        😕
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Question card */}
            <motion.div 
                key={currQuizIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8 p-6 bg-card rounded-xl border shadow-sm"
            >
                <h2 className="text-lg font-semibold text-foreground mb-6 whitespace-pre-line">
                    {currQuizIndex + 1}. {currentQuestion?.mainQuestion}
                </h2>

                <div className="space-y-3">
                    {currentQuestion?.choices.map((choice, idx) => {
                        const questionId = currentQuestion._id;
                        const correctAnswer = currentQuestion.correctAnswer;
                        const userAnswer = allUserAnswers.find(ans => ans.questionId === questionId)?.selectedOption;

                        const isCorrect = correctAnswer === prefixes[idx];
                        const isSelected = userAnswer === prefixes[idx];

                        let optionClasses = "p-4 rounded-lg border transition-all flex items-start cursor-default ";
                        
                        if (isCorrect) {
                            optionClasses += "bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-800";
                        } else if (isSelected) {
                            optionClasses += "bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-800";
                        } else {
                            optionClasses += "bg-muted/50 hover:bg-muted border-border";
                        }

                        return (
                            <div
                                key={idx}
                                className={optionClasses}
                            >
                                <span className={`font-bold mr-3 min-w-[20px] ${
                                    isCorrect ? "text-green-600 dark:text-green-400" : 
                                    isSelected ? "text-red-600 dark:text-red-400" : 
                                    "text-muted-foreground"
                                }`}>
                                    {prefixes[idx]}.
                                </span>
                                <span className="whitespace-pre-line break-words">
                                    {choice.slice(3)}
                                </span>
                                {isCorrect && (
                                    <span className="ml-auto text-green-600 dark:text-green-400">
                                        ✓ Correct
                                    </span>
                                )}
                                {isSelected && !isCorrect && (
                                    <span className="ml-auto text-red-600 dark:text-red-400">
                                        ✗ Your choice
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
                <button
                    onClick={handlePrevious}
                    disabled={currQuizIndex === 0}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        currQuizIndex === 0 
                            ? "bg-muted text-muted-foreground cursor-not-allowed" 
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                >
                    Previous
                </button>

                <button
                    onClick={handleNext}
                    disabled={currQuizIndex === quizQuiestions.length - 1}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        currQuizIndex === quizQuiestions.length - 1 
                            ? "bg-muted text-muted-foreground cursor-not-allowed" 
                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                >
                    {currQuizIndex === quizQuiestions.length - 1 ? "Review Complete" : "Next"}
                </button>
            </div>
        </div>
    );
}

export default QuizAnswer;