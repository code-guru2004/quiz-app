'use client'
import Image from "next/image";
import useGlobalContextProvider from "./_context/ContextApi";
import { useEffect } from "react";

export default function Home() {
     const { allQuiz,quizToStartObject } = useGlobalContextProvider();
     const {selectQuizToStart,setSelectQuizToStart}=quizToStartObject;

     useEffect(()=>{
      setSelectQuizToStart(null)
     },[])
  return (
    <div>
      Home
    </div>
  );
}
