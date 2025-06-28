'use client';

import { FC } from 'react';
import { Clock, Users, Star, ArrowRight,BadgeQuestionMark  } from 'lucide-react'; // Added ArrowRight for the button icon
import Link from 'next/link';
import { ICONS } from '@/app/Icon'; // Assuming this path is correct for your icons
import useGlobalContextProvider from '@/app/_context/ContextApi';
import { PiSealQuestionDuotone } from 'react-icons/pi';

const QuizCard = ({ quiz, onSelect }) => {
  const { quizToStartObject } = useGlobalContextProvider();
  const { setSelectQuizToStart } = quizToStartObject
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-7 border border-gray-100 dark:border-gray-700 flex flex-col justify-between transform hover:-translate-y-1"
      onClick={() => setSelectQuizToStart(quiz)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="text-5xl md:text-6xl text-indigo-600 dark:text-indigo-400">
          {ICONS[quiz.quizIcon]?.icon || '🧠'}
        </div>
        <span className="text-xs font-bold flex items-center bg-red-400 text-white px-4 py-2 rounded-full shadow-md">
          <div className="relative flex items-center justify-center h-4 w-4">
            <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </div>
          {quiz.quizMode}
        </span>
      </div>

      {/* Title and Description */}
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 truncate">
        {quiz.quizTitle}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-4">
        {quiz.quizDescription}
      </p>

      {/* Metadata */}
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mt-auto mb-5">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-500" />
          <span>{quiz.quizTime} min</span>
        </div>
        <div className="flex items-center gap-2">
          <PiSealQuestionDuotone className="w-4 h-4 text-indigo-500" />
          <span>{quiz.quizQuestions.length} Qs</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-400" />
          <span>{quiz.quizLikes.length}</span>
        </div>
      </div>

      {/* Category Tag */}
      <div className="mb-6">
        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-700 px-3 py-1.5 rounded-full shadow-sm">
          {quiz.quizCategory}
        </span>
      </div>

      {/* Start Quiz Button */}
      <Link
        href={`/quiz-start/${quiz._id}/about`}
        className="mt-2 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white text-base font-semibold py-3 px-6 rounded-xl text-center transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        Start Quiz
        <ArrowRight className="w-5 h-5" />
      </Link>
    </div>
  );
};

export default QuizCard;