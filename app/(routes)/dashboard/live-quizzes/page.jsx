'use client'
import useGlobalContextProvider from '@/app/_context/ContextApi'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Card from '../practice-quizzes/_componenets/QuizCard';
import QuizCard from '@/components/shared/Card';
import { ArrowRight, Clock, Star, Users } from 'lucide-react';
import { PiSealQuestionDuotone } from 'react-icons/pi';

function LiveQuiz() {
  const router = useRouter();
  const { allQuiz, setSelectQuizToStart } = useGlobalContextProvider();
  const [liveQuizzes, setLiveQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [popularQuiz, setPopularQuiz] = useState(null);
  useEffect(() => {
    setIsLoading(true);
    const liveQuizArray = allQuiz.filter((quiz) => quiz.quizType === 'Live Quiz'); //🔴🔴🔴🔴🔴🔴
    setLiveQuizzes(liveQuizArray);
    setFilteredQuizzes(liveQuizArray);
    console.log(liveQuizArray);

    let maxi = -1;
    let mostPopularId = null;
    for (let i = 0; i < liveQuizArray?.length; i++) {
      const quiz = liveQuizArray[i];
      if (quiz.userSubmissions.length > 0 && maxi < quiz.userSubmissions.length) {
        maxi = quiz.userSubmissions.length;
      mostPopularId = quiz._id;
      }
    }
    if (mostPopularId) {
      setPopularQuiz(mostPopularId);
      console.log('Most popular quiz ID:', mostPopularId);
    }

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timeout);
  }, [allQuiz])


  const categories = [
    "All", "Computer Science", "Programming", "Math", "Aptitude",
    "Science", "Healthcare", "Engineering", "History", "General Science"
  ];

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterQuizzes(category, searchText);
  };

  useEffect(() => {
    filterQuizzes(selectedCategory, searchText);
  }, [searchText]);

  const filterQuizzes = (category, text) => {
    let filtered = [...liveQuizzes];
    if (category !== 'All') {
      filtered = filtered.filter((q) => q.quizCategory === category);
    }
    if (text.trim() !== '') {
      filtered = filtered.filter((q) =>
        q.quizTitle.toLowerCase().includes(text.toLowerCase())
      );
    }
    setFilteredQuizzes(filtered);
  };

  // const handleSelect = (quiz) => {
  //   setSelectQuizToStart(quiz);
  //   router.push(`/quiz-start/${quiz._id}/about`);
  // };

  return (
    <section className="min-h-screen mt-5 px-4 md:px-8 body mb-12">
      <h1 className="flex items-center justify-center gap-3 text-4xl font-bold text-center text-indigo-600 mb-10">
        🔴Live Quizzes
      </h1>

      {/* Search + Category */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
        <input
          type="text"
          placeholder="🔍Search quizzes..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="border px-3 py-2 rounded-md shadow-sm w-full max-w-xs
               bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
        >

          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Cards */}
      {
        isLoading ? (
          // Show shimmer/skeleton loading cards
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          // Show real quiz cards or empty message
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredQuizzes?.length === 0 ? (
              <p className="text-center text-gray-500 col-span-full">
                No live quizzes found.
              </p>
            ) : (
              filteredQuizzes.map((quiz, index) => (
                <QuizCard key={index} quiz={quiz} isPopular={popularQuiz === quiz?._id} />
              ))
            )}
          </div>
        )
      }

    </section>
  )
}

export default LiveQuiz

// components/SkeletonCard.jsx
function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl transition-all duration-300 p-7 border border-gray-100 dark:border-gray-700 flex flex-col justify-between animate-pulse">

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="h-12 w-12 bg-gray-300 dark:bg-gray-700 rounded-lg" />
        <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded-full" />
      </div>

      {/* Title */}
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3" />

      {/* Description */}
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-3 w-5/6 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-3 w-2/3 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>

      {/* Metadata */}
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mt-auto mb-5">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <div className="h-3 w-10 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <PiSealQuestionDuotone className="w-4 h-4 text-gray-400" />
          <div className="h-3 w-10 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-gray-400" />
          <div className="h-3 w-6 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
      </div>

      {/* Category */}
      <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded-full mb-6" />

      {/* Button */}
      <div className="h-11 w-full bg-gray-300 dark:bg-gray-700 rounded-xl" />
    </div>
  );
}
