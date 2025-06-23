'use client'
import React, { useEffect, useState } from 'react'
import Header from './_component/Header'
import QuizArea from './_component/QuizArea'
import Placeholder from './_component/Placeholder'
import useGlobalContextProvider from '@/app/_context/ContextApi';
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import Footer from './_component/Footer'
import Loader from '@/components/ui/shared/Loader'



function Dashboard() {
  const {email} = useGlobalContextProvider();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const token = localStorage.getItem('token');
  //     //console.log("saved token",token);
      
  //     if (!token) {
  //       router.push('/sign-in');
  //       return;
  //     }

  //     try {
  //       const decoded = jwtDecode(token);
  //       //console.log("decode",decoded);
        
  //       setEmail(decoded.email);
  //     } catch (err) {
  //       //localStorage.removeItem('token');
  //       router.push('/sign-in');
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // }, []);
  const { allQuiz, quizToStartObject,isLoading,setIsLoading } = useGlobalContextProvider();
  const { selectQuizToStart, setSelectQuizToStart } = quizToStartObject;

  useEffect(() => {
    setIsLoading(false)
    setSelectQuizToStart(null)
  }, []);


  // useEffect(() => {
  //   route.refresh();
  // }, [allQuiz])

  return (
    <>
    {
      isLoading? (
        <div className="w-full h-screen flex items-center justify-center bg-white shadow-md rounded-xl">
          <Loader /> {/* or just: "Loading..." */}
        </div>
      ): (
        <div className='h-screen w-full'>
          <Header email={email}/>
    
          <div className='pb-20'>
            <QuizArea />
          </div>
          <Footer/>
        </div>

      )
    }
    </>
  )
}

export default Dashboard