"use client";
import React, { use, useEffect, useState } from "react";
import QuizStartQuestions from "./_component/QuizStartQuestions";
import QuizHeader from "./_component/QuizHeader";
import useGlobalContextProvider from "@/app/_context/ContextApi";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import FloatingEmail from "@/components/shared/FloatingEmail";
import toast from "react-hot-toast";
import Lottie from "lottie-react";
import { LoaderCircle } from "lucide-react";

function QuizStart({ params }) {
  const route = useRouter();
  const actualParams = use(params);
  const quizId = actualParams.id;
  const { allQuiz, quizToStartObject,email } = useGlobalContextProvider();
  const { selectQuizToStart, setSelectQuizToStart } = quizToStartObject;

  const [timeLeft, setTimeLeft] = useState(null);

  const [quizCompleted, setQuizCompleted] = useState(false);
  const [focusLossCount, setFocusLossCount] = useState(0);
  const [animationData, setAnimationData] = useState(null);

  useEffect(()=>{
    try {
      
    } catch (error) {
      const res = fetch("/assets/loading.json")
      const data = res.json()
      setAnimationData(data)
    }
  },[])
  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setQuizCompleted(true);
    }
  }, [timeLeft, quizCompleted]);
  

  // useEffect(() => {

  //   if (selectQuizToStart === null) {
  //     route.push("/dashboard");
  //   }
  // }, []);
  useEffect(() => {
    async function fetchQuizData() {
      const resp = await axios.get(`/api/get-quiz-id/${quizId}`);
      if (resp?.data.success === true) {
        const quizData = resp.data.quizData;
        setSelectQuizToStart(quizData);
        setTimeLeft(quizData.quizTime * 60); // ✅ Set timeLeft here
      } else {
        toast.error("Quiz not found");
        route.push("/dashboard");
      }
    }
    fetchQuizData();
  }, [quizId]);


  useEffect(() => {
    const handleBlur = () => {
      console.warn("User clicked outside the window!");
      // You can use toast or set state here
      setFocusLossCount(prev => prev + 1);
      console.log(focusLossCount);
      
      toast.error("Don't click outside the quiz window!");
    };
  
    window.addEventListener("blur", handleBlur);
  
    return () => {
      window.removeEventListener("blur", handleBlur);
    };
  }, []);
  



  //console.log("quizToStartObject",quizToStartObject.selectQuizToStart.quizTime);
  
  return (
    <div className="flex flex-col px-4 md:px-24 mt-[35px]">
      {selectQuizToStart === null ? (
        <div className="h-svh flex flex-col gap-2 items-center justify-center">
            <div>
                <LoaderCircle className="size-16 animate-spin"/>
            </div>
          <h2 className="text-xl font-bold ">Please wait...</h2>
          
        </div>
      ) : (
        <>
          <div>
            <QuizHeader selectQuizToStart={selectQuizToStart} timer={timeLeft} email={email}/>
          </div>
          <div className="mt-10 w-full flex items-center justify-center">
            <QuizStartQuestions timeLeft={timeLeft} setTimeLeft={setTimeLeft}/>
          </div>
          <FloatingEmail email={email} />

        </>
      )}
    </div>
  );
}

export default QuizStart;
