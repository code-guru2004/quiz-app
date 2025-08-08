'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import useGlobalContextProvider from '@/app/_context/ContextApi';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { LuCircleFadingPlus, LuClock, LuBookOpen, LuZap, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { FiAward, FiBarChart2, FiHardDrive, FiCpu } from "react-icons/fi";

export default function AIQuizDashboard() {
  const router = useRouter();
  const { setAiQuiz } = useGlobalContextProvider();
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [timePerQuestion, setTimePerQuestion] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [previousQuizzes, setPreviousQuizzes] = useState([]);

  const fetchUserData = async (username) => {
    try {
      const res = await fetch(`/api/get-user?username=${username}`);
      const data = await res.json();
      setPreviousQuizzes(data?.userData?.aiQuizzes || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = typeof window !== "undefined" && localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          if (decoded.username) {
            fetchUserData(decoded.username);
          }
        } catch (err) {
          toast.error("Session expired. Please login again.");
        }
      }
    };
    fetchUser();
  }, []);

  async function handleGetAiQuiz(e) {
    e.preventDefault();
    setIsLoading(true);

    if (!category || !difficulty) {
      toast.error("Please select category and difficulty");
      setIsLoading(false);
      return;
    }

    try {
      const resp = await axios.post('/api/get-ai-quiz', {
        category,
        difficulty,
        totalQuestions,
        timePerQuestion
      });

      if (resp?.data?.quiz) {
        setAiQuiz(resp.data.quiz);
        router.push('/ai-quiz-attend');
      }
    } catch (error) {
      toast.error("Failed to generate quiz. Please try again.");
      console.error('AI quiz generation failed:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FiCpu className="text-blue-600 dark:text-blue-400" />
            AI Quiz Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Generate custom quizzes powered by AI
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg transition-all hover:shadow-xl">
              <LuCircleFadingPlus className="w-5 h-5" />
              New AI Quiz
            </button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl rounded-xl">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <FiCpu className="text-blue-600 w-6 h-6" />
                <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Generate New Quiz
                </DialogTitle>
              </div>
            </DialogHeader>

            <form className="space-y-6 mt-2" onSubmit={handleGetAiQuiz}>
              {/* Category */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <LuBookOpen className="inline mr-2 w-4 h-4" />
                  Category
                </label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., JavaScript, Machine Learning, History"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Difficulty */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FiBarChart2 className="inline mr-2 w-4 h-4" />
                  Difficulty Level
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { level: 'easy', color: 'bg-green-500', icon: <FiAward className="w-4 h-4" /> },
                    { level: 'medium', color: 'bg-yellow-500', icon: <FiHardDrive className="w-4 h-4" /> },
                    { level: 'hard', color: 'bg-red-500', icon: <LuZap className="w-4 h-4" /> }
                  ].map(({ level, color, icon }) => (
                    <button
                      type="button"
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm capitalize transition-all ${difficulty === level
                        ? `${color} text-white border-transparent shadow-md`
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                      {icon}
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Questions & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Questions */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Number of Questions
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={3}
                      max={20}
                      value={totalQuestions}
                      onChange={(e) => setTotalQuestions(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400 min-w-[2rem] text-center">
                      {totalQuestions}
                    </span>
                  </div>
                </div>

                {/* Time per Question */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <LuClock className="inline mr-2 w-4 h-4" />
                    Time per Question (min)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={0.5}
                      max={5}
                      step={0.5}
                      value={timePerQuestion}
                      onChange={(e) => setTimePerQuestion(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400 min-w-[3rem] text-center">
                      {timePerQuestion}
                    </span>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-xl font-medium text-white shadow-lg transition-all ${isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl'
                  }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <LuZap className="w-5 h-5" />
                    Generate Quiz
                  </span>
                )}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Previous Quizzes Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <FiAward className="text-blue-600 dark:text-blue-400" />
            Your Quiz History
          </h2>
        </div>

        <PaginatedQuizzes previousQuizzes={previousQuizzes} />
      </div>
    </div>
  );
}

const PaginatedQuizzes = ({ previousQuizzes = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const quizzesPerPage = 5;
  const totalPages = Math.ceil(previousQuizzes.length / quizzesPerPage);
  const currentQuizzes = previousQuizzes.slice(
    (currentPage - 1) * quizzesPerPage,
    currentPage * quizzesPerPage
  );

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {currentQuizzes.length > 0 ? (
        <>
          {currentQuizzes.map((quiz, idx) => (
            <div key={idx} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${getDifficultyColor(quiz.level).bg} ${getDifficultyColor(quiz.level).text}`}>
                    {getDifficultyIcon(quiz.level)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{quiz.category}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(quiz.level).badge}`}>
                        {quiz.level.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(quiz.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Score</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {quiz.score}/{quiz.totalQuestions}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {quiz.totalTime} min
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <LuChevronLeft className="w-5 h-5" />
                Previous
              </button>

              <span className="text-sm text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Next
                <LuChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="p-12 text-center">
          <div className="mx-auto max-w-md">
            <FiAward className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No quiz history</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Your generated quizzes will appear here once you start creating them.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions for difficulty styling
function getDifficultyColor(level) {
  switch (level) {
    case 'hard':
      return {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-600 dark:text-red-400',
        badge: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
      };
    case 'medium':
      return {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-600 dark:text-yellow-400',
        badge: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
      };
    default:
      return {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-600 dark:text-green-400',
        badge: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
      };
  }
}

function getDifficultyIcon(level) {
  switch (level) {
    case 'hard':
      return <LuZap className="w-6 h-6" />;
    case 'medium':
      return <FiHardDrive className="w-6 h-6" />;
    default:
      return <FiAward className="w-6 h-6" />;
  }
}