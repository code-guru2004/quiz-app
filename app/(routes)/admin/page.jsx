'use client'
import React from 'react'
import Navbar from './_components/Navbar'
import DashboardStats from './_components/Statsbar'
import QuizAdminDashboard from './_components/QuizAdminDashboard';

function Page() {
  const stats = {
    totalQuizzes: 23,
    liveQuizzes: 4,
    totalParticipants: 158,
  };
  return (
    <div>
      {/* <Navbar/> */}
      {/* <DashboardStats stats={stats} /> */}
      <QuizAdminDashboard/>
    </div>
  )
}

export default Page