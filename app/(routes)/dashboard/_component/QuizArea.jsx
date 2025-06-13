'use client'
import React from "react";
import QuizCard from "./QuizCard";
import Placeholder from "./Placeholder";
import useGlobalContextProvider from "@/app/_context/ContextApi";
import Card from "./QuizCard1";

function QuizArea() {
    const { allQuiz } = useGlobalContextProvider();
   // console.log(allQuiz);
  return (
    <div className="">
      {allQuiz.length === 0 ? (
        <Placeholder />
      ) : (
        <>
          <h2 className="px-9 text-2xl font-bold">My Quizs</h2>
          <div className="flex flex-wrap gap-2 items-center justify-center">
            {/* <QuizCard />
            <QuizCard />
            <QuizCard />
            <QuizCard /> */}
            {/* {
              allQuiz&&allQuiz.map((quiz,idx)=>(
                <div key={idx}>
                  <QuizArea/>
                </div>
              ))
            } */}
            {
              allQuiz.map((quiz,idx)=>(
                <div key={idx}>
                  <Card quiz={quiz}/>
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
