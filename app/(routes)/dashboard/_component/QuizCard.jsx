import useGlobalContextProvider from "@/app/_context/ContextApi";
import Link from "next/link";
import React from "react";

function QuizCard({quiz}) {
     const { allQuiz,quizToStartObject, } = useGlobalContextProvider();
     const {selectQuizToStart,setSelectQuizToStart}=quizToStartObject;

  const { _id,quizTitle,icon,quizQuestions }=quiz;
  const totalQuestions = quizQuestions.length;
  console.log(quiz);
  

  return (
    <div onClick={()=>{
      setSelectQuizToStart(quiz)
    }}>
      <Link href={`/quiz-start/${_id}`} className="block rounded-lg p-4 shadow-xs shadow-indigo-100">
        <img
          alt=""
          src="https://images.unsplash.com/photo-1613545325278-f24b0cae1224?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          className="h-56 w-full rounded-md object-cover"
        />

        <div className="mt-2">
          <dl>
            

            <div>
              <dt className="sr-only">Address</dt>

              <dd className="font-medium">{icon} {quizTitle}</dd>
            </div>
          </dl>

          <div className="mt-6 flex items-center justify-between gap-8 text-xs">
            <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 size-4 text-indigo-700"
              >
                <circle cx="12" cy="14" r="8" />
                <line x1="12" y1="10" x2="12" y2="14" />
                <line x1="9" y1="3" x2="15" y2="3" />
                <line x1="12" y1="3" x2="12" y2="6" />
              </svg>

              <div className="mt-1.5 sm:mt-0">
                <p className="text-gray-500">Time</p>

                <p className="font-medium">2 Hours</p>
              </div>
            </div>

            <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-teal-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 3.866-3.582 7-8 7h-2l-5 4v-4H5c-1.657 0-3-1.343-3-3V7c0-1.657 1.343-3 3-3h8c4.418 0 8 3.134 8 7z" />
                <circle cx="12" cy="10" r="1" />
                <path d="M12 13v.01" />
              </svg>

              <div className="mt-1.5 sm:mt-0">
                <p className="text-gray-500">Questions</p>

                <p className="font-medium">{totalQuestions}</p>
              </div>
            </div>

            <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-teal-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>

              <div className="mt-1.5 sm:mt-0">
                <p className="text-gray-500">Date</p>

                <p className="font-medium">13/11/2004</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default QuizCard;
