"use client"; // This component will be rendered on the client side

import useGlobalContextProvider from '@/app/_context/ContextApi';
import { ICONS } from '@/app/Icon';
import axios from 'axios';
import { ArrowLeft, UserIcon } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

// --- Mock Data (Replace with real data from your backend/Clerk/Neon) ---
const userData = {
  email: "student@example.com", // Replace with actual user email
  totalQuizzes: 45,
  maxScore: 98,
  totalScore: 3500, // Sum of all quiz scores
};

// const scoreHistoryData = [ // Example quiz score history
//   { name: 'Q1', score: 75 },
//   { name: 'Q2', score: 82 },
//   { name: 'Q3', score: 70 },
//   { name: 'Q4', score: 90 },
//   { name: 'Q5', score: 88 },
//   { name: 'Q6', score: 95 },
//   { name: 'Q7', score: 80 },
//   { name: 'Q8', score: 92 },
//   { name: 'Q9', score: 85 },
//   { name: 'Q10', score: 98 },
// ];

const categoryPerformanceData = [ // Example average scores per quiz category
  { name: 'Math', avgScore: 85 },
  { name: 'Science', avgScore: 78 },
  { name: 'History', avgScore: 92 },
  { name: 'English', avgScore: 88 },
  { name: 'Coding', avgScore: 70 },
];
// --- End Mock Data ---


export default function ProfilePage() {
  const params = useParams();
  const username = params.username;
  const [isLoading, setIsLoading] = useState(false);
  const [submittedQuiz,setSubmittedQuiz] = useState([]);
  const [email, setEmail] = useState(null);
  const [totalScore,setTotalScore] = useState(0);
  const [maxScore,setMaxScore] = useState(0);
  const [performanceData, setPerformanceData] = useState([])
  const [scoreHistoryData, setScoreHistoryData] = useState([])
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
    const performanceList = [];
    const historyList = [];
  
    for (let i = 0; i < submittedQuiz.length; i++) {
      score += submittedQuiz[i]?.quizScore;
      if (submittedQuiz[i]?.quizScore > maxi) {
        maxi = submittedQuiz[i]?.quizScore;
      }
  
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
    setMaxScore(maxi);
  }, [submittedQuiz]);
  
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-700 to-green-800 text-gray-100 font-sans p-4 flex items-center justify-center relative">
      <Head>
        <title>User Profile - Quizo</title>
        <meta name="description" content="View your quiz performance and statistics." />
      </Head>
      <div className='absolute top-5 left-4 bg-white rounded-full'>
        <Link href={'/dashboard'}> <ArrowLeft className='size-8 text-green-500'/></Link>
      </div>
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl p-6  text-gray-900 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* User Info & Stats Section */}
        <div className="lg:col-span-1 bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg p-6 shadow-lg flex flex-col items-center justify-start text-center space-y-4">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-emerald-300 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
            {/* Static User Icon - Placeholder Image */}
            {/* Using a placeholder.co image, replace with your actual user image or a default avatar */}
            <UserIcon className="text-green-700 w-12 h-12" />
          </div>
          <h2 className='text-base '>{username}</h2>
          <h2 className="text-3xl font-bold text-emerald-800 break-words max-w-full font-mono">{email}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            <div className="bg-emerald-500 text-white rounded-lg p-4 shadow-md flex flex-col items-center">
              <span className="text-xl md:text-2xl font-bold">{submittedQuiz.length===0?'--':submittedQuiz.length}</span>
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
          </div>
        </div>

        {/* Graphs Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Score History Line Chart */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-emerald-800 mb-4 text-center">Quiz Score History(%)</h3>
            <div className="h-64 sm:h-80"> {/* Fixed height for chart container */}
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreHistoryData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" tick={{ fill: '#4a5568' }} />
                  <YAxis tick={{ fill: '#4a5568' }} domain={[0, 100]} /> {/* Score from 0 to 100 */}
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                    labelStyle={{ color: '#2d3748', fontWeight: 'bold' }}
                    itemStyle={{ color: '#4a5568' }}
                  />
                  {/* Legend to show what the line represents */}
                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
                  <Line
                    type="monotone" // Smooth line
                    dataKey="score" // Key from your data to plot
                    stroke="#059669" // Emerald green color
                    strokeWidth={3}
                    dot={{ stroke: '#059669', strokeWidth: 2, r: 4 }} // Styling for individual data points
                    activeDot={{ r: 6 }} // Larger dot on hover
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Performance Bar Chart */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-emerald-800 mb-4 text-center">Recent Quiz</h3>
            <div className=""> {/* Fixed height for chart container */}
            <div className="p-4">
                <div className="overflow-x-auto bg-white shadow-md rounded-md border">
                    <table className="min-w-full table-auto text-sm">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="text-left p-3">Quiz</th>
                                <th className="text-left p-3">Quiz Title</th>
                                <th className="text-left p-3">Questions</th>
                                <th className="text-left p-3">Score</th>
                                <th className="text-left p-3">Rank</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submittedQuiz&&submittedQuiz.map((quiz, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50 transition-all relative">
                                    <td className="p-3">{ICONS[quiz?.quizIcon]?.icon}</td>
                                    <td className="p-3">{quiz?.quizTitle}</td>
                                    <td className="p-3">{quiz?.quizTotalQuestions}</td>
                                    <td className="p-3">{quiz?.quizScore}</td>
                                    <td className="p-3 relative">
                                          { quiz?.rank}
                                    </td>
                                </tr>
                            ))}
                            {submittedQuiz.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-6 text-gray-400">
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
      </div>
    </div>
  );
}