"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaPlay, FaHistory, FaCalendarDay, FaCalendarWeek, FaCalendarAlt } from "react-icons/fa";
import useGlobalContextProvider from "@/app/_context/ContextApi";
import axios from "axios";
import { BsFillPatchQuestionFill } from "react-icons/bs";
import { PiSealQuestionBold } from "react-icons/pi";
import { IoIosTimer } from "react-icons/io";
import { motion } from "framer-motion";
import { FaRankingStar } from "react-icons/fa6";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import DownloadQuizPDF from "@/components/shared/DownloadQuizPDF";

const typeStyles = {
    daily: {
        gradient: "bg-gradient-to-br from-amber-400 to-orange-500",
        darkGradient: "bg-gradient-to-br from-amber-500 to-orange-600",
        text: "text-amber-600 dark:text-amber-400",
        accent: "bg-amber-100 dark:bg-amber-900/30",
        icon: <FaCalendarDay className="text-amber-500" />,
        circle: "bg-orange-500"
    },
    weekly: {
        gradient: "bg-gradient-to-br from-teal-400 to-emerald-500",
        darkGradient: "bg-gradient-to-br from-teal-500 to-emerald-600",
        text: "text-teal-600 dark:text-teal-400",
        accent: "bg-teal-100 dark:bg-teal-900/30",
        icon: <FaCalendarWeek className="text-teal-500" />,
        circle: "bg-teal-600"
    },
    monthly: {
        gradient: "bg-gradient-to-br from-indigo-400 to-violet-500",
        darkGradient: "bg-gradient-to-br from-indigo-500 to-violet-600",
        text: "text-indigo-600 dark:text-indigo-400",
        accent: "bg-indigo-100 dark:bg-indigo-900/30",
        icon: <FaCalendarAlt className="text-indigo-500" />,
        circle: "bg-indigo-600"
    },
};

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function ContestTypePage() {
    const { type } = useParams();
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [pastQuizzes, setPastQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { quizToStartObject, email } = useGlobalContextProvider();
    const { setSelectQuizToStart } = quizToStartObject;
    const [isAttendActiveQuiz, setIsAttendActiveQuiz] = useState(false)

    const styles = typeStyles[type] || typeStyles.daily;

    useEffect(() => {
        async function fetchQuizzes() {
            try {
                setLoading(true);

                // Fetch in parallel
                const [resp1, resp2] = await Promise.all([
                    fetch(`/api/quiz/scheduled-quizzes?type=${type}`),
                    axios.get(`/api/quiz/previous-quiz?type=${type}`)
                ]);

                if (!resp1.ok) throw new Error("Failed to fetch scheduled quizzes");
                if (resp2.status !== 200) throw new Error("Failed to fetch previous quizzes");

                const data1 = await resp1.json();
                setActiveQuiz(data1.quizzes[0] || null);
                setPastQuizzes(resp2.data.quizzes || []);

            } catch (err) {
                console.error("Error fetching quizzes:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchQuizzes();
    }, [type]);

    useEffect(() => {
        if (!activeQuiz) return;

        const hasSubmitted = activeQuiz.userSubmissions.some((submission) => submission.email === email);
        setIsAttendActiveQuiz(hasSubmitted)
    }, [activeQuiz, email])
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <div className="flex flex-col items-center">
                    <svg
                        className="animate-spin h-10 w-10 text-blue-500 dark:text-blue-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                            className="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.29A7.96 7.96 0 014 12H0c0 
              3.04 1.13 5.82 3 7.94l3-2.65z"
                        />
                    </svg>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading contests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <div className="flex items-center space-x-4 mb-4">
                        <div className={`p-3 rounded-lg ${styles.accent}`}>
                            {styles.icon}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight capitalize">
                            {type} <span className={styles.text}>Contests</span>
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
                        {type === "daily" && "Daily challenges to sharpen your skills and climb the leaderboard."}
                        {type === "weekly" && "Weekly tournaments to test your knowledge against the community."}
                        {type === "monthly" && "Monthly grand challenges with premium rewards for top performers."}
                    </p>
                </motion.div>

                {/* Active Quiz */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-16"
                >
                    <h2 className="text-xl font-semibold mb-6 text-gray-700 dark:text-gray-300 flex items-center">
                        <span className={`w-3 h-3 rounded-full mr-2 ${styles.circle}`}></span>
                        Current Contest
                    </h2>

                    {activeQuiz ? (
                        <div
                            className={`relative overflow-hidden rounded-2xl shadow-xl ${styles.gradient} dark:${styles.darkGradient}`}
                            onClick={() => setSelectQuizToStart(activeQuiz)}
                        >
                            <div className="absolute top-1 lg:top-4 right-4 flex items-center gap-2">
                                {/* PDF Download Icon */}
                                <div className="lg:block hidden">
                                    <DownloadQuizPDF quiz={activeQuiz} isAttendActiveQuiz={isAttendActiveQuiz}/>
                                </div>
                                
                                

                                {/* Live Now Badge */}
                                <div className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    Live Now
                                </div>
                            </div>

                            <div className="p-8 md:p-10 text-white">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                    <div className="space-y-4 max-w-2xl">
                                        <div className="flex items-center justify-between ">
                                            <h3 className="text-2xl md:text-3xl font-bold">{activeQuiz.quizTitle} - {pastQuizzes.length + 1}</h3>
                                            <div className="block lg:hidden">
                                                <DownloadQuizPDF quiz={activeQuiz} isAttendActiveQuiz={isAttendActiveQuiz} />
                                            </div>
                                        </div>
                                        <p className="text-white/90">{activeQuiz.quizDescription}</p>
                                        <div className="flex flex-wrap gap-4 text-sm">
                                            <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-full">
                                                <PiSealQuestionBold className="text-white/80 size-5" />
                                                <span>{activeQuiz.quizQuestions.length} Questions</span>
                                            </div>
                                            <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-full">
                                                <IoIosTimer className="text-white/80 size-5" />
                                                <span>{activeQuiz.quizTime} Minutes</span>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        isAttendActiveQuiz ? (
                                            <div className="flex flex-col lg:flex-row gap-2 items-center justify-center">
                                                <Link
                                                    href={`/quiz-start/${activeQuiz._id}/leaderboard`}
                                                    className="flex items-center space-x-2 px-6 py-3 bg-white font-bold rounded-lg shadow-md hover:bg-gray-100 text-gray-900 transition-all hover:scale-102"
                                                >
                                                    <FaRankingStar className="text-current" />
                                                    <span>Leaderboard</span>
                                                </Link>
                                                <Link
                                                    href={`/quiz-start/${activeQuiz._id}/result`}
                                                    className="flex items-center space-x-2 px-6 py-3 bg-green-200 font-bold rounded-lg shadow-md hover:bg-green-100 text-gray-900 transition-all hover:scale-102"
                                                >
                                                    <IoCheckmarkDoneCircle className="text-green-600 size-6" />
                                                    <span>Result</span>
                                                </Link>
                                            </div>
                                        ) : (
                                            <Link
                                                href={`/quiz-start/${activeQuiz._id}/about`}
                                                className="flex items-center space-x-2 px-6 py-3 bg-white font-bold rounded-lg shadow-md hover:bg-gray-100 text-gray-900 transition-all hover:scale-105"
                                            >
                                                <FaPlay className="text-current" />
                                                <span>Start Contest</span>
                                            </Link>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
                            <BsFillPatchQuestionFill className="text-4xl text-gray-400 dark:text-gray-500 mb-4" />
                            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No Active Contest</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md">
                                There are no {type} contests running at the moment. Check back later or explore past contests below.
                            </p>
                        </div>
                    )}
                </motion.div>

                {/* Past Quizzes */}
                {pastQuizzes.length > 0 && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="flex items-center space-x-4 mb-8">
                            <FaHistory className="text-gray-500 dark:text-gray-400" />
                            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Past Contests</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pastQuizzes.map((quiz, index) => (
                                <motion.div
                                    key={quiz._id}
                                    variants={fadeIn}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ duration: 0.3, delay: 0.1 * index }}
                                    className="group"
                                >
                                    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700 overflow-hidden">
                                        <div className={`h-2 ${styles.gradient} dark:${styles.darkGradient}`}></div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between gap-2">
                                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                                        {quiz.quizTitle}-{pastQuizzes.length - index}
                                                    </h3>
                                                    <DownloadQuizPDF quiz={quiz} isAttendActiveQuiz={true}/>
                                                </div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(quiz.startDate).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div className="mt-auto pt-4">
                                                <Link
                                                    href={`/quiz-start/${quiz._id}/leaderboard`}
                                                    className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg border border-transparent ${styles.text} hover:${styles.accent} transition-colors`}
                                                >
                                                    Leaderboard
                                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </Link>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}