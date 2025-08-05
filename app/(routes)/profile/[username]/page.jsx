'use client'

import useGlobalContextProvider from '@/app/_context/ContextApi';
import { ICONS } from '@/app/Icon';
import QuizStatsHeatmap from '@/components/shared/QuizStatsHeatmap';
import axios from 'axios';
import { ArrowLeft, CircleArrowLeft, Crown, Medal, Trophy, UserIcon, Award, Star, Zap, Lightning } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const BADGE_DATA = {
  BEGINNER: { icon: <Medal size={16} />, color: 'bg-gray-300', text: '🌱 Newbie' },
  INTERMEDIATE: { icon: <Star size={16} />, color: 'bg-blue-300', text: '📈 Rising Star' },
  ADVANCED: { icon: <Award size={16} />, color: 'bg-purple-300', text: '🏆 Quiz Master' },
  EXPERT: { icon: <Crown size={16} />, color: 'bg-yellow-300', text: '👑 Quiz Legend' },
  FAST: { icon: <Zap size={16} />, color: 'bg-orange-300', text: '⚡ Speed Demon' },
  ACCURATE: { icon: <Lightning size={16} />, color: 'bg-green-300', text: '🎯 Precision Pro' }
};
const COLORS = ['#0088FE', '#00C49F'];


