'use client'
import useGlobalContextProvider from '@/app/_context/ContextApi';
import axios from 'axios';
import { MoreVertical, NotebookPen, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useContext, createContext } from 'react';
import toast from 'react-hot-toast';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';




const calculateAverageScore = (submissions) => {
    if (!submissions || submissions.length === 0) return 0;
    const totalScore = submissions.reduce((sum, sub) => sum + sub.score, 0);
    return (totalScore / submissions.length).toFixed(2);
};


const calculateAverageCompletionTime = (submissions, totalQuestions) => {
    if (!submissions || submissions.length === 0 || totalQuestions === 0) return 0;

    const totalTimeAcrossAllSubmissions = submissions.reduce((sum, sub) => {
        const totalTimeForSubmission = sub.perQuestionTimes.reduce((qSum, time) => qSum + time, 0);
        return sum + totalTimeForSubmission;
    }, 0);

    return (totalTimeAcrossAllSubmissions / submissions.length).toFixed(2);
};

const Dashboard = () => {
    const route = useRouter();

    const { allQuiz, setAllQuiz, isLoading, email, username } = useGlobalContextProvider(); // Changed to named import for mock context

    const [dashboardStats, setDashboardStats] = useState({
        totalQuizzes: 0,
        totalSubmissions: 0,
        uniqueUsers: 0,
        averageOverallScore: 0,
        quizzesWithStats: [],
        quizCategoryDistribution: [],
        quizModeDistribution: [],
        topQuizzesByScore: [],
        topUsersByScore: [] // To be calculated
    });
    const [openMenuIndex, setOpenMenuIndex] = useState(null);

    const handleDelete = async (id) => {
        // console.log(id);
        try {
            const response = await axios.post("/api/delete-quiz", { id });
            const filtered = allQuiz.filter((q, i) => q._id !== id);
            setAllQuiz(filtered);
            toast.success(response?.data.message);
            setOpenMenuIndex(null);
            route.refresh();
          } catch (error) {
            // Use `error.response` instead of `response`
            toast.error("Failed to delete quiz");
          }
          
        // setOpenMenuIndex(null);
    };

    useEffect(() => {
        if (allQuiz && allQuiz.length > 0) {
            // Calculate total quizzes
            const totalQuizzes = allQuiz.length;

            let totalSubmissions = 0;
            const uniqueUsersSet = new Set();
            let totalScoresAcrossAllQuizzes = 0;
            let totalScoreCount = 0; // To accurately calculate overall average score
            const quizzesWithStats = allQuiz.map(quiz => {
                const submissionsCount = quiz.userSubmissions ? quiz.userSubmissions.length : 0;
                const avgScore = calculateAverageScore(quiz.userSubmissions);
                const avgCompletionTime = calculateAverageCompletionTime(quiz.userSubmissions, quiz.quizQuestions.length);

                totalSubmissions += submissionsCount;
                quiz?.userSubmissions?.forEach(submission => {
                    uniqueUsersSet.add(submission.email);
                    totalScoresAcrossAllQuizzes += submission.score;
                    totalScoreCount++;
                });

                return {
                    id: quiz._id,
                    title: quiz.quizTitle,
                    category: quiz.quizCategory,
                    mode: quiz.quizMode,
                    submissions: submissionsCount,
                    averageScore: parseFloat(avgScore),
                    averageCompletionTime: parseFloat(avgCompletionTime),
                    likes: quiz.quizLikes ? quiz.quizLikes.length : 0,
                    dislikes: quiz.quizDislikes ? quiz.quizDislikes.length : 0,
                    rawSubmissions: quiz.userSubmissions // Keep raw submissions for top user calculation
                };
            });

            const uniqueUsers = uniqueUsersSet.size;
            const averageOverallScore = totalScoreCount > 0 ? (totalScoresAcrossAllQuizzes / totalScoreCount).toFixed(2) : 0;

            // Category Distribution
            const categoryMap = {};
            quizzesWithStats?.forEach(quiz => {
                categoryMap[quiz.category] = (categoryMap[quiz.category] || 0) + 1;
            });
            const quizCategoryDistribution = Object.keys(categoryMap).map(category => ({
                name: category,
                value: categoryMap[category],
            }));

            // Mode Distribution
            const modeMap = {};
            quizzesWithStats.forEach(quiz => {
                modeMap[quiz.mode] = (modeMap[quiz.mode] || 0) + 1;
            });
            const quizModeDistribution = Object.keys(modeMap).map(mode => ({
                name: mode,
                value: modeMap[mode],
            }));

            // Top Quizzes by Average Score (only if submissions exist)
            const topQuizzesByScore = quizzesWithStats
                .filter(q => q.submissions > 0)
                .sort((a, b) => b.averageScore - a.averageScore)
                .slice(0, 5); // Top 5 quizzes

            // Top Users by Score (aggregate scores across all quizzes for each user)
            const userScores = {};
            allQuiz.forEach(quiz => {
                quiz?.userSubmissions?.forEach(submission => {
                    if (!userScores[submission.username]) {
                        userScores[submission.username] = { totalScore: 0, submissionCount: 0 };
                    }
                    userScores[submission.username].totalScore += submission.score;
                    userScores[submission.username].submissionCount++;
                });
            });

            const topUsersByScore = Object.keys(userScores)
                .map(username => ({
                    username,
                    averageScore: (userScores[username].totalScore / userScores[username].submissionCount).toFixed(2),
                }))
                .sort((a, b) => b.averageScore - a.averageScore)
                .slice(0, 5); // Top 5 users

            setDashboardStats({
                totalQuizzes,
                totalSubmissions,
                uniqueUsers,
                averageOverallScore: parseFloat(averageOverallScore),
                quizzesWithStats,
                quizCategoryDistribution,
                quizModeDistribution,
                topQuizzesByScore,
                topUsersByScore
            });
        }
    }, [allQuiz]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19A0']; // For pie charts

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
                <p className="text-xl">Loading dashboard data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 p-4 font-inter">
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-blue-400 mb-2">Quiz Dashboard</h1>
                <p className="text-lg text-gray-400">Insights into your quiz application's performance.</p>
                {email && username && (
                    <p className="text-md text-gray-500 mt-2">Logged in as: <span className="font-semibold text-white">{username}</span> ({email})</p>
                )}
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <DashboardCard title="Total Quizzes" value={dashboardStats.totalQuizzes} icon="📚" />
                <DashboardCard title="Total Submissions" value={dashboardStats.totalSubmissions} icon="📝" />
                <DashboardCard title="Unique Participants" value={dashboardStats.uniqueUsers} icon="👥" />
                <DashboardCard title="Overall Avg. Score" value={`${dashboardStats.averageOverallScore}%`} icon="🏆" />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                    <h2 className="text-2xl font-semibold text-blue-300 mb-4">Quiz Category Distribution</h2>
                    {dashboardStats.quizCategoryDistribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={dashboardStats.quizCategoryDistribution}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
                                >
                                    {dashboardStats.quizCategoryDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} itemStyle={{ color: '#e5e7eb' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-400">No category data available.</p>
                    )}
                </div>

                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                    <h2 className="text-2xl font-semibold text-blue-300 mb-4">Quiz Mode Distribution</h2>
                    {dashboardStats.quizModeDistribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={dashboardStats.quizModeDistribution}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#82ca9d"
                                    dataKey="value"
                                    label
                                >
                                    {dashboardStats.quizModeDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} itemStyle={{ color: '#e5e7eb' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-400">No mode data available.</p>
                    )}
                </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                    <h2 className="text-2xl font-semibold text-blue-300 mb-4">Top 5 Quizzes by Average Score</h2>
                    {dashboardStats.topQuizzesByScore.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={dashboardStats.topQuizzesByScore}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                                <XAxis dataKey="title" angle={-15} textAnchor="end" height={60} style={{ fill: '#e5e7eb' }} />
                                <YAxis style={{ fill: '#e5e7eb' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} itemStyle={{ color: '#e5e7eb' }} />
                                <Bar dataKey="averageScore" fill="#8884d8" name="Average Score (%)" radius={[5, 5, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-400">No quiz submission data to rank.</p>
                    )}
                </div>
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                    <h2 className="text-2xl font-semibold text-blue-300 mb-4">Top 5 Users by Average Score</h2>
                    {dashboardStats.topUsersByScore.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={dashboardStats.topUsersByScore}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                                <XAxis dataKey="username" angle={-15} textAnchor="end" height={60} style={{ fill: '#e5e7eb' }} />
                                <YAxis style={{ fill: '#e5e7eb' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} itemStyle={{ color: '#e5e7eb' }} />
                                <Bar dataKey="averageScore" fill="#82ca9d" name="Average Score (%)" radius={[5, 5, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-400">No user submission data to rank.</p>
                    )}
                </div>
            </section>

            <section className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-10">
                <h2 className="text-2xl font-semibold text-blue-300 mb-4">All Quizzes Overview</h2>
                {dashboardStats.quizzesWithStats.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700 rounded-lg overflow-hidden">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider rounded-tl-lg">
                                        Quiz Title
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Mode
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Submissions
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Avg. Score (%)
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Avg. Comp. Time (s)
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider rounded-tr-lg">
                                        Likes / Dislikes
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider rounded-tr-lg">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                                {allQuiz.length>0 && allQuiz.map((quiz, index) => (
                                    <tr key={index} className="hover:bg-gray-700 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-200">
                                            {quiz?.quizTitle}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {quiz?.quizCategory}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${quiz.mode === 'Live Quiz' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                                                {quiz?.quizMode}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {quiz.userSubmissions?.length}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {calculateAverageScore(quiz?.userSubmissions)}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {!quiz?.minimumTime ? 'N/A' : quiz?.minimumTime}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            <span className="text-green-500 mr-2">👍 {quiz?.quizLikes?.length}</span>
                                            <span className="text-red-500">👎 {quiz?.quizDislikes?.length}</span>
                                        </td>
                                        <td className="x-6 py-4 whitespace-nowrap text-sm text-gray-300 relative">
                                        <button
                                            onClick={() =>
                                                setOpenMenuIndex(index === openMenuIndex ? null : index)
                                            }
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>

                                        {openMenuIndex === index && (
                                            <div className="absolute top-0 z-10 right-14 bg-white border rounded shadow-md w-28">
                                                <button
                                                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                                    onClick={() => handleDelete(quiz._id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </button>
                                                <button
                                                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-green-600 hover:bg-green-100"
                                                    onClick={() => handleDelete(index)}
                                                >
                                                    <NotebookPen className="w-4 h-4" />
                                                    Modify
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-400">No quizzes found to display.</p>
                )}
            </section>

        </div>
    );
};

const DashboardCard = ({ title, value, icon }) => (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex items-center space-x-4">
        <div className="text-5xl">{icon}</div>
        <div>
            <h3 className="text-lg font-medium text-gray-400">{title}</h3>
            <p className="text-4xl font-bold text-white">{value}</p>
        </div>
    </div>
);


export default Dashboard;