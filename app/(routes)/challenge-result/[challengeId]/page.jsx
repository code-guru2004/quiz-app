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
  LineChart,
  Line,
  Legend,
  CartesianGrid,
} from 'recharts';


import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';
import axios from 'axios';
import ThemeToggle from '@/components/shared/ModeToggle';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-gray-700 dark:text-gray-300">Loading challenge results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 dark:bg-red-900">
        <p className="text-xl text-red-700 dark:text-red-300">Error: {error}</p>
      </div>
    );
  }

  if (!challengeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-gray-700 dark:text-gray-300">No challenge data found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8 relative">
      <div className='absolute lg:right-10 top-2 lg:top-7'>
        <ThemeToggle/>
      </div>
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">Challenge Results</h1>
        {/* Overview */}
        <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-800 rounded-md border-2 border-blue-200 dark:border-blue-500 ">
          <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-4">Challenge Overview</h2>
          {[
            ['Challenge ID', challengeData.challengeId],
            ['From User', challengeData.fromUser],
            ['To User', challengeData.toUser],
            ['Status', challengeData.status],
            ['Questions', challengeData.questions.length],
            ['Created At', formatDate(challengeData.createdAt)],
            ['Accepted At', formatDate(challengeData.acceptedAt)],
          ].map(([label, value], idx) => (
            value && (
              <p key={idx} className="text-lg text-gray-700 dark:text-gray-200 mb-2">
                <strong>{label}:</strong>{' '}
                <span className={
                  (label === 'From User' || label === 'To User') && value === username
                    ? 'font-bold text-indigo-600 dark:text-indigo-400'
                    : label === 'Status'
                      ? value === 'completed'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-yellow-600 dark:text-yellow-300'
                      : ''
                }>
                  {value}
                </span>
              </p>
            )
          ))}
        </div>

        {/* Responses */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Participant Responses</h2>
          {challengeData.responses.length === 0 ? (
            <p className="text-lg text-gray-600 dark:text-gray-300">No responses submitted yet.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {challengeData.responses.map((res, i) => (
                <div key={i} className={`p-5 border rounded-lg shadow-md ${
                  res.user === username
                    ? 'bg-indigo-50 border-indigo-300 dark:bg-indigo-950 dark:border-indigo-600'
                    : 'bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-500'
                }`}>
                  <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                    {res.user === username ? `Your Result (${res.user})` : res.user}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-200"><strong>Score:</strong> {res.score}</p>
                  <p className="text-gray-700 dark:text-gray-200"><strong>Time Taken:</strong> {res.timeTaken} seconds</p>
                  <p className="text-gray-700 dark:text-gray-200"><strong>Submitted At:</strong> {formatDate(res.submittedAt)}</p>
                  <p className="text-gray-700 dark:text-gray-200"><strong>Answers Selected:</strong> {res.selectedAnswers.length}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Charts */}
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
          {scoreData.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-center mb-4 text-gray-800 dark:text-white">Scores</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={scoreData}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Bar dataKey="score" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {timeTakenData.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-center mb-4 text-gray-800 dark:text-white">Time Taken (seconds)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={timeTakenData}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Bar dataKey="time" fill="#facc15" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {questionChartData.length > 0 && (
            <div className="bg-white dark:bg-gray-800 py-6 px-10 rounded-lg shadow-md col-span-1 lg:col-span-2">
              <h3 className="text-xl font-semibold text-center mb-4 text-gray-800 dark:text-white">Question-wise Correctness</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={questionChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="color1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="color2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="question" />
                  <YAxis domain={[0, 1]} tickFormatter={(val) => val === 1 ? 'Correct' : 'Incorrect'} className='text-xs text-white'/>
                  <Tooltip formatter={(value) => value === 1 ? 'Correct' : 'Incorrect'} />
                  <Legend />
                  {Object.keys(questionChartData[0] || {}).filter(k => k !== 'question').map((key, i) => (
                    <Area
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={i === 0 ? "#4f46e5" : "#10b981"}
                      fill={`url(#color${i + 1})`}
                      fillOpacity={1}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition focus:outline-none"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChallengeResultPage;