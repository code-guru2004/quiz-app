"use client";
import React, { use, useEffect, useState } from "react";
import QuizStartQuestions from "./_component/QuizStartQuestions";
import QuizHeader from "./_component/QuizHeader";
import useGlobalContextProvider from "@/app/_context/ContextApi";
import { useRouter } from "next/navigation";
import Image from "next/image";

function QuizStart({ params }) {
  const route = useRouter();
  const actualParams = use(params);
  const quizId = actualParams.id;
  const { allQuiz, quizToStartObject } = useGlobalContextProvider();
  const { selectQuizToStart, setSelectQuizToStart } = quizToStartObject;

  const [timeLeft, setTimeLeft] = useState((quizToStartObject?.selectQuizToStart?.quizTime)*60);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setQuizCompleted(true);
    }
  }, [timeLeft, quizCompleted]);

  useEffect(() => {
    if (selectQuizToStart === null) {
      route.push("/dashboard");
    }
  }, []);
  //console.log("quizToStartObject",quizToStartObject.selectQuizToStart.quizTime);
  
  return (
    <div className="flex flex-col px-4 md:px-24 mt-[35px]">
      {selectQuizToStart === null ? (
        <div className="h-svh flex flex-col gap-2 items-center justify-center">
          <Image src={"/errorIcon.png"} alt="image" width={180} height={180} />
          <h2 className="text-xl font-bold">Please Select Your Quiz</h2>
          <span className="font-light">You will readirecyt to home page</span>
        </div>
      ) : (
        <>
          <div>
            <QuizHeader selectQuizToStart={selectQuizToStart} timer={timeLeft}/>
          </div>
          <div className="mt-10 w-full flex items-center justify-center">
            <QuizStartQuestions timeLeft={timeLeft} setTimeLeft={setTimeLeft}/>
          </div>
        </>
      )}
    </div>
  );
}

export default QuizStart;
