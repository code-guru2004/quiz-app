'use client'
import useGlobalContextProvider from '@/app/_context/ContextApi'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import Card from './_componenets/QuizCard';

function PracticeQuizzes() {
  const router = useRouter();
  const { practiceQuiz, setPracticeQuiz, setSelectQuizToStart } = useGlobalContextProvider();
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchText, setSearchText] = useState('');


  const categories = [
    "All", "Computer Science", "Programming", "Math", "Aptitude",
    "Science", "Healthcare", "Engineering", "History", "General Science"
  ];

  useEffect(() => {
    const fetchPracticeQuizData = async () => {
      try {
        const response = await axios.get("/api/get-practice-quiz");
        if (response?.data.successs === false) {
          toast.error("Failed to get quiz");
          throw new Error("Fetching failed...");
        }
        setPracticeQuiz(response?.data.quiz);
        setFilteredQuizzes(response?.data.quiz); // default to all quizzes
      } catch (error) {
        toast.error("Failed to get quiz");
      }
    };
    fetchPracticeQuizData();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterQuizzes(category, searchText);
  };

  useEffect(() => {
    filterQuizzes(selectedCategory, searchText);
  }, [searchText]);

  const filterQuizzes = (category, text) => {
    let filtered = [...practiceQuiz];

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


  function handleSelect(quiz) {
    setSelectQuizToStart(quiz);
    router.push(`/quiz-start/${quiz._id}`);
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-5  body">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-center mb-8">🎯Practice Quizzes</h1>

      {/* Category Buttons */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-1 rounded-full text-sm border transition ${selectedCategory === cat
              ? 'bg-green-600 text-white border-green-600'
              : 'card text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>
      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search quizzes by title..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            width={20}
            height={20}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
            />
          </svg>
        </div>
      </div>


      {/* Dropdown Filter (Mobile Friendly) */}
      <div className="flex justify-end mb-4">
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


      {/* Quiz Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredQuizzes?.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center">No quizzes found.</p>
        ) : (
          filteredQuizzes.map((quiz, idx) => (
            <div key={idx}>
              <Card quiz={quiz} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PracticeQuizzes;
