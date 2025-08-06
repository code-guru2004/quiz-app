'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, Timer, ListChecks, Award, BarChart2 } from 'lucide-react';
import useGlobalContextProvider from '@/app/_context/ContextApi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ICONS } from '@/app/Icon';

const ResultPage = () => {
  const route = useRouter();
  const [quizScore, setQuizScore] = useState(null);
  const [percentage, setPercentage] = useState(0)
  const { quizToStartObject, email } = useGlobalContextProvider();
  const { selectQuizToStart } = quizToStartObject;

  // Guard if no quiz selected
  if (!selectQuizToStart || !selectQuizToStart.quizTitle) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No quiz results found</h3>
          <p className="text-gray-500 mb-6">Please attempt a quiz to see your results.</p>
          <Link
            href="/dashboard/live-quizzes"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Go To Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { _id, quizTitle, quizIcon, score, quizQuestions, quizTime, userSubmissions } = selectQuizToStart;
  const totalQuestions = quizQuestions.length;



  useEffect(() => {
    const userInfo = userSubmissions?.filter(submission => submission.email === email);
    setQuizScore(userInfo[0]?.score);
    console.log("user score", userInfo[0]?.score);
    setPercentage(((userInfo[0]?.score / totalQuestions) * 100).toFixed(0))
  }, []);

  // Determine performance level
  const performanceLevel = quizScore >= totalQuestions * 0.8 ? "Excellent" :
    quizScore >= totalQuestions * 0.6 ? "Good" :
      quizScore >= totalQuestions * 0.4 ? "Average" : "Needs Improvement";

  // Performance color mapping
  const performanceColor = {
    "Excellent": "text-emerald-600 bg-emerald-50",
    "Good": "text-blue-600 bg-blue-50",
    "Average": "text-amber-600 bg-amber-50",
    "Needs Improvement": "text-rose-600 bg-rose-50"
  };
  const performanceBgColor = {
    "Excellent": "bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700",
    "Good": "bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700",
    "Average": "bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600",
    "Needs Improvement": "bg-gradient-to-r from-rose-500 to-pink-600 dark:from-rose-600 dark:to-pink-700"
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Quiz Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-white shadow-md mb-4">
            <span className="text-3xl">{ICONS[selectQuizToStart.quizIcon].icon}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{quizTitle}</h1>
          <p className="text-gray-500">Quiz completed successfully</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Performance Summary */}
          <div className={`bg-gradient-to-r ${performanceBgColor[performanceLevel]} p-6 text-white`}>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
      a 15.9155 15.9155 0 0 1 0 31.831
      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="3"
                    strokeDasharray="100, 100"
                  />
                  <path
                    d="M18 2.0845
      a 15.9155 15.9155 0 0 1 0 31.831
      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${percentage}, 100`}
                    strokeLinecap="round"
                  />
                  <text
                    x="18"
                    y="19.5"
                    textAnchor="middle"
                    fill="white"
                    fontSize="3.5"
                    fontWeight="bold"
                  >
                    {percentage}%
                  </text>
                  <text
                    x="18"
                    y="24.5"
                    textAnchor="middle"
                    fill="white"
                    fontSize="2.5"
                    fontWeight="500"
                  >
                    Score
                  </text>
                </svg>

              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${performanceColor[performanceLevel]}`}>
                {performanceLevel}
              </span>
            </div>
          </div>

          {/* Stats Section */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 mb-2">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <p className="text-sm text-gray-500">Correct Answers</p>
                <p className="text-xl font-semibold text-gray-900">{quizScore}/{totalQuestions}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 mb-2">
                  <ListChecks className="h-5 w-5" />
                </div>
                <p className="text-sm text-gray-500">Percentage</p>
                <p className="text-xl font-semibold text-gray-900">{((quizScore / totalQuestions) * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-amber-100 text-amber-600 mb-2">
                  <Timer className="h-5 w-5" />
                </div>
                <p className="text-sm text-gray-500">Time Allowed</p>
                <p className="text-xl font-semibold text-gray-900">{quizTime} mins</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/quiz-start/${_id}/quiz-answers`}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <BarChart2 className="h-5 w-5" />
                View Answers
              </Link>
              <Link
                href={`/quiz-start/${_id}/leaderboard`}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <Award className="h-5 w-5" />
                Leaderboard
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-6 text-center">
          <Link
            href="/dashboard/live-quizzes"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;