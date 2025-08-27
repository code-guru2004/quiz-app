"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaClock, FaExclamationTriangle, FaListAlt } from "react-icons/fa";
import { BsPatchCheckFill, BsPatchQuestion } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import useGlobalContextProvider from "@/app/_context/ContextApi";
import Image from "next/image";
import { ICONS } from "@/app/Icon";
import LikeDislike from "../_component/LikeDislike";
import { Bounce, toast } from "react-toastify";
import { GiDuration } from "react-icons/gi";
import { TbListDetails } from "react-icons/tb";
import Link from "next/link";
import { MdOutlineSystemSecurityUpdateWarning } from "react-icons/md";

const QuizAboutPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    const { email, quizToStartObject, username } = useGlobalContextProvider();
    const { selectQuizToStart } = quizToStartObject;

    if (!selectQuizToStart) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
                <div className="max-w-md text-center p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-xl">
                    <Image
                        src="/no-select.png"
                        alt="No Quiz"
                        width={180}
                        height={180}
                        className="mx-auto mb-6"
                    />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">No Quiz Selected</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Please select a quiz from the list to begin. If you haven't created or assigned one yet, go back to the home page or explore available quizzes.
                    </p>
                    <button
                        onClick={() => {
                            router.replace("/dashboard");
                            setIsLoading(true);
                        }}
                        className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full font-medium"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Redirecting...
                            </span>
                        ) : "Browse Quizzes"}
                    </button>
                </div>
            </div>
        );
    }

    const { _id, quizTitle, quizTime, quizDescription, quizIcon, quizQuestions, userSubmissions } = selectQuizToStart;

    useEffect(() => {
        const hasUserSubmitted = userSubmissions?.some(
            (submission) => submission?.email === email
        );
        if (hasUserSubmitted) {
            setIsSubmit(true);
            toast.success('You can view your result', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }
    }, []);

    const handleStartQuiz = async () => {
        const res = await fetch('/api/quiz/start-quiz', {
            method: 'POST',
            body: JSON.stringify({
                quizId: _id,
                email: email,
                username: username
            })
        });
        return await res.json();
    };

    const startQuiz = () => {
        setIsLoading(true);
        const resp = handleStartQuiz()
        
        if (resp && isSubmit) {
            router.push(`/quiz-start/${_id}/result`);
        } else {
            const quizUrl = `/quiz-start/${selectQuizToStart._id}`;
            const screenWidth = window.screen.width;
            const screenHeight = window.screen.height;

            // Open in a new fullscreen-like window
            const quizWindow = window.open(
                quizUrl,
                "_blank",
                `toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,fullscreen=yes,width=${screenWidth},height=${screenHeight}`
            );

            // Fallback if popup was blocked
            if (!quizWindow) {
                alert("Popup blocked! Please allow popups for this site.");
                setIsLoading(false);
            }
            setIsLoading(false)
        }
    };

    const [readMore, setReadMore] = useState(false);
    const toggleReadMore = () => setReadMore(!readMore);

    const MAX_LENGTH = 500;
    const description = selectQuizToStart.quizDescription || "";
    const shouldTruncate = description.length > MAX_LENGTH;
    const visibleText = readMore ? description : description.slice(0, MAX_LENGTH);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                        {/* Left Panel - Quiz Info */}
                        <div className="lg:col-span-2 p-8 sm:p-10">
                            <div className="flex items-start space-x-4 mb-6">
                                <div className="relative flex-shrink-0 p-3 rounded-lg">
                                    {/* Animated Gradient Border */}
                                    <div className="absolute inset-0 rounded-lg p-[2px] animate-gradient-border">
                                        <div className="h-full w-full rounded-lg bg-blue-100 dark:bg-blue-900"></div>
                                    </div>

                                    {/* Icon */}
                                    <span className="relative text-2xl text-blue-600 dark:text-blue-400">
                                        {ICONS[selectQuizToStart.quizIcon].icon}
                                    </span>
                                </div>

                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                        {selectQuizToStart.quizTitle}
                                    </h1>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                            {selectQuizToStart.quizQuestions.length} Questions
                                        </span>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                            {selectQuizToStart.quizTime} Minutes
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-gray-900 dark:text-slate-400 whitespace-pre-line break-words mb-6 text-start text-sm md:text-base">
                                {visibleText}
                                {shouldTruncate && !readMore && "..."}
                                {shouldTruncate && (
                                    <button
                                        onClick={toggleReadMore}
                                        className="text-green-700 dark:text-green-300 underline ml-1 font-semibold"
                                    >
                                        {readMore ? "Read Less" : "Read More"}
                                    </button>
                                )}
                            </div>

                            <div className="mb-8">
                                <LikeDislike
                                    quizId={selectQuizToStart._id}
                                    initialLikes={selectQuizToStart.quizLikes}
                                    initialDislikes={selectQuizToStart.quizDislikes}
                                    email={email}
                                />
                            </div>
                        </div>

                        {/* Right Panel - Action Area */}
                        <div className="bg-gray-50 dark:bg-gray-700 p-8 sm:p-10 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-600">
                            <div className="space-y-6">
                                {/* Warning Card */}
                                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 ">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <FaExclamationTriangle className="h-5 w-5 text-red-500 dark:text-red-400" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Important Warnings</h3>
                                            <div className="mt-2 text-sm text-red-700 dark:text-red-300 space-y-1">
                                                <p>• Do not switch tabs during the quiz</p>
                                                <p>• Do not refresh or reload the page</p>
                                                <p>• Each attempt is monitored for fairness</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Preparation Card */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-xs">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <BsPatchCheckFill className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Before You Start</h3>
                                            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300 space-y-1">
                                                <p>• Ensure a stable internet connection</p>
                                                <p>• Recommended to use desktop/laptop</p>
                                                <p>• Use Chrome, Firefox, or Edge</p>
                                                <p>• Complete in one session</p>
                                                <p>• Read questions carefully</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Card */}
                                <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 shadow rounded-lg p-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-1">
                                        <TbListDetails className="size-5 text-blue-700 dark:text-gray-300" />
                                        Quiz Summary
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-gradient-to-r from-yellow-100 to-orange-200 dark:from-yellow-600/40 dark:to-orange-600/40 p-3 rounded-lg flex items-center gap-2">
                                            <div className="border-r-4 border-orange-400 pr-3">
                                                <GiDuration className="size-7 text-orange-600 dark:text-orange-400" />
                                            </div>
                                            <div className="flex flex-col items-start justify-center">
                                                <p className="text-sm text-orange-900 dark:text-gray-400 flex items-center gap-1">

                                                    Duration
                                                </p>
                                                <p className="text-xl font-semibold text-orange-700 dark:text-orange-200">
                                                    {selectQuizToStart.quizTime} min
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-green-100 dark:bg-green-800 p-3 rounded-lg flex items-center gap-2">
                                            <div className="border-r-4 border-green-400 dark:border-green-600 pr-3">
                                                <BsPatchQuestion className="size-7 text-green-700 dark:text-green-300" />
                                            </div>
                                            <div className="flex flex-col items-start justify-center">
                                                <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-1">
                                                    Questions
                                                </p>
                                                <p className="text-xl font-semibold text-green-900 dark:text-green-100">
                                                    {selectQuizToStart.quizQuestions.length}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="pt-4">
                                    {isSubmit ? (
                                        <Button
                                            onClick={startQuiz}
                                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Loading Results...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                    View My Results
                                                </>
                                            )}
                                        </Button>
                                    ) : (
                                        <div>
                                            <Button
                                                onClick={startQuiz}
                                                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Preparing Quiz...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                                        </svg>
                                                        Start Quiz Now
                                                    </>
                                                )}
                                            </Button>
                                            <Link href={"/check-system"} className="text-orange-400 text-xs text-center flex items-center justify-center gap-1 mt-2 hover:underline"><MdOutlineSystemSecurityUpdateWarning className="text-orange-400 size-4"/>Check Sytem Compatibility</Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizAboutPage;