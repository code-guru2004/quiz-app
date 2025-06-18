"use client"; // This component will be rendered on the client side

import Head from 'next/head';
import Link from 'next/link'; // For client-side navigation
import Image from 'next/image'; // For optimized images

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 to-green-600 text-white font-inter">

      {/* Header */}
      <header className="py-6 px-4 md:px-8 shadow-lg bg-opacity-20 backdrop-filter backdrop-blur-sm ">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            {/* Placeholder Logo - replace with your actual logo if available */}
            <div className="">
              <svg data-logo="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 124 46" className="h-8">
                <g id="logogram" transform="translate(0, 2.5)">
                  <path d="M20.9053 0.809967C9.85957 0.809967 0.905273 9.76427 0.905273 20.81C11.951 20.81 20.9053 11.8557 20.9053 0.809967Z" fill="#45D2B0" />
                  <path d="M20.9053 40.81C31.951 40.81 40.9053 31.8557 40.9053 20.81C29.8596 20.81 20.9053 29.7643 20.9053 40.81Z" fill="#45D2B0" />
                  <path d="M20.9053 0.809967C31.951 0.809967 40.9053 9.76427 40.9053 20.81C29.8596 20.81 20.9053 11.8557 20.9053 0.809967Z" fill="#23216E" />
                  <path d="M20.9053 40.81C9.85957 40.81 0.905272 31.8557 0.905273 20.81C11.951 20.81 20.9053 29.7643 20.9053 40.81Z" fill="#23216E" />
                </g>
                <g id="logotype" transform="translate(47, 1)">
                  <path fill="#FFFFFF" d="M21.00 40.87L21.00 43.26Q20.17 43.64 19.43 43.78Q18.70 43.91 17.88 43.91Q17.35 43.91 16.57 43.78Q15.79 43.66 15.05 43.20Q14.31 42.75 13.80 41.81Q13.30 40.87 13.30 39.23L13.30 38.09Q12.32 37.90 11.36 37.36Q10.39 36.82 9.59 35.75Q8.79 34.68 8.31 32.92Q7.83 31.15 7.83 28.50L7.83 18.16Q7.83 15.53 8.32 13.78Q8.80 12.02 9.60 10.97Q10.39 9.92 11.36 9.40Q12.32 8.88 13.30 8.72Q14.27 8.55 15.09 8.55Q15.88 8.55 16.84 8.71Q17.81 8.86 18.77 9.37Q19.72 9.87 20.52 10.91Q21.31 11.96 21.80 13.72Q22.29 15.48 22.29 18.16L22.29 28.50Q22.29 31.86 21.48 33.84Q20.68 35.81 19.47 36.76Q18.25 37.71 17.02 38.02L17.02 38.27Q17.02 39.93 17.80 40.41Q18.58 40.89 20.08 40.89Q20.32 40.89 20.56 40.89Q20.80 40.89 21.00 40.87ZM15.09 34.79Q16.41 34.79 17.04 33.80Q17.67 32.80 17.67 30.09L17.67 16.93Q17.67 14.13 17.04 13.07Q16.41 12.02 15.09 12.02Q13.74 12.02 13.10 13.07Q12.46 14.13 12.46 16.93L12.46 30.09Q12.46 32.80 13.10 33.80Q13.74 34.79 15.09 34.79ZM26.29 32.50L26.29 14.47L30.61 14.47L30.61 31.78Q30.61 33.33 31.09 33.94Q31.57 34.55 32.49 34.55Q33.86 34.55 34.86 33.16L34.86 14.47L39.19 14.47L39.19 38L35.89 38L35.46 35.49Q34.44 37.09 33.16 37.68Q31.89 38.27 30.59 38.27Q28.54 38.27 27.41 36.83Q26.29 35.39 26.29 32.50ZM45.73 11.20Q44.54 11.20 43.81 10.45Q43.08 9.70 43.08 8.33Q43.08 6.81 43.81 6.18Q44.54 5.55 45.75 5.55Q47.02 5.55 47.72 6.23Q48.43 6.91 48.43 8.33Q48.43 9.67 47.72 10.43Q47.00 11.20 45.73 11.20ZM43.60 38L43.60 14.47L47.92 14.47L47.92 38L43.60 38ZM50.37 38L50.37 35.85L56.88 17.75L50.71 17.75L50.71 14.47L61.51 14.47L61.51 16.62L54.98 34.72L61.63 34.72L61.63 38L50.37 38ZM70.00 38.26Q68.87 38.26 67.73 37.92Q66.58 37.59 65.62 36.56Q64.65 35.54 64.07 33.46Q63.49 31.39 63.49 27.90L63.49 24.21Q63.49 20.77 64.09 18.77Q64.69 16.76 65.66 15.77Q66.63 14.79 67.78 14.49Q68.92 14.19 70.02 14.19Q71.08 14.19 72.21 14.48Q73.33 14.76 74.29 15.72Q75.25 16.69 75.85 18.71Q76.44 20.74 76.44 24.21L76.44 27.90Q76.44 31.33 75.83 33.39Q75.21 35.45 74.24 36.50Q73.27 37.56 72.15 37.91Q71.03 38.26 70.00 38.26ZM70.04 35.04Q71.20 35.04 71.65 33.76Q72.10 32.48 72.10 29.18L72.10 23.32Q72.10 20.00 71.65 18.71Q71.20 17.41 70.04 17.41Q68.82 17.41 68.33 18.71Q67.83 20.00 67.83 23.32L67.83 29.18Q67.83 32.48 68.33 33.76Q68.82 35.04 70.04 35.04Z" />
                </g>
              </svg>

            </div>

          </Link>
          <nav className="hidden md:flex justify-center items-center space-x-6">
            <Link href="#features" className="hover:text-emerald-200 transition-colors duration-200">Features</Link>
            <Link href="#how-it-works" className="hover:text-emerald-200 transition-colors duration-200">How It Works</Link>
            <Link href="/auth/sign-in" className="px-4 py-2 bg-white text-emerald-600 rounded-full font-semibold hover:bg-emerald-100 transition-colors duration-200 shadow-md">
              Login
            </Link>
            <Link href="/auth/sign-up" className="px-4 py-2 bg-transparent border-2 border-white rounded-full font-semibold hover:bg-white hover:text-emerald-600 transition-colors duration-200 shadow-md">
              Sign Up
            </Link>
          </nav>
          {/* Mobile menu button removed */}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-[calc(100vh-80px)] px-4 md:px-8 text-center overflow-hidden">
        {/* Background blobs for visual interest */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lime-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>


        <div className="z-10 max-w-4xl space-y-8">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Test Your Knowledge,<br />Master Your Skills.
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            QuizMaster provides personalized assessments, tailored tests, and instant feedback to help you excel.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/dashboard" className="px-8 py-4 bg-white text-emerald-600 text-xl font-bold rounded-full shadow-lg hover:bg-emerald-100 transform hover:scale-105 transition-all duration-300">
              Start Quiz Now
            </Link>
            <Link href="/sign-up" className="px-8 py-4 bg-transparent border-2 border-white text-white text-xl font-bold rounded-full shadow-lg hover:bg-white hover:text-emerald-600 transform hover:scale-105 transition-all duration-300">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 md:px-8 bg-white text-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="text-emerald-600 text-4xl mb-4 text-center">💡</div>
              <h3 className="text-2xl font-bold mb-3 text-center">Tailored Tests</h3>
              <p className="text-center text-gray-600">
                Quizzes customized to your specific skills and knowledge gaps for efficient learning.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="text-teal-600 text-4xl mb-4 text-center">✅</div>
              <h3 className="text-2xl font-bold mb-3 text-center">Instant Feedback</h3>
              <p className="text-center text-gray-600">
                Receive immediate results and detailed explanations for every question.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="text-lime-600 text-4xl mb-4 text-center">📈</div>
              <h3 className="text-2xl font-bold mb-3 text-center">Progress Tracking</h3>
              <p className="text-center text-gray-600">
                Monitor your performance over time and see your skills improve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 md:px-8 bg-gray-100 text-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-emerald-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg">1</div>
              <h3 className="text-2xl font-bold mb-3">Choose Your Quiz</h3>
              <p className="text-gray-600">
                Select from a wide range of topics or get a personalized recommendation.
              </p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-lime-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg">2</div>
              <h3 className="text-2xl font-bold mb-3">Answer Questions</h3>
              <p className="text-gray-600">
                Engage with interactive questions designed to challenge your understanding.
              </p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-teal-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg">3</div>
              <h3 className="text-2xl font-bold mb-3">Get Results & Insights</h3>
              <p className="text-gray-600">
                View your score, detailed analysis, and areas for improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 md:px-8 text-center bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-extrabold mb-6">Ready to Boost Your Brainpower?</h2>
          <p className="text-xl opacity-90 mb-8">
            Join thousands of learners enhancing their knowledge with QuizMaster today!
          </p>
          <Link href="/auth/signup" className="px-10 py-4 bg-white text-emerald-600 text-2xl font-bold rounded-full shadow-lg hover:bg-emerald-100 transform hover:scale-105 transition-all duration-300">
            Sign Up for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 md:px-8 bg-emerald-900 text-emerald-300 text-center text-sm">
        <div className="max-w-7xl mx-auto">
          <p>&copy; {new Date().getFullYear()} Quizo. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <Link href="/privacy" className="hover:text-emerald-100 transition-colors duration-200">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-emerald-100 transition-colors duration-200">Terms of Service</Link>
          </div>
        </div>
      </footer>

      {/* Global styles for animation - add these to your global CSS file (e.g., globals.css) */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite cubic-bezier(0.6, 0.4, 0.4, 0.8);
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}