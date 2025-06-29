'use client'
import React, { useEffect, useState } from "react";
import QuizCard from "./QuizCard";
import Placeholder from "./Placeholder";
import useGlobalContextProvider from "@/app/_context/ContextApi";
import Card from "./QuizCard1";

function QuizArea() {
    const { allQuiz,setIsLoading } = useGlobalContextProvider();
    //const [isLoading, setIsLoading] = useState(true)
    const [mostPopularQuiz, setMostPopularQuiz] = useState(null);
    
    useEffect(() => {
      if (allQuiz?.length > 0) {
        const sorted = [...allQuiz].sort(
          (a, b) => (b.userSubmissions?.length || 0) - (a.userSubmissions?.length || 0)
        );
        console.log(sorted[0]);
        
        setMostPopularQuiz(sorted[0]);
      }
      setIsLoading(false)
    }, [allQuiz]);
   // console.log(allQuiz);
  return (
    <div className="">
      {allQuiz.length === 0 ? (
        <Placeholder />
      ) : (
        <>
          <h2 className="px-10 lg:px-40 text-2xl font-bold mb-6 md:mb-16">💡All Quizs</h2>
          <div className="flex flex-wrap gap-5 items-center justify-center">
            {
              allQuiz.map((quiz,idx)=>(
                <div key={idx}>
                  <Card quiz={quiz} isMostPopular={mostPopularQuiz?._id===quiz?._id}/>
                </div>
              ))
            }
            
          </div>
        </>
      )}
    </div>
  );
}

export default QuizArea;
