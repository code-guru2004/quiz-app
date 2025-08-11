'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import useGlobalContextProvider from '@/app/_context/ContextApi';

const PracticeProgressChart = () => {
  const { email, allQuiz } = useGlobalContextProvider();

  if (!email || !allQuiz || allQuiz.length === 0) return null;

  // Filter practice quizzes
  const practiceQuizzes = allQuiz.filter(
    (quiz) => quiz.quizType === 'Practice Quiz'
  );

  // Count how many are submitted
  const submittedCount = practiceQuizzes.filter((quiz) =>
    quiz.userSubmissions?.some((submission) => submission.email === email)
  ).length;

  const totalCount = practiceQuizzes.length;
  const remainingCount = totalCount - submittedCount;

  const chartData = [
    { name: 'Submitted', value: submittedCount },
    { name: 'Remaining', value: remainingCount },
  ];

  const COLORS = ['#10B981', '#374151']; // emerald-500 and slate-700

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PracticeProgressChart;
