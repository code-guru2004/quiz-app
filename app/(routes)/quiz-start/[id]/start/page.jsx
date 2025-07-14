"use client";
import React, { use, useEffect, useState } from "react";
// import QuizStartQuestions from "./_component/QuizStartQuestions";
// import QuizHeader from "./_component/QuizHeader";
// import useGlobalContextProvider from "@/app/_context/ContextApi";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useGlobalContextProvider from "@/app/_context/ContextApi";
import QuizStartQuestions from "../_component/QuizStartQuestions";
import QuizHeader from "../_component/QuizHeader";

function QuizStart({ params }) {
  const route = useRouter();
  const actualParams = use(params);
  const quizId = actualParams.id;
  const { allQuiz, quizToStartObject } = useGlobalContextProvider();
  const { selectQuizToStart, setSelectQuizToStart } = quizToStartObject;
  //const [quizDeatils, setQuizDeatils] = useState(null)
  //  if(!selectQuizToStart &&quizId){

  //    setSelectQuizToStart(allQuiz[quizId])
  //  }
  //setSelectQuizToStart(allQuiz[quizId])
  //console.log(selectQuizToStart);
  // useEffect(()=>{
  //   console.log(allQuiz);
  //   if(selectQuizToStart===null){
  //     console.log(allQuiz[quizId]);
  //     setQuizDeatils(allQuiz[quizId])
  //   }
  // },[allQuiz.length!==0])
  //console.log(allQuiz);
  useEffect(() => {
    if (selectQuizToStart === null) {
      route.push("/dashboard");
    }
  }, []);
  return (
    <div className="flex flex-col px-24 mt-[35px] w-full">
      {selectQuizToStart === null ? (
        <div className="h-svh flex flex-col gap-2 items-center justify-center">
          <Image src={"/errorIcon.png"} alt="image" width={180} height={180} />
          <h2 className="text-xl font-bold">Please Select Your Quiz</h2>
          <span className="font-light">You will readirect to home page.</span>
        </div>
      ) : (
        <>
          <div className="min-w-screen">
            <QuizHeader selectQuizToStart={selectQuizToStart} />
          </div>
          <div className="mt-10 flex items-center justify-center">
            <QuizStartQuestions />
          </div>
        </>
      )}
    </div>
  );
}

export default QuizStart;
