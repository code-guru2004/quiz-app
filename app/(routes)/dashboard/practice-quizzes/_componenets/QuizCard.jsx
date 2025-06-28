'use client'
import useGlobalContextProvider from "@/app/_context/ContextApi";
import { Clock, FileQuestion } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ICONS } from "@/app/Icon"; // Make sure ICONS is imported correctly
import Link from "next/link";
import Loader from "@/components/shared/Loader";
import { useRouter } from "next/navigation";

const Card = ({ quiz }) => {
  const route = useRouter();
  const [isSubmit, setIsSubmit] = useState(false);
  //const [isLoading, setIsLoading] = useState(false)
  const { email, quizToStartObject, isLoading, setIsLoading } = useGlobalContextProvider();
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
    <Link href={`/quiz-start/${_id}/about`} className="relative block border rounded-lg p-5 hover:shadow-green-300 hover:shadow-md transition bg-slate-100 card hover:border-1 hover:border-green-500"
      onClick={() => {
        setSelectQuizToStart(quiz)
      }}>
      {/* is submitted or not */}
      {
        isSubmit && <div className="rounded-full text-[10px] w-18 p-1 text-center font-bold text-amber-600 border-1 border-amber-700 absolute z-30 bg-amber-100 top-1 right-1">Submitted</div>
      }


      {/* Footer with button and metadata */}
      <h2 className="text-lg font-semibold mb-2 flex flex-col gap-3">{ICONS[quiz.quizIcon].icon}{quiz.quizTitle}</h2>
      <p className="text-sm card-para mb-3 line-clamp-2">{quiz.quizDescription?.length > 35
        ? `${quizDescription.slice(0, 35)}...`
        : quizDescription || "No description provided."}</p>
      <div className="flex justify-between text-xs card-para mt-2">
        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{quiz.quizCategory}</span>
        <span>🕒 {quiz.quizTime} min</span>
        <span>📝 {quiz.quizQuestions?.length || 0} questions</span>
      </div>
    </Link>


  );
};

export default Card;
