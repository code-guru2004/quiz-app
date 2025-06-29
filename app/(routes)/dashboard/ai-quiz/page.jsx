'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import useGlobalContextProvider from '@/app/_context/ContextApi';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { LuCircleFadingPlus } from "react-icons/lu";

export default function AIQuizDashboard() {
  const router = useRouter();
  const { setAiQuiz } = useGlobalContextProvider();
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [timePerQuestion, setTimePerQuestion] = useState(1);
  const [isLoading, setIsLoading] = useState(false)
  const [previousQuizzes, setPreviousQuizzes] = useState([]);

  // Mock previous quizzes (replace with your real data from DB)
  // const previousQuizzes = [
  //   { title: 'JavaScript Basics', score: 8, total: 10, date: '2025-06-28' },
  //   { title: 'React Hooks', score: 7, total: 10, date: '2025-06-25' },
  //   { title: 'Cybersecurity', score: 9, total: 10, date: '2025-06-22' },
  const fetchUserData = async (username) => {
    try {
      const res = await fetch(`/api/get-user?username=${username}`);
      const data = await res.json();
      console.log(data.userData);
      const userInfo = data?.userData;
      setPreviousQuizzes(userInfo?.aiQuizzes)
      //console.log("User data:", res.data.userData);
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data || error.message);
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        try {
          const decoded = jwtDecode(token);
          const username = decoded.username;
          const email = decoded.email;
          if (username && email) {
            fetchUserData(username)
          }
        } catch (err) {
          toast.error("User not found")
        }
      }
    };
    fetchUser();
  }, []);
  // ];
  async function handleGetAiQuiz(e) {
    e.preventDefault(); // Prevent page reload
    setIsLoading(true)

    if (category === "" || difficulty === "") {
      toast.error("Fill all options.");
      setIsLoading(false)
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
      console.error('AI quiz generation failed:', error);
    }
  }




  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Button to open modal */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-300">🎓 AI Quiz Dashboard</h1>
        <Dialog>
          <DialogTrigger asChild>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition flex justify-center items-center gap-1 text-xs md:text-base">
              <LuCircleFadingPlus className='text-white size-6 font-bold'/> New AI Quiz
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-blue-700 dark:text-blue-300">🧠 Generate AI Quiz</DialogTitle>
            </DialogHeader>

            {/* AI Quiz Form in Modal */}
            <form className="space-y-6 mt-4" onSubmit={handleGetAiQuiz}>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-1">📚 Category</label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Data Structures"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium mb-1">🎯 Difficulty</label>
                <div className="flex gap-3">
                  {['easy', 'medium', 'hard'].map((level) => (
                    <button
                      type="button"
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`px-4 py-1.5 rounded-full border text-sm capitalize ${difficulty === level
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600'
                        }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Questions */}
              <div>
                <label className="block text-sm font-medium mb-1">🔢 Total Questions</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={3}
                    max={20}
                    value={totalQuestions}
                    onChange={(e) => setTotalQuestions(Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-blue-600 font-bold">{totalQuestions}</span>
                </div>
              </div>

              {/* Time per Question */}
              <div>
                <label className="block text-sm font-medium mb-1">⏱️ Time Per Question (min)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0.5}
                    max={5}
                    step={0.5}
                    value={timePerQuestion}
                    onChange={(e) => setTimePerQuestion(Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-indigo-600 font-bold">{timePerQuestion}</span>
                </div>
              </div>

              {/* Generate Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium shadow transition"
              >

                {
                  isLoading ? "Preparing..." : "🚀 Generate Quiz"
                }
              </button>

            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Previously Attended Quizzes */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-4">📄 Previous AI Quizzes</h2>
        {previousQuizzes?.length > 0 ? (
          <div className="space-y-4">
            {previousQuizzes?.map((quiz, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg hover:shadow transition"
              >
                <div className='flex gap-5 justify-center items-center'>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">{quiz.category}</h3>
                  <p
                    className={`text-xs font-semibold px-2 py-1 rounded-xl capitalize
    ${quiz.level === 'hard'
                        ? 'bg-red-700 text-white'
                        : quiz.level === 'medium'
                          ? 'bg-yellow-600 text-gray-100'
                          : 'bg-green-500 text-white'
                      }`}
                  >
                    {quiz.level}
                  </p>

                </div>
                <div className="text-right space-y-2">
                  <p className="text-blue-600 font-bold">
                    Score: {quiz.score}/{quiz.totalQuestions}
                  </p>
                  <p className='text-xs'>
                    {
                      new Date(quiz.createdAt).toLocaleString(undefined, {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                            })
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">You haven’t taken any AI quiz yet.</p>
        )}
      </div>
    </div>
  );
}
