'use client';

import { FC, useEffect, useState } from 'react';
import { Clock, Users, Star, ArrowRight, BadgeCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import { ICONS } from '@/app/Icon';
import useGlobalContextProvider from '@/app/_context/ContextApi';
import Lottie from 'lottie-react';

const QuizCard = ({ quiz, isPopular }) => {
  const { quizToStartObject } = useGlobalContextProvider();
  const { setSelectQuizToStart } = quizToStartObject;
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    const loadAnimation = async () => {
      const res = await fetch('/assets/Fire.json');
      const data = await res.json();
      setAnimationData(data);
    };

    loadAnimation();
  }, []);

  return (
    <div 
      className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden group z-10"
      onClick={() => setSelectQuizToStart(quiz)}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute top-5 right-5  flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg z-50">
          {animationData && (
            <Lottie 
              animationData={animationData} 
              loop 
              autoplay 
              className="w-5 h-5" 
            />
          )}
          <span className="text-xs font-bold text-white">Trending</span>
        </div>
      )}

      {/* Card Content */}
      <div className="p-6 flex flex-col h-full z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="text-5xl bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-xl">
            {ICONS[quiz.quizIcon]?.icon || '🧠'}
          </div>
          <span className="text-xs font-bold flex items-center bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1.5 rounded-full shadow-md">
            <Zap className="w-3 h-3 mr-1 fill-white" />
            {quiz.quizType}
          </span>
        </div>

        {/* Title and Description */}
        <div className="mb-5 flex-1">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2">
            {quiz.quizTitle}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3">
            {quiz.quizDescription}
          </p>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>{quiz.quizTime} min</span>
          </div>
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-indigo-500" />
            <span>{quiz.quizQuestions.length} Qs</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            <span>{quiz.quizLikes.length}</span>
          </div>
        </div>

        {/* Category Tag */}
        <div className="mb-6">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800">
            {quiz.quizCategory}
          </span>
        </div>

        {/* Start Quiz Button */}
        <Link
          href={`/quiz-start/${quiz._id}/about`}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 group-hover:shadow-lg"
        >
          Start Quiz
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-400 rounded-2xl pointer-events-none transition-all duration-300"></div>
    </div>
  );
};

export default QuizCard;