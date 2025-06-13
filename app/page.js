'use client'
import Image from "next/image";
import useGlobalContextProvider from "./_context/ContextApi";
import { useEffect } from "react";
import { ArrowRight } from 'lucide-react';

export default function Home() {
     const { allQuiz,quizToStartObject } = useGlobalContextProvider();
     const {selectQuizToStart,setSelectQuizToStart}=quizToStartObject;

     useEffect(()=>{
      setSelectQuizToStart(null)
     },[])
  return (
    <main className="min-h-screen bg-white text-gray-800 px-6 md:px-12 lg:px-24 py-16">
    {/* Hero Section */}
    <section className="text-center max-w-3xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
        Welcome to <span className="text-blue-600">QuizMaster</span>
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        A simple way to challenge yourself and learn faster with short, smart quizzes.
      </p>
      <a
        href="/dashboard"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition"
      >
        Start Quiz
      </a>
    </section>

    {/* Features */}
    <section className="mt-24 grid md:grid-cols-3 gap-8 text-center">
      {[
        { title: 'Instant Results', desc: 'Know your score and correct answers right away.' },
        { title: 'Track Progress', desc: 'Watch your improvement over time with stats.' },
        { title: 'No Signup Needed', desc: 'Jump in and start learning without an account.' },
      ].map((f, i) => (
        <div
          key={i}
          className="bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition"
        >
          <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
          <p className="text-gray-600 text-sm">{f.desc}</p>
        </div>
      ))}
    </section>

    {/* CTA */}
    <section className="mt-24 text-center">
      <h2 className="text-2xl font-semibold mb-4">Ready to Test Your Knowledge?</h2>
      <a
        href="/dashboard"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition"
      >
        Take a Quiz
      </a>
    </section>

    {/* Footer */}
    <footer className="mt-24 text-center text-sm text-gray-400">
      &copy; {new Date().getFullYear()} QuizMaster. All rights reserved.
    </footer>
  </main>
  );
}
