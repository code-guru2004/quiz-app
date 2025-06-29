'use client';

import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
  LineChart, Line, AreaChart, Area
} from 'recharts';

// Utility component for showing cards
const DashboardCard = ({ title, value, icon, isDarkMode }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 text-center border border-gray-200 dark:border-gray-700">
    <div className="text-3xl mb-2">{icon}</div>
    <div className="text-lg font-semibold text-gray-700 dark:text-gray-200">{title}</div>
    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{value}</div>
  </div>
);

// Tooltip formatter
const CustomTimeTooltip = ({ active, payload, isDarkMode }) => {
  if (active && payload?.length) {
    return (
      <div className={`p-2 rounded-md shadow-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <p><strong>{payload[0].payload.title}</strong></p>
        <p>Time: {payload[0].value} sec</p>
      </div>
    );
  }
  return null;
};

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [submittedQuiz, setSubmittedQuiz] = useState([]);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [userStats, setUserStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [times, setTimes] = useState([]);
  const [ranks, setRanks] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00C49F', '#FFBB28', '#FF8042'];

  const chartTextColor = isDarkMode ? '#c7c7c7' : '#292929';
  const chartGridStroke = isDarkMode ? '#4a5568' : '#e0e0e0';
  const tooltipBgColor = isDarkMode ? '#1f2937' : '#ffffff';
  const tooltipItemColor = isDarkMode ? '#e5e7eb' : '#333333';
  const primaryChartColor = isDarkMode ? '#8884d8' : '#6b48ff'; // Example primary color change
  const secondaryChartColor = isDarkMode ? '#059669' : '#00a876';
  const areaChartFillColor = isDarkMode ? '#34d399' : '#00c49f';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      setUsername(decoded.username);
      setEmail(decoded.email);
    } catch (err) {
      console.error('Invalid token');
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    const dark = savedTheme === 'dark' || (savedTheme == null && prefersDark);
    setIsDarkMode(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!username) return;
      try {
        const res = await fetch(`/api/get-user?username=${username}`);
        const data = await res.json();
        const userInfo = data?.userData;
        if (userInfo) {
          setSubmittedQuiz(userInfo.submitQuiz || []);
          setUserData(userInfo);
        }
      } catch (e) {
        setError('Failed to fetch user data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [username]);

  useEffect(() => {
    if (!email || submittedQuiz.length === 0) return;

    const quizzesSet = new Set();
    let totalScore = 0, highestScore = 0, totalQues = 0;
    const categoryScores = {};
    const modeScores = {};
    const timeList = [],
      rankList = [];

    submittedQuiz.forEach(sub => {
      quizzesSet.add(sub.quizId);
      totalScore += sub.quizScore;
      if (sub.quizScore > highestScore) {
        highestScore = sub.quizScore;
        totalQues = sub.quizTotalQuestions;
      }

      if (!categoryScores[sub.quizCategory]) categoryScores[sub.quizCategory] = { total: 0, count: 0 };
      categoryScores[sub.quizCategory].total += sub.quizScore;
      categoryScores[sub.quizCategory].count++;

      if (!modeScores[sub.quizMode]) modeScores[sub.quizMode] = { total: 0, count: 0 };
      modeScores[sub.quizMode].total += sub.quizScore;
      modeScores[sub.quizMode].count++;

      timeList.push({ title: sub.quizTitle, time: sub.time });
      rankList.push({ title: sub.quizTitle, rank: sub.rank });
    });

    setTimes(timeList);
    setRanks(rankList);

    const recentActivitiesSorted = [...submittedQuiz].sort(
      (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
    );

    const stats = {
      totalQuizzesAttempted: quizzesSet.size,
      averageScore: parseFloat((totalScore / submittedQuiz.length).toFixed(2)),
      highestScore: (highestScore / totalQues) * 100,
      recentActivities: recentActivitiesSorted,
      performanceByCategory: Object.keys(categoryScores).map(cat => ({
        name: cat,
        averageScore: ((categoryScores[cat].total / categoryScores[cat].count) * 100).toFixed(2),
      })),
      performanceByMode: Object.keys(modeScores).map(mode => ({
        name: mode,
        averageScore: ((modeScores[mode].total / modeScores[mode].count) * 100).toFixed(2),
      })),
    };
    setUserStats(stats);
  }, [submittedQuiz]);

  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (isLoading) return <div className="text-center p-4">Loading...</div>;

  if (!userStats) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold mb-2 mr-2">Welcome! <span className="relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-green-500">
          <span className="relative text-white dark:text-gray-950">{username || email}</span>
        </span></h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">No quiz activity found. Start a quiz to see your stats!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2 text-center" >My Quiz Dashboard</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-8">
        Welcome, <span className="relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-green-600 dark:before:bg-green-500">
          <span className="relative text-white dark:text-gray-950">{username || email}</span>
        </span>! Here's your performance overview.
      </p>

      <section className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <DashboardCard title="Quizzes Attempted" value={userStats.totalQuizzesAttempted} icon="✅" isDarkMode={isDarkMode} />
        <DashboardCard title="Your Avg. Score" value={userStats.averageScore} icon="📈" isDarkMode={isDarkMode} />
        <DashboardCard title="Highest (%)" value={userStats.highestScore.toFixed(2)} icon="🏆" isDarkMode={isDarkMode} />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BarChart: Category */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-300 mb-4">Performance by Category</h2>
          {userStats?.performanceByCategory?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={userStats.performanceByCategory}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
                <XAxis
                  dataKey="name"
                  angle={-15}
                  textAnchor="end"
                  height={60}
                  style={{ fill: '#6366F1' }}
                />
                <YAxis style={{ fill: '#6366F1' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: tooltipBgColor, border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: tooltipItemColor }}
                />
                <Bar dataKey="averageScore" fill={primaryChartColor} name="Avg. Score (%)" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">Attempt more quizzes to see your category performance.</p>
          )}
        </div>

        {/* PieChart: Mode */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-300 mb-4">Performance by Mode</h2>
          {userStats?.performanceByMode?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userStats.performanceByMode.map((entry) => ({
                    ...entry,
                    averageScore: Number(entry.averageScore),
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#82ca9d"
                  dataKey="averageScore"
                  nameKey="name"
                  label
                >
                  {userStats.performanceByMode.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: tooltipBgColor, border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: tooltipItemColor }}
                />
                <Legend wrapperStyle={{ color: chartTextColor }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">Attempt quizzes in different modes to see this breakdown.</p>
          )}
        </div>

        {/* LineChart: Time */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-300 mb-4">Time per Quiz</h2>
          {times.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={times}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
                <XAxis dataKey="title" tick={{ fill: '#10B981 ' }} />
                <YAxis tick={{ fill: '#10B981 ' }} />
                <Tooltip content={<CustomTimeTooltip isDarkMode={isDarkMode} />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="time"
                  stroke={secondaryChartColor}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No data for quiz time yet.</p>
          )}
        </div>

        {/* AreaChart: Rank */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-300 mb-4">Rank per Quiz</h2>
          {ranks.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={ranks} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRank" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={areaChartFillColor} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={areaChartFillColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="title" tick={{ fill: '#22C55E	' }} />
                <YAxis
                  tick={{ fill: '#22C55E	' }}
                  allowDecimals={false}
                  domain={['auto', 'auto']} // auto-adjust range
                />
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
                <Tooltip
                  contentStyle={{ backgroundColor: tooltipBgColor, border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: tooltipItemColor }}
                />
                <Area
                  type="monotone"
                  dataKey="rank"
                  stroke={secondaryChartColor}
                  fillOpacity={1}
                  fill="url(#colorRank)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No data for quiz rank yet.</p>
          )}
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 my-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-blue-600 dark:text-blue-300 mb-4">
          Recent Activities
        </h2>

        {userStats.recentActivities.length > 0 ? (
          <>
            {/* Mobile card layout */}
            <div className="flex flex-col gap-4 sm:hidden">
              {userStats.recentActivities.slice(0, 5).map((quiz, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg shadow-sm border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                >
                  <div className="font-semibold text-gray-800 dark:text-white">{quiz.quizTitle || 'Untitled'}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="block">Mode: {quiz.quizMode}</span>
                    <span className="block">Category: {quiz.quizCategory}</span>
                    <span className="block font-bold text-gray-900 dark:text-white">Score: {quiz.quizScore}</span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">
                      {new Date(quiz.submittedAt).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Table for larger screens */}
            <div className="hidden sm:block overflow-x-auto w-full">
              <table className="min-w-full text-left text-sm sm:text-base text-gray-700 dark:text-gray-300">
                <thead>
                  <tr className="text-blue-500 dark:text-blue-200 border-b border-gray-300 dark:border-gray-700">
                    <th className="py-2 px-4">Title</th>
                    <th className="py-2 px-4">Mode</th>
                    <th className="py-2 px-4">Category</th>
                    <th className="py-2 px-4">Score</th>
                    <th className="py-2 px-4">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {userStats.recentActivities.slice(0, 5).map((quiz, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/30"
                    >
                      <td className="py-2 px-4 break-words max-w-[180px]">{quiz.quizTitle || 'Untitled'}</td>
                      <td className="py-2 px-4">{quiz.quizMode}</td>
                      <td className="py-2 px-4">{quiz.quizCategory}</td>
                      <td className="py-2 px-4 font-bold text-gray-900 dark:text-white">{quiz.quizScore}</td>
                      <td className="py-2 px-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {new Date(quiz.submittedAt).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No recent activities to display.</p>
        )}
      </section>


    </div>
  );
};

export default UserDashboard;
