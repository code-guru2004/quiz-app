import { ICONS } from "@/app/Icon";
import ThemeToggle from "@/components/shared/ModeToggle";
import React from "react";

function QuizHeader({ selectQuizToStart, timer, email }) {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <div className="flex justify-between items-center py-4 px-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Quiz Info */}
      <div className="flex items-center gap-4">
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-purple-900 dark:to-blue-900 w-14 h-14 flex items-center justify-center p-2 rounded-lg shadow-md">
          <h1 className="text-4xl text-blue-600 dark:text-blue-300">
            {ICONS[selectQuizToStart?.quizIcon || 0].icon}
          </h1>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="font-bold text-xl text-gray-800 dark:text-white">
            {selectQuizToStart?.quizTitle}
          </h2>
          <span className="text-sm font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {selectQuizToStart?.quizQuestions.length} Questions
          </span>
        </div>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-5">
        <ThemeToggle />
        
        {/* Timer */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 px-4 py-2 rounded-full shadow-sm border border-green-200 dark:border-green-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-700 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium text-green-800 dark:text-green-200">
            {formatTime(timer)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default QuizHeader;