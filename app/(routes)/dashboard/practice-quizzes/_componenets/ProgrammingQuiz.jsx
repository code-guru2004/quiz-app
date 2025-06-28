'use client'
import useGlobalContextProvider from '@/app/_context/ContextApi';
import React, { useEffect, useState } from 'react'

function ProgrammingQuiz() {
  const { practiceQuiz, setPracticeQuiz } = useGlobalContextProvider();
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  useEffect(()=>{
    const filteredQuiz = practiceQuiz.filter((q)=>q.quizCategory==='Programming')
    setFilteredQuizzes(filteredQuiz)
  },[])
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredQuizzes.map((quiz) => (
        <QuizCard key={quiz._id} quiz={quiz} />
      ))}
    </div>
  )
}

export default ProgrammingQuiz