export default function ProfilePage() {
  const params = useParams();
  const username = params.username;
  const [isLoading, setIsLoading] = useState(false);
  const [submittedQuiz, setSubmittedQuiz] = useState([]);
  const [email, setEmail] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [performanceData, setPerformanceData] = useState([]);
  const [scoreHistoryData, setScoreHistoryData] = useState([]);
  const [accuracy, setAccuracy] = useState(0);
  const [userLevel, setUserLevel] = useState('BEGINNER');
  const [streakDays, setStreakDays] = useState(0);
  const [categoryStats, setCategoryStats] = useState([]);
  const [timeStats, setTimeStats] = useState({ avgTime: 0, TotalTime: 0 });
  const [friends, setFriends] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [showAllQuizzes, setShowAllQuizzes] = useState(false);
  const [quizTypeData, setQuizTypeData] = useState([]);
  const [quizAvgScores, setQuizAvgScores] = useState([{ name: 'Live Quizzes', score: 0 },{ name: 'AI Quizzes', score: 0 }]);
  const [quizTimeData, setQuizTimeData] = useState([])

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const [userRes, statsRes] = await Promise.all([
        fetch(`/api/get-user?username=${username}`),
        fetch(`/api/user/get-stats?username=${username}`),

      ]);

      const userData = await userRes.json();
      const statsData = await statsRes.json();
      const friendsData = userData?.friendList
      console.log(statsData.data);


      const userInfo = userData?.userData;
      console.log(userInfo.friendList);

      setEmail(userInfo.email);
      setSubmittedQuiz(userInfo.submitQuiz);
      setStreakDays(statsData.streakDays || 0);
      setCategoryStats(statsData.categoryStats || []);
      setTimeStats({ avgTime: statsData.data?.avgTime, fastestQuiz: statsData.data?.totalTime } || { avgTime: 0, fastestQuiz: 0 });
      setFriends(userInfo.friendList || []);
      setAchievements(statsData.achievements || []);
      setQuizTypeData([
        { name: 'Live Quizzes', value: statsData.data?.NoOrdinayQuiz },
        { name: 'AI Quizzes', value: statsData.data?.NoAIQuizzes }
      ]);

      setQuizAvgScores([
        { name: 'Live Quizzes', score: statsData.data?.averageScoreNormalQuizScore },
        { name: 'AI Quizzes', score: statsData.data?.averageScoreAIQuizScore }
      ]);
      setQuizTimeData([...statsData.data?.quizTitleAndTime])
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  useEffect(() => {

  }, [])

  useEffect(() => {
    let score = 0;
    let maxi = -99;
    let totalQuestions = 0;
    let correctAnswers = 0;
    const performanceList = [];
    const historyList = [];
    const categoryMap = {};

    for (let i = 0; i < submittedQuiz.length; i++) {
      score += submittedQuiz[i]?.quizScore;
      totalQuestions += submittedQuiz[i]?.quizTotalQuestions;
      correctAnswers += submittedQuiz[i]?.quizScore;

      if (submittedQuiz[i]?.quizScore > maxi) {
        maxi = submittedQuiz[i]?.quizScore;
      }

      // Track category performance
      const category = submittedQuiz[i]?.quizCategory || 'General';
      if (!categoryMap[category]) {
        categoryMap[category] = { correct: 0, total: 0 };
      }
      categoryMap[category].correct += submittedQuiz[i]?.quizScore;
      categoryMap[category].total += submittedQuiz[i]?.quizTotalQuestions;

      const percentageScore = (submittedQuiz[i]?.quizScore * 100) / submittedQuiz[i]?.quizTotalQuestions;
      performanceList.push({
        name: submittedQuiz[i]?.quizTitle,
        avgScore: percentageScore,
        date: new Date(submittedQuiz[i]?.submittedAt).toLocaleDateString(),
        category: submittedQuiz[i]?.quizCategory || 'General'
      });

      historyList.push({
        name: `Quiz ${i + 1}`,
        score: percentageScore,
        date: new Date(submittedQuiz[i]?.submittedAt).toLocaleDateString()
      });
    }

    // Convert category map to array for radar chart
    const categoryStats = Object.keys(categoryMap).map(category => ({
      subject: category,
      A: (categoryMap[category].correct / categoryMap[category].total) * 100,
      fullMark: 100
    }));

    setCategoryStats(categoryStats);
    setPerformanceData(performanceList);
    setScoreHistoryData(historyList);
    setTotalScore(score);
    setMaxScore(maxi === -99 ? 0 : maxi);

    const acc = totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(2) : 0;
    setAccuracy(acc);

    // Determine user level based on performance
    if (submittedQuiz.length >= 20 && acc > 85) {
      setUserLevel('EXPERT');
    } else if (submittedQuiz.length >= 10 && acc > 75) {
      setUserLevel('ADVANCED');
    } else if (submittedQuiz.length >= 5) {
      setUserLevel('INTERMEDIATE');
    } else {
      setUserLevel('BEGINNER');
    }
  }, [submittedQuiz]);

  const getBadges = () => {
    const badges = [];

    // Level badge
    badges.push(BADGE_DATA[userLevel].text);

    // Achievement badges
    if (submittedQuiz.length === 0) badges.push("🚀 First Quiz Awaits");
    if (submittedQuiz.length >= 10) badges.push("🧠 Quiz Whiz");
    if (submittedQuiz.length >= 20) badges.push("🦾 Pro Player");
    if (maxScore >= 90) badges.push("🏆 Perfect Score");
    if (accuracy > 80) badges.push("🎯 Accuracy Master");
    if (streakDays >= 7) badges.push("🔥 7-Day Streak");
    if (streakDays >= 30) badges.push("⏳ 30-Day Legend");
    if (timeStats.fastestQuiz > 0) badges.push("⚡ Speedster");

    // Add unlocked achievements
    achievements.forEach(achievement => {
      badges.push(achievement);
    });

    return badges.slice(0, 6); // Limit to 6 badges
  };

  const getRecentQuizzes = () => {
    return showAllQuizzes ? submittedQuiz : submittedQuiz.slice(0, 5);
  };

  const getCategoryPerformance = () => {
    return categoryStats.map(cat => ({
      subject: cat.subject,
      performance: cat.A
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-700 to-green-800 text-gray-100 font-sans px-2 md:px-4 py-6 flex items-center justify-center">
      <Head>
        <title>{username}'s Profile - Quizo</title>
        <meta name="description" content={`View ${username}'s quiz performance and statistics.`} />
      </Head>

      <Link href="/dashboard" className="absolute top-4 left-4 bg-white rounded-full shadow hover:scale-105 transition-transform">
        <CircleArrowLeft className="text-green-500 w-8 h-8 md:w-10 md:h-10" />
      </Link>

      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="w-full max-w-7xl bg-white rounded-2xl shadow-2xl p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 text-gray-900">
          {/* LEFT PANEL - Profile & Stats */}
          <div className="bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl p-6 flex flex-col items-center text-center space-y-4 shadow-lg">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-emerald-300 border-4 border-white flex items-center justify-center shadow">
                <UserIcon className="text-green-700 w-10 h-10 md:w-12 md:h-12" />
              </div>
              {streakDays > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md">
                  {streakDays}
                </div>
              )}
            </div>

            <div className="flex flex-col items-center">
              <h1 className="text-xl md:text-2xl font-bold text-emerald-800 break-words">{username}</h1>
              <p className="text-sm text-gray-600 break-all">{email}</p>

              <div className="mt-2 flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${BADGE_DATA[userLevel].color}`}>
                  {BADGE_DATA[userLevel].text}
                </span>
                <span className="text-xs text-gray-500">Level {userLevel}</span>
              </div>
            </div>

            <div className="w-full bg-white rounded-lg p-3 shadow-inner">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-green-500"
                  style={{ width: `${Math.min(100, (submittedQuiz.length / 20) * 100)}%` }}
                ></div>
              </div>
              <p className="text-xs mt-1 text-gray-600">
                {submittedQuiz.length} quizzes completed ({Math.round((submittedQuiz.length / 20) * 100)}% to next level)
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {getBadges().map((badge, idx) => (
                <span key={idx} className="text-xs md:text-sm bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                  {badge}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 w-full mt-2">
              <div className="bg-emerald-500 text-white rounded-lg p-3 shadow-md flex flex-col items-center">
                <span className="text-xl md:text-2xl font-bold">{submittedQuiz.length}</span>
                <span className="text-xs md:text-sm opacity-90">Quizzes</span>
              </div>
              <div className="bg-lime-500 text-white rounded-lg p-3 shadow-md flex flex-col items-center">
                <span className="text-xl md:text-2xl font-bold">{maxScore}</span>
                <span className="text-xs md:text-sm opacity-90">Max Score</span>
              </div>
              <div className="bg-teal-500 text-white rounded-lg p-3 shadow-md flex flex-col items-center">
                <span className="text-xl md:text-2xl font-bold">{totalScore}</span>
                <span className="text-xs md:text-sm opacity-90">Total Score</span>
              </div>
              <div className="bg-blue-400 text-white rounded-lg p-3 shadow-md flex flex-col items-center">
                <span className="text-xl md:text-2xl font-bold">{accuracy}%</span>
                <span className="text-xs md:text-sm opacity-90">Accuracy</span>
              </div>
              <div className="bg-purple-400 text-white rounded-lg p-3 shadow-md flex flex-col items-center">
                <span className="text-xl md:text-2xl font-bold">{timeStats.avgTime}s</span>
                <span className="text-xs md:text-sm opacity-90">Avg Time</span>
              </div>
              <div className="bg-orange-400 text-white rounded-lg p-3 shadow-md flex flex-col items-center">
                <span className="text-xl md:text-2xl font-bold">{streakDays}</span>
                <span className="text-xs md:text-sm opacity-90">Day Streak</span>
              </div>
            </div>

            {/* Friends List */}
            {friends.length > 0 && (
              <div className="w-full mt-4">
                <h3 className="text-sm font-semibold text-emerald-800 mb-2">Quiz Friends👪</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {friends.slice(0, 5).map((friend, idx) => (
                    <div key={idx} className="flex items-center bg-white rounded-full px-3 py-1 shadow-sm">
                      <div className="w-6 h-6 rounded-full bg-emerald-200 mr-2 flex items-center justify-center">
                        <UserIcon className="text-emerald-700 w-3 h-3" />
                      </div>
                      <span className="text-xs text-gray-700">{friend?.email}</span>
                    </div>
                  ))}
                  {friends.length > 5 && (
                    <div className="text-xs text-gray-500">+{friends.length - 5} more</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT PANEL - Charts and Tables */}
          <div className="lg:col-span-2 flex flex-col space-y-6">
            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Score History Chart */}
              <div className="bg-gray-50 p-4 md:p-6 rounded-xl shadow-md">
                <h3 className="text-lg md:text-xl font-semibold text-emerald-800 mb-3">Score History</h3>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={scoreHistoryData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#4a5568' }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#4a5568' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          border: 'none'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#059669"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6, stroke: '#065f46' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Performance Radar */}
              <div className="bg-gray-50 p-4 md:p-6 rounded-xl shadow-md">
                <h3 className="text-lg md:text-xl font-semibold text-emerald-800 mb-3">Category Mastery</h3>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getCategoryPerformance()}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Performance"
                        dataKey="performance"
                        stroke="#059669"
                        fill="#10b981"
                        fillOpacity={0.6}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          border: 'none'
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Heatmap and Time Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <QuizStatsHeatmap username={username} />
                <div className="bg-gray-50 p-4 md:p-6 rounded-xl shadow-md">
                  <h3 className="text-lg md:text-xl font-semibold text-emerald-800 mb-3">Quiz Types Breakdown</h3>
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="h-64 w-full md:w-1/2">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={quizTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => (
                              <text
                                x={0}
                                y={0}
                                fill="white"
                                textAnchor="middle"
                                dominantBaseline="central"
                                style={{
                                  fontSize: '10px', // Smaller font size
                                  fontWeight: 'bold'
                                }}
                              >
                                {`${name}: ${(percent * 100).toFixed(0)}%`}
                              </text>
                            )}
                          >
                            {quizTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [`${value} quizzes`, 'Count']}
                            contentStyle={{
                              backgroundColor: 'white',
                              borderRadius: '0.5rem',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                              border: 'none',
                              fontSize: '12px' // Optional: make tooltip text smaller too
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-full md:w-1/2 pl-0 md:pl-6">
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full bg-[#0088FE] mr-2"></div>
                          <span className="text-xs">Live Quizzes: {quizTypeData[0]?.value || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full bg-[#00C49F] mr-2"></div>
                          <span className="text-xs">AI Quizzes: {quizTypeData[1]?.value || 0}</span>
                        </div>
                        <div className="pt-4">
                          <h4 className="text-xs font-semibold text-emerald-700 mb-2">Performance Comparison</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">Avg Score (Live):</span>
                              <span className="text-xs font-medium">
                                {quizAvgScores[0].score}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">Avg Score (AI):</span>
                              <span className="text-sm font-medium">
                                {quizAvgScores[1].score}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 md:p-6 rounded-xl shadow-md flex flex-col justify-center items-center pb-1 md:pb-0">
                <h3 className="text-lg md:text-xl font-semibold text-emerald-800 mb-3">Time Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Time per Quiz:</span>
                    <span className="font-medium">{timeStats.avgTime}s</span>
                  </div>
                  {/* <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Fastest Quiz Completion:</span>
                    <span className="font-medium">{timeStats.fastestQuiz}s</span>
                  </div> */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Time Spent:</span>
                    <span className="font-medium">
                      {timeStats.avgTime} minutes
                    </span>
                  </div>
                  <div className="pt-4">
                    <h4 className="text-sm font-semibold text-emerald-700 mb-2">Speed Trend</h4>
                    {
                      quizTimeData.length>0?(
                        <div className="h-32">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={quizTimeData }
                              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                              <XAxis
                                dataKey="title"
                                tick={{ fontSize: 12 }}
                                tickFormatter={(title) => title.length > 15 ? `${title.substring(0, 12)}...` : title}
                              />
                              <YAxis
                                label={{
                                  value: 'Time (seconds)',
                                  angle: -90,
                                  position: 'insideLeft',
                                  fontSize: 12
                                }}
                                tick={{ fontSize: 12 }}
                              />
                              <Tooltip
                                formatter={(value) => [`${value} seconds`, 'Completion Time']}
                                labelFormatter={(title) => `Quiz: ${title}`}
                                contentStyle={{
                                  backgroundColor: 'white',
                                  borderRadius: '0.5rem',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                  border: 'none',
                                  fontSize: '12px'
                                }}
                              />
                              <Line
                                type="monotone"
                                dataKey="time"
                                stroke="#10b981"
                                strokeWidth={2}
                                dot={{ r: 4, fill: '#059669' }}
                                activeDot={{ r: 6, stroke: '#065f46', strokeWidth: 2 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                          <p className="text-xs text-center text-gray-500 mt-0.5">Time taken to complete each quiz</p>
                        </div>
                      ):(
                        <div className='h-32 text-green-700'>
                          First attend the quiz
                        </div>
                      )
                    }
                  </div>
                </div>
              </div>
            </div>


            {/* Recent Quizzes Table */}
            <div className="bg-gray-50 p-4 md:p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg md:text-xl font-semibold text-emerald-800">Quiz History</h3>
                {submittedQuiz.length > 5 && (
                  <button
                    onClick={() => setShowAllQuizzes(!showAllQuizzes)}
                    className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full hover:bg-emerald-200 transition-colors"
                  >
                    {showAllQuizzes ? 'Show Less' : 'Show All'}
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left">Quiz</th>
                      <th className="p-3 text-left">Category</th>
                      <th className="p-3 text-center">Score</th>
                      <th className="p-3 text-center">Accuracy</th>
                      <th className="p-3 text-center">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getRecentQuizzes().length > 0 ? getRecentQuizzes().map((quiz, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="p-3 flex items-center">
                          <span className="mr-2">{ICONS[quiz?.quizIcon]?.icon}</span>
                          <span className="font-medium">{quiz?.quizTitle}</span>
                        </td>
                        <td className="p-3 text-gray-600">
                          <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded">
                            {quiz?.quizCategory || 'General'}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`font-medium ${(quiz.quizScore / quiz.quizTotalQuestions) >= 0.7 ? 'text-green-600' :
                            (quiz.quizScore / quiz.quizTotalQuestions) >= 0.5 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                            {quiz?.quizScore}/{quiz?.quizTotalQuestions}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          {((quiz.quizScore / quiz.quizTotalQuestions) * 100).toFixed(1)}%
                        </td>
                        <td className="p-3 text-center text-xs text-gray-500">
                          {new Date(quiz?.submittedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="text-center py-4 text-gray-400">
                          No quizzes found. Take your first quiz to see your stats!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}