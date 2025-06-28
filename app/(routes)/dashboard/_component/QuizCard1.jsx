'use client'
import useGlobalContextProvider from "@/app/_context/ContextApi";
import { Clock, FileQuestion } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ICONS } from "@/app/Icon"; // Make sure ICONS is imported correctly
import Link from "next/link";
import Loader from "@/components/shared/Loader";
import { useRouter } from "next/navigation";

const Card = ({ quiz, isMostPopular }) => {
    const route = useRouter();
    const [isSubmit, setIsSubmit] = useState(false);
    //const [isLoading, setIsLoading] = useState(false)
    const { email, quizToStartObject,isLoading,setIsLoading } = useGlobalContextProvider();
    const { selectQuizToStart, setSelectQuizToStart } = quizToStartObject;
    const { _id, quizTitle, quizTime, quizDescription, quizIcon, quizQuestions, userSubmissions } = quiz;
    const totalQuestions = quizQuestions.length;
    // quiz is submitted or not ---track
    useEffect(() => {
        setIsLoading(true)
        const hasUserSubmitted = userSubmissions?.some(
            (submission) => {
                return submission?.email === email
            }
        );
        if (hasUserSubmitted) {
            setIsSubmit(true)
        }
        // console.log(quizTitle,hasUserSubmitted);
        setIsLoading(false)
    }, []);

    function handleGoToQuiz() {
        setIsLoading(true)
        if (quiz) {
            route.push(`/quiz-start/${_id}/about`);
            // setIsLoading(false)
        }
        //setIsLoading(false)
    }
    return (
        <div className="relative flex w-80 flex-col rounded-xl bg-white text-gray-700 shadow-md pt-4"
                        onClick={() => {
                            setSelectQuizToStart(quiz)
                        }}>
                        {/* is submitted or not */}
                        {
                            isSubmit && <div className="rounded-full text-[10px] w-18 p-1 text-center font-bold text-amber-600 border-1 border-amber-700 absolute z-30 bg-amber-100">Submitted</div>
                        }
                        {
                            isMostPopular && !isSubmit && <div className="animate-caret-blink rounded-full text-[10px] w-18 p-1 text-center font-bold text-red-600 border border-red-700 absolute z-30 bg-red-100">
                                Popular🔥
                            </div>
                        }
                        {/* Gradient Header with Icon */}
                        <div className="relative mx-4  h-40 overflow-hidden rounded-xl bg-gradient-to-r from-green-100 to-blue-100 shadow-lg flex justify-center items-center">
                            {/* Quiz Icon in center of gradient box */}
                            <div className="animate-bounce">
                                {React.cloneElement(ICONS[quizIcon].icon, {
                                    className: `${ICONS[quizIcon].icon.props.className} text-5xl`
                                })}
                            </div>
                        </div>

                        {/* Title & Description */}
                        <div className="p-6">
                            <h5 className="mb-2 text-xl font-semibold leading-snug text-gray-900">
                                {quizTitle}
                            </h5>
                            <p className="text-base font-light leading-relaxed line-clamp-3">
                                {quizDescription?.length > 35
                                    ? `${quizDescription.slice(0, 35)}...`
                                    : quizDescription || "No description provided."}
                            </p>
                        </div>

                        {/* Footer with button and metadata */}
                        <div className="p-6 pt-0 flex items-center justify-between">
                            <button

                                className="rounded-lg bg-green-600 px-6 py-3 text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-lg"
                                onClick={handleGoToQuiz}
                            >
                                Details
                            </button>
                            <div className="flex gap-8">
                                <p className="flex flex-col items-center text-orange-700">
                                    <FileQuestion className="text-orange-700 text-2xl" />
                                    {totalQuestions} Qs
                                </p>
                                <p className="flex flex-col items-center text-green-700">
                                    <Clock className="text-green-700 text-2xl" />
                                    {quizTime} min
                                </p>
                            </div>
                        </div>
        </div>
           

    );
};

export default Card;
