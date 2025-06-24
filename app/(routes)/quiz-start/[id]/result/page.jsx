'use client';

import React, { useEffect, useState } from 'react';

import { CheckCircle, Timer, ListChecks } from 'lucide-react';
import useGlobalContextProvider from '@/app/_context/ContextApi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ICONS } from '@/app/Icon';

const ResultPage = () => {
  const route = useRouter();
  const [quizScore, setQuizScore] = useState(null);
  const { quizToStartObject,email } = useGlobalContextProvider();
  const { selectQuizToStart } = quizToStartObject;

  // Guard if no quiz selected
  if (!selectQuizToStart || !selectQuizToStart.quizTitle) {
    //route.replace("/dashboard")
    return (
      <div className="text-center text-gray-500 mt-10">
        No quiz result found. Please attempt a quiz.
        <br />
        <Link href={'/dashboard'} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-14">Go To Dashboard</Link>
      </div>
    );
  }

  const { _id,quizTitle, quizIcon, score, quizQuestions, quizTime,userSubmissions } = selectQuizToStart;
  const totalQuestions = quizQuestions.length;
  const percentage = ((score / totalQuestions) * 100).toFixed(0);
  //console.log(userSubmissions);
  useEffect(()=>{
    const userInfo = userSubmissions?.filter(submission => submission.email === email);

    console.log(userInfo);
    
    setQuizScore(userInfo[0]?.score)
  },[])

  
  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white shadow-xl rounded-xl border border-gray-200">
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-800 mb-3  p-2 rounded-md flex items-center justify-center">{ICONS[selectQuizToStart.quizIcon].icon}</h1>
        <h1 className="text-2xl font-bold text-gray-800">{quizTitle}</h1>
        <p className="text-sm text-gray-500">Your Quiz Result</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-lg">
          <span className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            Score:
          </span>
          <span className="font-semibold text-gray-800">{quizScore} / {totalQuestions}</span>
        </div>

        <div className="flex items-center justify-between text-lg">
          <span className="flex items-center gap-2 text-blue-600">
            <ListChecks className="w-5 h-5" />
            Percentage:
          </span>
          <span className="font-semibold text-gray-800">{(quizScore/totalQuestions)*100}%</span>
        </div>

        <div className="flex items-center justify-between text-lg">
          <span className="flex items-center gap-2 text-yellow-600">
            <Timer className="w-5 h-5" />
            Time Allowed:
          </span>
          <span className="font-semibold text-gray-800">{quizTime} mins</span>
        </div>
      </div>

      <div className="mt-6 text-center flex justify-center items-center gap-6">
        <button
          onClick={() => window.location.href = '/dashboard'} // or any route
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to Dashboard 🏠
        </button>
        <button
          onClick={() => window.location.href = `/quiz-start/${_id}/leaderboard`} // or any route
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Go to Leaderboard 🎓
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
