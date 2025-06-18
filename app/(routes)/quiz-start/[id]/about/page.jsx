"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaClock, FaExclamationTriangle, FaListAlt } from "react-icons/fa";
import { BsPatchCheckFill } from "react-icons/bs";
import { Button } from "@/components/ui/button"; // adjust if not using shadcn/ui
import useGlobalContextProvider from "@/app/_context/ContextApi";
import Image from "next/image";
import { ICONS } from "@/app/Icon";

const QuizAboutPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    const { email, quizToStartObject } = useGlobalContextProvider();
    const { selectQuizToStart } = quizToStartObject;
    //const totalQuestions = quizQuestions.length;
    //console.log(_id);

    if (!selectQuizToStart) {
        return (
            <>
                <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4">
                    <Image
                        src="/no-select.png" // Replace with your actual image path
                        alt="No Quiz"
                        width={220}
                        height={220}
                        className="mb-6"
                    />
                    <h2 className="text-2xl font-bold text-green-800 mb-2">No Quiz Selected</h2>
                    <p className="text-gray-700 text-center max-w-md mb-6">
                        Please select a quiz from the list to begin. If you haven’t created or assigned one yet, go back to the home page or explore available quizzes.
                    </p>
                    <button
                        onClick={() => {
                            router.replace("/dashboard");
                            setIsLoading(true)
                        }} // adjust the path based on your app
                        className="bg-green-700 text-white px-6 py-2 rounded-full shadow hover:bg-green-800 transition-all"
                    >
                        {isLoading ? "Redirecting..." : "Browse Quizzes"}
                    </button>
                </div>
            </>
        )
    }

    const { _id, quizTitle, quizTime, quizDescription, quizIcon, quizQuestions, userSubmissions } = selectQuizToStart;
    useEffect(() => {
        const hasUserSubmitted = userSubmissions?.some(
            (submission) => {
                return submission?.email === email
            }
        );
        if (hasUserSubmitted) {
            setIsSubmit(true)
        }
        // console.log(quizTitle,hasUserSubmitted);

    }, [])
    const startQuiz = () => {
        setIsLoading(true)
        if (isSubmit) {
            router.push(`/quiz-start/${_id}/result`);
        } else {
            router.push(`/quiz-start/${selectQuizToStart._id}`);

        }
    };

    const [readMore, setReadMore] = useState(false);

    const toggleReadMore = () => setReadMore(!readMore);

    const MAX_LENGTH = 700;
    const description = selectQuizToStart.quizDescription || "";
    const shouldTruncate = description.length > MAX_LENGTH;
    const visibleText = readMore ? description : description.slice(0, MAX_LENGTH);

    return (
        <div className="min-h-screen flex items-center justify-between bg-gradient-to-br from-green-50 to-green-100 px-4">
            <div className="flex flex-col lg:flex-row justify-between gap-10 w-full px-[10%] mx-auto my-8 items-center">

                {/* div-1 */}
                <div className="lg:w-3/5 w-full">
                    <div className="flex flex-col items-start gap-1 ">
                        {/* Icon */}
                        <h1 className="text-3xl sm:text-4xl font-bold text-green-800 mb-3 bg-gray-100 p-2 rounded-md">{ICONS[selectQuizToStart.quizIcon].icon}</h1>
                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl font-bold text-green-800 mb-3">{selectQuizToStart.quizTitle}</h1>
                    </div>

                    {/* Description */}
                    <div className="text-gray-700 whitespace-pre-line break-words mb-6 text-start">
                        {visibleText}
                        {shouldTruncate && !readMore && "..."}
                        {shouldTruncate && (
                            <button
                                onClick={toggleReadMore}
                                className="text-green-700 underline ml-1 font-semibold"
                            >
                                {readMore ? "Read Less" : "Read More"}
                            </button>
                        )}
                    </div>


                    {/* Info Boxes */}
                    <div className="grid grid-col-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center space-x-3 bg-green-200 px-4 py-4 rounded-xl">
                            <FaClock className="text-green-700 text-xl" />
                            <div>
                                <p className="text-sm text-gray-600">Time Limit</p>
                                <p className="text-md font-semibold">{selectQuizToStart.quizTime} minutes</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 bg-green-200 p-4 rounded-xl">
                            <FaListAlt className="text-green-700 text-xl" />
                            <div>
                                <p className="text-sm text-gray-600">Total Questions</p>
                                <p className="text-md font-semibold">{selectQuizToStart?.quizQuestions.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* div-2 */}
                <div className="lg:w-2/5 w-full">
                    {/* Warnings */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg mb-5">
                        <div className="flex items-start space-x-3">
                            <FaExclamationTriangle className="text-yellow-600 mt-1" />
                            <div>
                                <p className="text-yellow-700 font-semibold mb-1">Important Warnings:</p>
                                <ul className="text-sm text-yellow-800 list-disc ml-5 space-y-1">
                                    <li>Do not switch tabs during the quiz.</li>
                                    <li>Do not try to refresh or reload the page.</li>
                                    <li>Each attempt is monitored for unfair behavior.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Precautions / What Not To Do */}
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg mb-8">
                        <div className="flex items-start space-x-3">
                            <BsPatchCheckFill className="text-green-600 mt-1" />
                            <div>
                                <p className="text-green-800 font-semibold mb-1">Before You Start:</p>
                                <ul className="text-sm text-green-900 list-disc ml-5 space-y-1">
                                    <li>Ensure a stable internet connection.</li>
                                    <li>It is advised to use <strong>desktop</strong> to atten quiz.</li>
                                    <li>Use a modern browser (Chrome, Firefox, Edge).</li>
                                    <li>Complete the quiz in one go without interruptions.</li>
                                    <li>Read each question carefully before answering.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Start Button */}
                    <div className="flex justify-center">
                        {
                            isSubmit ?
                                (<Button
                                    onClick={startQuiz}
                                    className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 text-md font-semibold rounded-full shadow-md transition-transform hover:scale-105"
                                >
                                    {isLoading ? 'Redirecting...' : 'View Result 🎓'}
                                </Button>) : (
                                    <Button
                                        onClick={startQuiz}
                                        className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 text-md font-semibold rounded-full shadow-md transition-transform hover:scale-105"
                                    >
                                        {isLoading ? 'Redirecting to quiz...' : 'Start Quiz 🚀'}
                                    </Button>
                                )
                        }
                    </div>
                </div>

            </div>
        </div>
    );
};

export default QuizAboutPage;
