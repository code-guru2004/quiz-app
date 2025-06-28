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
import { TbArrowLeftFromArc } from 'react-icons/tb';
import { CircleArrowLeft, CircleChevronLeft, MoveLeft } from 'lucide-react';

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
                    setIsSubmitted(false); // user didn't submit
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
            <div className="w-full h-screen flex items-center justify-center">
                <div className="text-xl font-semibold animate-pulse text-blue-600 dark:text-blue-400">
                    Loading Quiz...
                </div>
            </div>
        );
    }

    if (!isSubmitted) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
                <div className="text-red-600 dark:text-red-400 text-lg font-semibold">
                    You haven’t submitted this quiz yet, so answers are not available.
                </div>
                <div className='flex justify-center items-center gap-3'>
                    <Link href={'/dashboard/live-quizzes'} className='bg-pink-700 p-3 text-white rounded-md'>Live Quizzes</Link>
                    <Link href={'/dashboard/practice-quizzes'} className='bg-orange-600 p-3 text-white rounded-md'>Practice Quizzes</Link>

                </div>
            </div>
        );
    }




    return (

        <div className="max-w-2xl mx-auto px-3 py-20 lg:py-24 relative overflow-hidden z-10">
            <div className='absolute top-4 left-2 lg:left-0 z-20'>
                <Link href={'/dashboard'}>
                    <CircleChevronLeft className='size-9 rounded-full  bg-blue-400 text-white dark:text-black dark:bg-white'/>
                </Link>
            </div>
            <div className='absolute top-4 right-2 lg:right-0 z-20'>
                <ThemeToggle />
            </div>

            <AnimatePresence>
                {showPlusOne && (
                    <motion.div
                        key="plus-one"
                        initial={{ opacity: 0, y: 600, scale: 0.5 }}
                        animate={{ opacity: 2, y: -50, scale: 1.2 }}
                        exit={{ opacity: 0, y: -80, scale: 1 }}
                        transition={{ duration: 2, ease: 'easeOut' }}
                        className="absolute top-10 left-1/2 transform -translate-x-1/2 text-yellow-600 text-5xl font-bold z-50 pointer-events-none"
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
                        className="absolute top-10 left-1/2 transform -translate-x-1/2 text-rose-500 text-5xl font-bold z-50 pointer-events-none"
                    >
                        😕
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mb-8 text-center text-sm flex justify-between items-center text-gray-700 dark:text-gray-300">
                <p>Total Score: <span className="font-semibold text-green-700 dark:text-green-400">{totalScore}</span></p>
                <p>Submitted At: <span className="font-semibold text-blue-700 dark:text-blue-400">{timeOfSubmission}</span></p>
            </div>

            <div className="mb-6 text-center flex justify-between items-center">
                <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300 flex items-center gap-3">
                    <span className='bg-gray-300 dark:bg-gray-200 p-2 rounded-md'>{ICONS[icon]?.icon}</span>
                    {quizTitle.toUpperCase()}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Question {currQuizIndex + 1} of {totalQuestions}
                </p>
            </div>

            <div className="mb-6 text-sm md:text-lg font-semibold text-green-900 dark:text-green-500 whitespace-pre-line break-words w-full">
                {currQuizIndex + 1}. {quizQuiestions[currQuizIndex]?.mainQuestion}
            </div>

            <div className="space-y-3 flex flex-col items-center justify-center">
                {quizQuiestions[currQuizIndex]?.choices.map((choice, idx) => {
                    const questionId = quizQuiestions[currQuizIndex]._id;
                    const correctAnswer = quizQuiestions[currQuizIndex].correctAnswer;
                    const userAnswer = allUserAnswers.find(ans => ans.questionId === questionId)?.selectedOption;

                    const isCorrect = correctAnswer === prefixes[idx];
                    const isSelected = userAnswer === prefixes[idx];

                    const highlightClass = isCorrect
                        ? "bg-green-600 dark:bg-green-600 text-white border-green-700"
                        : isSelected
                            ? "bg-red-600 dark:bg-red-600 text-white border-red-700"
                            : "bg-slate-200 dark:bg-slate-600 border-green-300 hover:bg-green-200 dark:hover:bg-slate-500";

                    return (
                        <div
                            key={idx}
                            className={`py-4 px-4 w-screen lg:w-full border rounded-lg cursor-pointer transition-all flex ${highlightClass}`}
                        >
                            <span className="font-bold mr-2">{prefixes[idx]}.</span>
                            <span className="whitespace-pre-line break-words w-full block">
                                {choice.slice(3)}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 flex justify-between px-3 lg:px-4">
                <button
                    onClick={handlePrevious}
                    disabled={currQuizIndex === 0}
                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all disabled:opacity-50"
                >
                    Previous
                </button>

                <button
                    onClick={handleNext}
                    disabled={currQuizIndex === quizQuiestions.length - 1}
                    className="px-6 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-all disabled:opacity-50"
                >
                    {currQuizIndex === quizQuiestions.length - 1 ? "End" : "Next"}
                </button>
            </div>
        </div>

    );
}

export default QuizAnswer;
