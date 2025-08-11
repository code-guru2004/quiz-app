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

const typeStyles = {
    daily: {
        gradient: "from-yellow-400 to-orange-500 dark:from-yellow-500 dark:to-orange-600",
        text: "text-yellow-600 dark:text-yellow-400",
        btnText: "text-yellow-600 dark:text-yellow-500",
        btnBorder: "border-yellow-600 dark:border-yellow-500",
        btnHover: "hover:bg-yellow-600 hover:text-white dark:hover:bg-yellow-500 dark:hover:text-gray-900",
    },
    weekly: {
        gradient: "from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600",
        text: "text-green-600 dark:text-green-400",
        btnText: "text-green-600 dark:text-green-500",
        btnBorder: "border-green-600 dark:border-green-500",
        btnHover: "hover:bg-green-600 hover:text-white dark:hover:bg-green-500 dark:hover:text-gray-900",
    },
    monthly: {
        gradient: "from-purple-400 to-indigo-500 dark:from-purple-500 dark:to-indigo-600",
        text: "text-purple-600 dark:text-purple-400",
        btnText: "text-purple-600 dark:text-purple-500",
        btnBorder: "border-purple-600 dark:border-purple-500",
        btnHover: "hover:bg-purple-600 hover:text-white dark:hover:bg-purple-500 dark:hover:text-gray-900",
    },
};

const getIcon = (type) => {
    switch (type) {
        case "daily":
            return <FaCalendarDay />;
        case "weekly":
            return <FaCalendarWeek />;
        case "monthly":
            return <FaCalendarAlt />;
        default:
            return null;
    }
};

export default function ContestTypePage() {
    const { type } = useParams();
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [pastQuizzes, setPastQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { quizToStartObject } = useGlobalContextProvider();
    const { setSelectQuizToStart } = quizToStartObject;

    const styles = typeStyles[type] || typeStyles.daily;

    useEffect(() => {
        async function fetchQuizzes() {
            try {
                setLoading(true);
                const resp1 = await fetch(`/api/quiz/scheduled-quizzes?type=${type}`);
                const data = await resp1.json();
                const resp2 = await axios.get(`/api/quiz/previous-quiz?type=${type}`);
                
                if (resp1.ok || resp2.success) {
                    setActiveQuiz(data.quizzes[0] || null);
                    setPastQuizzes(resp2.data.quizzes);
                }
            } catch (err) {
                console.error("Error fetching quizzes:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchQuizzes();
    }, [type]);

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
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex items-center space-x-4 mb-2">
                    <div className={`text-4xl ${styles.text}`}>{getIcon(type)}</div>
                    <h1 className="text-3xl md:text-5xl font-extrabold capitalize">
                        {type} <span className={styles.text}>Contest</span>
                    </h1>
                </div>
                <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 mb-12">
                    {type === "daily" && "A fresh challenge to start your day!"}
                    {type === "weekly" && "Sharpen your skills with a new challenge every week."}
                    {type === "monthly" && "Take on the ultimate challenge and showcase your expertise!"}
                </p>

                {/* Active Quiz */}
                {activeQuiz ? (
                    <div
                        className={`p-8 md:p-10 bg-gradient-to-br ${styles.gradient} text-white rounded-3xl shadow-2xl mb-12 cursor-pointer transition-transform hover:scale-[1.02]`}
                        onClick={() => setSelectQuizToStart(activeQuiz)}
                    >
                        <span className="absolute top-4 right-4 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                            Active Now
                        </span>
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold mb-2">{activeQuiz.quizTitle}</h2>
                                <p className="text-gray-50  mb-4 max-w-2xl">{activeQuiz.quizDescription}</p>
                                <div className="flex items-center space-x-6 text-sm">
                                    <span className="flex justify-center items-center gap-1"><PiSealQuestionBold />{activeQuiz.quizQuestions.length} Questions</span>
                                    <span className="flex justify-center items-center gap-1"><IoIosTimer /> {activeQuiz.quizTime} Minutes</span>
                                </div>
                            </div>
                            <Link
                                href={`/quiz-start/${activeQuiz._id}/about`}
                                className="mt-6 md:mt-0 flex items-center space-x-2 px-8 py-3 bg-white font-bold rounded-full shadow-lg hover:bg-gray-100 text-gray-900"
                            >
                                <FaPlay />
                                <span>Start Quiz</span>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-3xl shadow-lg mb-12">
                        <p className="text-gray-500 dark:text-gray-400 text-lg italic">
                            No active contest available right now. Check back soon!
                        </p>
                    </div>
                )}

                {/* Past Quizzes */}
                {pastQuizzes.length > 0 && (
                    <div>
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="text-2xl text-gray-600 dark:text-gray-400"><FaHistory /></div>
                            <h3 className="text-2xl font-bold">Previous Contests</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pastQuizzes.map((quiz) => (
                                <div
                                    key={quiz._id}
                                    className={`flex flex-col justify-between p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md border ${styles.btnBorder} transition-transform hover:scale-[1.02]`}
                                >
                                    <div>
                                        <h4 className="text-xl font-semibold mb-2">{quiz.quizTitle}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                            Held from: {new Date(quiz.startDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/quiz/${quiz._id}`}
                                        className={`mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-full border ${styles.btnText} ${styles.btnBorder} ${styles.btnHover}`}
                                    >
                                        View Results
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
