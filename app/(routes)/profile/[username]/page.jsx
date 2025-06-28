"use client"; // This component will be rendered on the client side

import useGlobalContextProvider from '@/app/_context/ContextApi';
import { ICONS } from '@/app/Icon';
import axios from 'axios';
import { ArrowLeft, CircleArrowLeft, UserIcon } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';



export default function ProfilePage() {
  const params = useParams();
  const username = params.username;
  const [isLoading, setIsLoading] = useState(false);
  const [submittedQuiz,setSubmittedQuiz] = useState([]);
  const [email, setEmail] = useState(null);
  const [totalScore,setTotalScore] = useState(0);
  const [maxScore,setMaxScore] = useState(0);
  const [performanceData, setPerformanceData] = useState([])
  const [scoreHistoryData, setScoreHistoryData] = useState([]);
  const [accuracy, setAccuracy] = useState(0);
  //const {email} =useGlobalContextProvider();

  const fetchUserData = async () => {
    try {
      const res = await fetch(`/api/get-user?username=${username}`);
      const data = await res.json();
      console.log(data.userData);
      const userInfo = data?.userData;
      setEmail(userInfo.email);
      setSubmittedQuiz(userInfo.submitQuiz);
      //console.log("User data:", res.data.userData);
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchUserData();
    
  }, []);

  useEffect(() => {
    let score = 0;
    let maxi = -99;
    let totalQuestions = 0;
    let correctAnswers = 0;
    const performanceList = [];
    const historyList = [];
  
    for (let i = 0; i < submittedQuiz.length; i++) {
      score += submittedQuiz[i]?.quizScore;
      totalQuestions += submittedQuiz[i]?.quizTotalQuestions;
      correctAnswers += submittedQuiz[i]?.quizScore;
      if (submittedQuiz[i]?.quizScore > maxi) {
        maxi = submittedQuiz[i]?.quizScore;
      }
      const acc = totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(2) : 0;
      setAccuracy(acc);

      const percentageScore = (submittedQuiz[i]?.quizScore * 100) / submittedQuiz[i]?.quizTotalQuestions;
      performanceList.push({
        name: submittedQuiz[i]?.quizTitle,
        avgScore: percentageScore,
      });
  
      historyList.push({
        name: submittedQuiz[i]?.quizTitle,
        score: percentageScore,
      });
    }
  
    setPerformanceData(performanceList);
    setScoreHistoryData(historyList);
    setTotalScore(score);
    setMaxScore(maxi===-99?0:maxi);
  }, [submittedQuiz]);
  const getBadges = () => {
    const badges = [];
    if(submittedQuiz.length===0) badges.push("🌱🚀 Ice Breaker")
    if (submittedQuiz.length >= 10) badges.push("🧠 Quiz Whiz");
    if (submittedQuiz.length >= 15) badges.push("🦾 Pro Player");
    if (maxScore >= 90) badges.push("🏆 High Scorer");
    if (accuracy > 80) badges.push("🎯 Accuracy Master");
    else{
      badges.push("📈Rising Star")
    }
    return badges;
  };
  
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-700 to-green-800 text-gray-100 font-sans px-2 md:px-4 py-6 flex items-center justify-center">
    <Head>
      <title>User Profile - Quizo</title>
      <meta name="description" content="View your quiz performance and statistics." />
    </Head>
  
    <Link href="/dashboard" className="absolute top-4 left-4 bg-white  rounded-full shadow">
      <CircleArrowLeft className="text-green-500 w-8 h-8 md:w-10 md:h-10" />
    </Link>
  
    <div className="w-full max-w-7xl bg-white rounded-2xl shadow-2xl p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 text-gray-900">
  
      {/* LEFT PANEL - Profile & Stats */}
      <div className="bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl p-6 flex flex-col items-center text-center space-y-4 shadow-lg">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-emerald-300 border-4 border-white flex items-center justify-center shadow">
          <UserIcon className="text-green-700 w-10 h-10 md:w-12 md:h-12" />
        </div>
        <p className="text-sm break-all">Username: {username}</p>
  
        <div className="flex flex-wrap justify-center gap-2">
          {getBadges().map((badge, idx) => (
            <span key={idx} className="text-xs md:text-sm bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full shadow-sm">
              {badge}
            </span>
          ))}
        </div>
  
        <h2 className="text-lg md:text-xl font-bold text-emerald-800 break-words">{email}</h2>
  
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 w-full">
        <div className="bg-emerald-500 text-white rounded-lg p-4 shadow-md flex flex-col items-center">
              <span className="text-xl md:text-2xl font-bold">{submittedQuiz.length===0?'0':submittedQuiz.length}</span>
              <span className="text-sm md:text-base opacity-90">Quizzes Attended</span>
            </div>
            <div className="bg-lime-500 text-white rounded-lg p-4 shadow-md flex flex-col items-center">
              <span className="text-xl md:text-2xl font-bold">{maxScore}</span>
              <span className="text-sm md:text-base opacity-90">Max Score</span>
            </div>
            <div className="bg-teal-500 text-white rounded-lg p-4 shadow-md flex flex-col items-center">
              <span className="text-xl md:text-2xl font-bold">{totalScore}</span>
              <span className="text-sm md:text-base opacity-90">Total Score</span>
            </div>
            <div className="bg-blue-400 text-white rounded-lg p-4 shadow-md flex flex-col items-center">
              <span className="text-xl md:text-2xl font-bold">{accuracy}%</span>
              <span className="text-sm md:text-base opacity-90">Quiz Accuracy(%)</span>
            </div>
        </div>
      </div>
  
      {/* RIGHT PANEL - Charts and Table */}
      <div className="lg:col-span-2 flex flex-col space-y-6">
  
        {/* Score History Chart */}
        <div className="bg-gray-50 p-4 md:p-6 rounded-xl shadow-md ">
          <h3 className="text-xl md:text-2xl font-semibold text-emerald-800 mb-4 text-center">Quiz Score History (%)</h3>
          <div className="h-60 sm:h-72 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreHistoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: '#4a5568' }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#4a5568' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#059669" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
  
        {/* Recent Quizzes Table */}
        <div className="bg-gray-50 p-4 md:p-6 rounded-xl shadow-md">
          <h3 className="text-xl md:text-2xl font-semibold text-emerald-800 mb-4 text-center">Recent Quizzes</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Icon</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Questions</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Rank</th>
                </tr>
              </thead>
              <tbody>
                {submittedQuiz.length > 0 ? submittedQuiz.map((quiz, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">{ICONS[quiz?.quizIcon]?.icon}</td>
                    <td className="p-3 break-words">{quiz?.quizTitle}</td>
                    <td className="p-3">{quiz?.quizTotalQuestions}</td>
                    <td className="p-3">{quiz?.quizScore}</td>
                    <td className="p-3">{quiz?.rank}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-400">
                      No quizzes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
  
      </div>
    </div>
  </div>
  
  );
}