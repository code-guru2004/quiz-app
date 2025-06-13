import { ICONS } from "@/app/Icon";
import React from "react";

function QuizHeader({selectQuizToStart,timer}) {
  //console.log(timer);
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };
  return (
    <div className="flex justify-between">
      {/* quiz name */}
      <div className="flex gap-2 justify-center">
        <div className="bg-gray-100 w-12 h-12 flex items-center justify-center p-2 rounded-sm border-1 border-green-200 hover:bg-green-100">
          <h1 className="text-5xl">{ICONS[selectQuizToStart?.quizIcon||0].icon}</h1>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="font-bold text-xl">{selectQuizToStart?.quizTitle}</h2>
          {/* <h2 className="font-bold text-xl">{selectQuizToStart?.quizIcon}</h2> */}
          <span className="font-light text-sm">{selectQuizToStart?.quizQuestions.length} Questions</span>
        </div>
      </div>

      {/* timer */}
      <div className="flex gap-2 items-center justify-center bg-green-200 px-3 rounded-full ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-teal-600 animate-caret-blink"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="14" r="8" />
          <path d="M12 10v4l2 2" />
          <path d="M9 2h6M12 2v4" />
        </svg>

        <span>{formatTime(timer)}</span>
      </div>
    </div>
  );
}

export default QuizHeader;
