'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';
import axios from 'axios';
import ThemeToggle from '@/components/shared/ModeToggle';
import { Trophy, Clock, BarChart2, CheckCircle, XCircle, ChevronLeft } from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();
};

const ChallengeResultPage = () => {
  const params = useParams();
  const { challengeId } = params;
  const router = useRouter();
  const [challengeData, setChallengeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(null);
  const [scoreData, setScoreData] = useState([]);
  const [timeTakenData, setTimeTakenData] = useState([]);
  const [questionChartData, setQuestionChartData] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const publicRoutes = ['/sign-in', '/sign-up'];

        if (!token) {
          if (!publicRoutes.includes(window.location.pathname)) {
            router.push('/sign-in');
          }
          return;
        }

        try {
          const decoded = jwtDecode(token);
          setUsername(decoded.username);
        } catch (err) {
          console.error('Error decoding token:', err);
          localStorage.removeItem('token');
          router.push('/sign-in');
        }
      }
    };
    fetchUser();
  }, [router]);

  useEffect(() => {
    if (!challengeId) return;

    const fetchChallengeResult = async () => {
      try {
        const res = await fetch(`/api/challenge/get-challenge/${challengeId}`);
        const data = await res.json();

        if (data.success) {
          setChallengeData(data.challenge);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChallengeResult();
  }, [challengeId]);

  useEffect(() => {
    if (challengeData && username) {
      const score = [];
      const time = [];

      challengeData.responses.forEach((response) => {
        const userLabel = response.user === username ? `You (${response.user})` : response.user;
        score.push({ name: userLabel, score: response.score });
        time.push({ name: userLabel, time: response.timeTaken });
      });

      setScoreData(score);
      setTimeTakenData(time);

      const data = challengeData.questions.map((question, index) => {
        const qId = question.id;
        let p1 = 0, p2 = 0;

        const r1 = challengeData.responses[0];
        const r2 = challengeData.responses[1];

        if (r1) {
          const ans = r1.selectedAnswers.find((a) => a.questionId === qId);
          if (ans?.selectedOption === question.correctAnswer) p1 = 1;
        }

        if (r2) {
          const ans = r2.selectedAnswers.find((a) => a.questionId === qId);
          if (ans?.selectedOption === question.correctAnswer) p2 = 1;
        }

        return {
          question: `Q${index + 1}`,
          [r1 ? r1.user : 'Participant1']: p1,
          [r2 ? r2.user : 'Participant2']: p2,
          correctAnswer: question.correctAnswer,
        };
      });

      setQuestionChartData(data);
    }
  }, [challengeData, username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg text-gray-700 dark:text-gray-300">Loading challenge results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Error Loading Results</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!challengeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No Challenge Data</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">We couldn't find any data for this challenge.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8 relative">
      <div className='absolute right-4 top-4 lg:right-8 lg:top-8'>
        <ThemeToggle/>
      </div>
      
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Challenge Results</h1>
                <p className="text-blue-100 dark:text-blue-200">Detailed performance analysis</p>
              </div>
              <div className="mt-4 md:mt-0 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-sm font-medium">Challenge ID: <span className="font-mono">{challengeData.challengeId}</span></p>
              </div>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-800">
                  <Trophy className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Winner</p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    {challengeData.responses.length > 0 ? 
                      challengeData.responses.reduce((prev, current) => 
                        (prev.score > current.score) ? prev : current
                      ).user === username ? "You" : challengeData.responses[0].user
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-800">
                  <BarChart2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Highest Score</p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    {challengeData.responses.length > 0 ? 
                      Math.max(...challengeData.responses.map(r => r.score)) : 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-800">
                  <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fastest Time</p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    {challengeData.responses.length > 0 ? 
                      Math.min(...challengeData.responses.map(r => r.timeTaken)) : 0}s
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-100 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-800">
                  <CheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Questions</p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    {challengeData.questions.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-8">
            {/* Participants Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                <span className="w-1 h-6 bg-blue-600 rounded-full mr-3"></span>
                Participants Performance
              </h2>
              
              {challengeData.responses.length === 0 ? (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No responses submitted yet.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {challengeData.responses.map((res, i) => (
                    <div key={i} className={`p-5 rounded-xl border transition-all ${
                      res.user === username
                        ? 'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/20 shadow-[0_4px_12px_rgba(99,102,241,0.1)]'
                        : 'border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-700/20'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className={`text-lg font-semibold ${
                          res.user === username 
                            ? 'text-blue-700 dark:text-blue-400' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {res.user === username ? `Your Performance` : res.user}
                        </h3>
                        {res.user === username && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            You
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Score</p>
                          <p className="text-2xl font-bold text-gray-800 dark:text-white">{res.score}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Time Taken</p>
                          <p className="text-2xl font-bold text-gray-800 dark:text-white">{res.timeTaken}s</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Submitted At</p>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {formatDate(res.submittedAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Charts Section */}
            <div className="space-y-8">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                <span className="w-1 h-6 bg-blue-600 rounded-full mr-3"></span>
                Performance Analytics
              </h2>
              
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Score Chart */}
                {scoreData.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-800 dark:text-white">Score Comparison</h3>
                      <Trophy className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={scoreData}>
                          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fill: '#6b7280' }}
                            tickLine={false}
                          />
                          <YAxis 
                            tick={{ fill: '#6b7280' }}
                            tickLine={false}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'white',
                              borderColor: '#e5e7eb',
                              borderRadius: '0.5rem',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            }}
                          />
                          <Bar 
                            dataKey="score" 
                            radius={[4, 4, 0, 0]}
                            className="fill-blue-500"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Time Taken Chart */}
                {timeTakenData.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-800 dark:text-white">Time Taken Comparison</h3>
                      <Clock className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={timeTakenData}>
                          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fill: '#6b7280' }}
                            tickLine={false}
                          />
                          <YAxis 
                            tick={{ fill: '#6b7280' }}
                            tickLine={false}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'white',
                              borderColor: '#e5e7eb',
                              borderRadius: '0.5rem',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            }}
                          />
                          <Bar 
                            dataKey="time" 
                            radius={[4, 4, 0, 0]}
                            className="fill-purple-500"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>

              {/* Question-wise Chart */}
              {questionChartData.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-800 dark:text-white">Question-wise Accuracy</h3>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={questionChartData}>
                        <defs>
                          <linearGradient id="colorUser1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorUser2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                        <XAxis 
                          dataKey="question" 
                          tick={{ fill: '#6b7280' }}
                          tickLine={false}
                        />
                       <YAxis
  domain={[0, 1]}
  tickLine={false}
  tickFormatter={(val) => (val === 1 ? 'Correct' : 'Incorrect')}
  tick={{ fill: '#6b7280', fontSize: 10 }} // smaller font size here
/>

                        <Tooltip 
                          formatter={(value) => value === 1 ? 'Correct' : 'Incorrect'}
                          contentStyle={{
                            backgroundColor: 'white',
                            borderColor: '#e5e7eb',
                            borderRadius: '0.5rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          }}
                        />
                        <Legend />
                        {Object.keys(questionChartData[0] || {}).filter(k => k !== 'question').map((key, i) => (
                          <Area
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={i === 0 ? "#6366f1" : "#10b981"}
                            fillOpacity={1}
                            fill={`url(#colorUser${i + 1})`}
                          />
                        ))}
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeResultPage;