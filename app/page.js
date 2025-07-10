'use client'
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Lottie from 'lottie-react';
import { ArrowRight, BookOpen, Brain, Users, Zap, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const QuizHomePage = () => {
  const swiperLinks = [
    {
      name: "Latest Live Quiz",
      url: "/dashboard/live-quizzes",
      description: "Join real-time quizzes and compete with others instantly.",
    },
    {
      name: "Practice Quiz",
      url: "/dashboard/practice-quizzes",
      description: "Practice at your own pace across various topics and levels.",
    },
    {
      name: "Challenge Friends",
      url: "/dashboard/1vs1-quiz",
      description: "Invite friends to a one-on-one quiz battle and track results.",
    },
    {
      name: "Top Study Materials",
      url: "/dashboard/preparation",
      description: "Access curated notes, guides, and preparation resources.",
    },
    {
      name: "Instant Quiz by AI",
      url: "/dashboard/ai-quiz",
      description: "Generate personalized quizzes instantly using AI.",
    },
  ];

  const [animationHero, setAnimationHero] = useState(null);
  const [animationLiveQuiz, setAnimationLiveQuiz] = useState(null);
  const [animationPracticeQuiz, setAnimationPracticeQuiz] = useState(null);
  const [animationAiQuiz, setAnimationAiQuiz] = useState(null);
  const [animationOneVsOne, setAnimationOneVsOne] = useState(null);
  const [animationResources, setAnimationResources] = useState(null);
  const [animationHowToUse, setAnimationHowToUse] = useState(null);
  const [animationChampion, setAnimationChampion] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const [
          resHero,
          resLiveQuiz,
          resPracticeQuiz,
          resAiQuiz,
          resOneVsOne,
          resResources,
          resHowToUse,
          resChampion,
        ] = await Promise.all([
          fetch("/assets/hero-sec.json"),
          fetch("/assets/live-quiz.json"),
          fetch("/assets/practice-quiz.json"),
          fetch("/assets/ai-quiz.json"),
          fetch("/assets/battle.json"),
          fetch("/assets/resources.json"),
          fetch("/assets/how-to-use.json"),
          fetch("/assets/Champion.json"),
        ]);
        const [
          dataHero,
          dataLiveQuiz,
          dataPracticeQuiz,
          dataAiQuiz,
          dataOneVsOne,
          dataResources,
          dataHowToUse,
          dataChampion,
        ] = await Promise.all([
          resHero.json(),
          resLiveQuiz.json(),
          resPracticeQuiz.json(),
          resAiQuiz.json(),
          resOneVsOne.json(),
          resResources.json(),
          resHowToUse.json(),
          resChampion.json(),
        ]);
        setAnimationHero(dataHero);
        setAnimationLiveQuiz(dataLiveQuiz);
        setAnimationPracticeQuiz(dataPracticeQuiz);
        setAnimationAiQuiz(dataAiQuiz);
        setAnimationOneVsOne(dataOneVsOne);
        setAnimationResources(dataResources);
        setAnimationHowToUse(dataHowToUse);
        setAnimationChampion(dataChampion);
      } catch (error) {
        console.error("Failed to load Lottie animations:", error);
      }
    };
    loadAnimation();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-emerald-50 font-sans text-gray-800 antialiased overflow-x-hidden">
      {/* Header - Already uses flexbox and responsive padding/spacing */}
      <header className="bg-gradient-to-r from-emerald-600 to-lime-700 text-white shadow-lg py-2 sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="block ml-4">
            <span className="sr-only">Home</span>
            <svg
              data-logo="logo"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 124 46"
              className="h-8 fill-black dark:fill-white"
            >
              <g id="logogram" transform="translate(0, 2.5)">
                <path
                  d="M20.9053 0.809967C9.85957 0.809967 0.905273 9.76427 0.905273 20.81C11.951 20.81 20.9053 11.8557 20.9053 0.809967Z"
                  fill="#45D2B0"
                />
                <path
                  d="M20.9053 40.81C31.951 40.81 40.9053 31.8557 40.9053 20.81C29.8596 20.81 20.9053 29.7643 20.9053 40.81Z"
                  fill="#45D2B0"
                />
                <path
                  d="M20.9053 0.809967C31.951 0.809967 40.9053 9.76427 40.9053 20.81C29.8596 20.81 20.9053 11.8557 20.9053 0.809967Z"
                  fill="#23216E"
                />
                <path
                  d="M20.9053 40.81C9.85957 40.81 0.905272 31.8557 0.905273 20.81C11.951 20.81 20.9053 29.7643 20.9053 40.81Z"
                  fill="#23216E"
                />
              </g>
              <g id="logotype" transform="translate(47, 1)">
                <path
                  fill="currentColor"
                  d="M21.00 40.87L21.00 43.26Q20.17 43.64 19.43 43.78Q18.70 43.91 17.88 43.91Q17.35 43.91 16.57 43.78Q15.79 43.66 15.05 43.20Q14.31 42.75 13.80 41.81Q13.30 40.87 13.30 39.23L13.30 38.09Q12.32 37.90 11.36 37.36Q10.39 36.82 9.59 35.75Q8.79 34.68 8.31 32.92Q7.83 31.15 7.83 28.50L7.83 18.16Q7.83 15.53 8.32 13.78Q8.80 12.02 9.60 10.97Q10.39 9.92 11.36 9.40Q12.32 8.88 13.30 8.72Q14.27 8.55 15.09 8.55Q15.88 8.55 16.84 8.71Q17.81 8.86 18.77 9.37Q19.72 9.87 20.52 10.91Q21.31 11.96 21.80 13.72Q22.29 15.48 22.29 18.16L22.29 28.50Q22.29 31.86 21.48 33.84Q20.68 35.81 19.47 36.76Q18.25 37.71 17.02 38.02L17.02 38.27Q17.02 39.93 17.80 40.41Q18.58 40.89 20.08 40.89Q20.32 40.89 20.56 40.89Q20.80 40.89 21.00 40.87ZM15.09 34.79Q16.41 34.79 17.04 33.80Q17.67 32.80 17.67 30.09L17.67 16.93Q17.67 14.13 17.04 13.07Q16.41 12.02 15.09 12.02Q13.74 12.02 13.10 13.07Q12.46 14.13 12.46 16.93L12.46 30.09Q12.46 32.80 13.10 33.80Q13.74 34.79 15.09 34.79ZM26.29 32.50L26.29 14.47L30.61 14.47L30.61 31.78Q30.61 33.33 31.09 33.94Q31.57 34.55 32.49 34.55Q33.86 34.55 34.86 33.16L34.86 14.47L39.19 14.47L39.19 38L35.89 38L35.46 35.49Q34.44 37.09 33.16 37.68Q31.89 38.27 30.59 38.27Q28.54 38.27 27.41 36.83Q26.29 35.39 26.29 32.50ZM45.73 11.20Q44.54 11.20 43.81 10.45Q43.08 9.70 43.08 8.33Q43.08 6.81 43.81 6.18Q44.54 5.55 45.75 5.55Q47.02 5.55 47.72 6.23Q48.43 6.91 48.43 8.33Q48.43 9.67 47.72 10.43Q47.00 11.20 45.73 11.20ZM43.60 38L43.60 14.47L47.92 14.47L47.92 38L43.60 38ZM50.37 38L50.37 35.85L56.88 17.75L50.71 17.75L50.71 14.47L61.51 14.47L61.51 16.62L54.98 34.72L61.63 34.72L61.63 38L50.37 38ZM70.00 38.26Q68.87 38.26 67.73 37.92Q66.58 37.59 65.62 36.56Q64.65 35.54 64.07 33.46Q63.49 31.39 63.49 27.90L63.49 24.21Q63.49 20.77 64.09 18.77Q64.69 16.76 65.66 15.77Q66.63 14.79 67.78 14.49Q68.92 14.19 70.02 14.19Q71.08 14.19 72.21 14.48Q73.33 14.76 74.29 15.72Q75.25 16.69 75.85 18.71Q76.44 20.74 76.44 24.21L76.44 27.90Q76.44 31.33 75.83 33.39Q75.21 35.45 74.24 36.50Q73.27 37.56 72.15 37.91Q71.03 38.26 70.00 38.26ZM70.04 35.04Q71.20 35.04 71.65 33.76Q72.10 32.48 72.10 29.18L72.10 23.32Q72.10 20.00 71.65 18.71Q71.20 17.41 70.04 17.41Q68.82 17.41 68.33 18.71Q67.83 20.00 67.83 23.32L67.83 29.18Q67.83 32.48 68.33 33.76Q68.82 35.04 70.04 35.04Z"
                />
              </g>
            </svg>
          </Link>
          <nav>
            {/* Navigation links - hidden on small screens, shown on medium and up */}
            <ul className="hidden md:flex space-x-5">
              <li>
                <a
                  href="#"
                  className="text-white hover:text-lime-200 font-semibold transition duration-300 relative group text-sm"
                >
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-lime-200 group-hover:w-full transition-all duration-300"></span>
                </a>
              </li>
              <li>
                <a
                  href="#feature"
                  className="text-white hover:text-lime-200 font-semibold transition duration-300 relative group text-sm"
                >
                  Features
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-lime-200 group-hover:w-full transition-all duration-300"></span>
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="text-white hover:text-lime-200 font-semibold transition duration-300 relative group text-sm"
                >
                  Testimonials
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-lime-200 group-hover:w-full transition-all duration-300"></span>
                </a>
              </li>
              <li>
                <a
                  href="#steps"
                  className="text-white hover:text-lime-200 font-semibold transition duration-300 relative group text-sm"
                >
                  How to use
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-lime-200 group-hover:w-full transition-all duration-300"></span>
                </a>
              </li>
            </ul>
            {/* You might want to add a mobile menu/hamburger icon here for smaller screens */}
            {/* For example: */}
            {/* <div className="md:hidden">
              <button className="text-white">
                <Menu size={24} /> // Assuming you import Menu icon from 'lucide-react'
              </button>
            </div> */}
          </nav>
        </div>
      </header>

      {/* Hero Section - Uses flex-col for mobile, flex-row for larger screens */}
      <section className="relative bg-gradient-to-br from-emerald-700 to-lime-800 text-white py-16 md:py-24 overflow-hidden rounded-b-[4rem] shadow-2xl" id='hero'>
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0 0V0h2v36h-2v-2ZM12 36h2V0h-2v36zm24 0h2v-2H36v2zm-24 0h2v-2H12v2zm24 4h2v-2H36v2zm-24 0h2v-2H12v2zm24 4h2v-2H36v2zm-24 0h2v-2H12v2zm24 4h2v-2H36v2zm-24 0h2v-2H12v2zm24 4h2v-2H36v2zm-24 0h2v-2H12v2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-center md:text-left relative z-10">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12 animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-5 drop-shadow-xl no-select">
              Elevate Your Mind, <br className="hidden md:inline" /> Conquer
              Every Quiz.
            </h1>
            <p className="text-base md:text-lg mb-8 opacity-95 leading-relaxed font-light no-select">
              Join a vibrant community of learners and challenge yourself with
              engaging quizzes across all subjects, designed to expand your
              knowledge.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-white text-emerald-700 hover:bg-emerald-100 px-7 py-3 rounded-full text-base font-bold shadow-2xl transform transition duration-500 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-70 flex items-center justify-center mx-auto md:mx-0 group relative overflow-hidden"
            >
              <span className="relative z-10">Go to Dashboard</span>
              <ArrowRight
                size={18}
                className="ml-2 group-hover:translate-x-2 transition-transform duration-300 relative z-10"
              />
              <span className="absolute inset-0 bg-gradient-to-r from-lime-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></span>
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center items-center animate-fade-in-right">
            {animationHero && (
              <Lottie
                animationData={animationHero}
                loop
                autoplay
                // Responsive sizing for Lottie animation
                className="w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] lg:w-[500px] lg:h-[500px] drop-shadow-2xl"
              />
            )}
          </div>
        </div>
      </section>

      {/* Swiper Section for Links - Already uses responsive breakpoints for slidesPerView */}
      <section className="py-16 bg-white/60 backdrop-blur-md rounded-3xl shadow-xl mx-5 md:mx-auto max-w-7xl -mt-16 relative z-20 border border-gray-100 transition-all duration-700 ease-out">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-center mb-10 text-gray-900 tracking-tight">
            Explore Diverse Quiz Categories
          </h2>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: { slidesPerView: 2 }, // 2 slides on screens >= 640px
              768: { slidesPerView: 3 }, // 3 slides on screens >= 768px
              1024: { slidesPerView: 4 }, // 4 slides on screens >= 1024px
            }}
            className="pb-12"
          >
            {swiperLinks.map((link, index) => (
              <SwiperSlide key={index}>
                <a
                  href={link.url}
                  className="group relative block p-6 rounded-2xl shadow-lg border border-transparent bg-white/80 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-lime-300 h-36 my-2"
                >
                  {/* Glow layer */}
                  <span className="absolute inset-0 bg-gradient-to-br from-emerald-300/20 to-lime-300/20 opacity-0 group-hover:opacity-100 transition duration-700 blur-xl rounded-2xl"></span>

                  {/* Neon border effect */}
                  <span className="absolute inset-0 z-0 rounded-2xl border-2 border-transparent group-hover:border-gradient-to-br group-hover:from-emerald-400 group-hover:to-lime-400 transition-all duration-500"></span>

                  <div className="relative z-10 flex flex-col justify-center items-center text-center">
                    <h3 className="text-lg font-semibold text-emerald-800 group-hover:text-lime-700 transition duration-300 mb-2">
                      {link.name}
                    </h3>
                    <p className="text-sm text-gray-600">{link.description}</p>
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Feature Sections - Uses responsive grid layout */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white no-select" id="feature">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-gray-900 leading-tight">
            Unleash Your Potential with Our Powerful Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
            {[
              {
                title: "Live Quiz",
                description:
                  "Dive into real-time quizzes with participants worldwide. Experience the adrenaline of live competition and instant results.",
                animation: animationLiveQuiz,
              },
              {
                title: "Practice Quiz",
                description:
                  "Refine your knowledge with endless practice sessions. Choose from diverse subjects and difficulty levels to master any topic.",
                animation: animationPracticeQuiz,
              },
              {
                title: "AI Quiz",
                description:
                  "Challenge our adaptive AI, designed to personalize your learning path and pinpoint areas for improvement.",
                animation: animationAiQuiz,
              },
              {
                title: "1v1 Challenge",
                description:
                  "Engage in thrilling head-to-head battles against friends or random opponents. Prove your dominance!",
                animation: animationOneVsOne,
              },
              {
                title: "Preparation Resources",
                description:
                  "Access a rich library of study materials, past papers, and expert strategies to ensure you ace every quiz.",
                animation: animationResources,
              },
              {
                title: "Achievements & Leaderboards",
                description:
                  "Track your progress, earn badges, and climb the global leaderboards to become the ultimate QuizMaster!",
                animation: animationChampion, // Changed to animationChampion
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg border border-gray-100 flex flex-col items-center text-center transition-transform duration-500 hover:scale-[1.03] hover:shadow-2xl"
              >
                {/* Background hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/30 to-lime-100/30 opacity-0 group-hover:opacity-100 transition duration-500 ease-out blur-sm scale-110 z-0" />

                {/* Optional shimmer layer */}
                <div className="absolute -top-1/2 left-0 w-full h-[200%] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-700 ease-in-out rotate-12 group-hover:animate-shimmer z-0" />

                {/* Foreground content */}
                <div className="relative z-10 flex flex-col items-center">
                  {feature.animation ? (
                    <Lottie
                      animationData={feature.animation}
                      loop
                      autoplay
                      className="w-32 h-32 md:w-40 md:h-40 mb-5 group-hover:-translate-y-1 transition-transform duration-500" // Responsive Lottie sizing
                    />
                  ) : feature.icon ? (
                    <div className="group-hover:-translate-y-1 transition-transform duration-500 mb-5">
                      {feature.icon}
                    </div>
                  ) : (
                    <Zap
                      size={48}
                      className="text-emerald-500 group-hover:text-lime-600 transition-colors duration-300 mb-5 group-hover:-translate-y-1"
                    />
                  )}
                  <h3 className="text-xl font-bold text-emerald-800 mb-3 group-hover:text-lime-800 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Attend Quiz Section - Uses flex-col for mobile, flex-row for larger screens, and responsive text sizes */}
      <section className="py-20 bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-12" id='steps'>
          {/* Lottie Animation */}
          <div className="md:w-1/2 flex justify-center items-center">
            {animationHowToUse && (
              <Lottie
                animationData={animationHowToUse}
                loop
                autoplay
                className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] lg:w-[400px] lg:h-[400px]" // Responsive Lottie sizing
              />
            )}
          </div>
          {/* Steps */}
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-gray-900 leading-tight">
              🚀 Your Journey to Knowledge Starts Here
            </h2>
            <ol className="space-y-6">
              {[
                {
                  title: "Effortless Account Creation",
                  desc: "Sign up in seconds to unlock a world of quizzes. It's completely free and designed for quick access.",
                },
                {
                  title: "Discover Your Perfect Challenge",
                  desc: "Browse our extensive library. Pick a category, difficulty, or challenge type that perfectly suits your learning goals.",
                },
                {
                  title: "Engage, Play & Compete",
                  desc: "Start answering questions, track your score in real-time, and see how you rank against others on dynamic leaderboards.",
                },
                {
                  title: "Analyze, Learn & Master",
                  desc: "Review detailed explanations for every question. Understand your mistakes and continuously improve your knowledge.",
                },
              ].map((step, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4 group bg-white/70 backdrop-blur-md border border-gray-200 shadow-md rounded-xl p-4 transition-all hover:shadow-lg no-select"
                >
                  <span className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg font-bold transition-transform group-hover:scale-110 group-hover:bg-lime-700 shadow-md">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-800 group-hover:text-lime-700 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-700 mt-1">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Testimonial Section - Uses responsive grid layout */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white" id='testimonial'>
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-gray-900 leading-tight">
            Hear From Our Thriving Community
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
            {[
              {
                name: "Alex Chen",
                role: "University Student",
                quote:
                  "QuizMaster has truly revolutionized my learning approach. The AI quizzes are incredibly precise in pinpointing areas I need to focus on. Highly intuitive and engaging!",
              },
              {
                name: "Sarah Miller",
                role: "Competitive Gamer",
                quote:
                  "The 1v1 challenges are an absolute blast! It's so addictive to compete with friends and see who's the true quiz champion. The platform is super smooth and responsive.",
              },
              {
                name: "Dr. David Lee",
                role: "High School Teacher",
                quote:
                  "As an educator, I constantly seek engaging tools. QuizMaster's rich resource section and varied quiz types make it an invaluable asset for both my students and my own professional development.",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col justify-between transform transition duration-500 hover:scale-[1.02] hover:shadow-xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-100 rounded-full -mt-10 -mr-10 opacity-50 group-hover:scale-125 transition-transform duration-500"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-lime-100 rounded-full -mb-10 -ml-10 opacity-50 group-hover:scale-125 transition-transform duration-500"></div>
                <p className="text-sm text-gray-700 italic mb-6 relative z-10">
                  <span className="text-emerald-400 text-4xl absolute -top-3 -left-2 font-serif opacity-70">
                    “
                  </span>
                  {testimonial.quote}
                  <span className="text-lime-400 text-4xl absolute -bottom-6 -right-2 font-serif opacity-70">
                    ”
                  </span>
                </p>
                <div className="text-right mt-auto z-10">
                  <p className="text-base font-bold text-emerald-800">
                    - {testimonial.name}
                  </p>
                  <p className="text-gray-600 text-xs">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Uses flex-col for mobile, flex-row for larger screens, and responsive text sizes */}
      <footer className="bg-gray-900 text-white py-10" id='footer'>
        <div className="container mx-auto px-6 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <Link href="/" className="block ml-4">
              <span className="sr-only">Home</span>
              <svg
                data-logo="logo"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 124 46"
                className="h-8 fill-black dark:fill-white"
              >
                <g id="logogram" transform="translate(0, 2.5)">
                  <path
                    d="M20.9053 0.809967C9.85957 0.809967 0.905273 9.76427 0.905273 20.81C11.951 20.81 20.9053 11.8557 20.9053 0.809967Z"
                    fill="#45D2B0"
                  />
                  <path
                    d="M20.9053 40.81C31.951 40.81 40.9053 31.8557 40.9053 20.81C29.8596 20.81 20.9053 29.7643 20.9053 40.81Z"
                    fill="#45D2B0"
                  />
                  <path
                    d="M20.9053 0.809967C31.951 0.809967 40.9053 9.76427 40.9053 20.81C29.8596 20.81 20.9053 11.8557 20.9053 0.809967Z"
                    fill="#23216E"
                  />
                  <path
                    d="M20.9053 40.81C9.85957 40.81 0.905272 31.8557 0.905273 20.81C11.951 20.81 20.9053 29.7643 20.9053 40.81Z"
                    fill="#23216E"
                  />
                </g>
                <g id="logotype" transform="translate(47, 1)">
                  <path
                    fill="currentColor"
                    d="M21.00 40.87L21.00 43.26Q20.17 43.64 19.43 43.78Q18.70 43.91 17.88 43.91Q17.35 43.91 16.57 43.78Q15.79 43.66 15.05 43.20Q14.31 42.75 13.80 41.81Q13.30 40.87 13.30 39.23L13.30 38.09Q12.32 37.90 11.36 37.36Q10.39 36.82 9.59 35.75Q8.79 34.68 8.31 32.92Q7.83 31.15 7.83 28.50L7.83 18.16Q7.83 15.53 8.32 13.78Q8.80 12.02 9.60 10.97Q10.39 9.92 11.36 9.40Q12.32 8.88 13.30 8.72Q14.27 8.55 15.09 8.55Q15.88 8.55 16.84 8.71Q17.81 8.86 18.77 9.37Q19.72 9.87 20.52 10.91Q21.31 11.96 21.80 13.72Q22.29 15.48 22.29 18.16L22.29 28.50Q22.29 31.86 21.48 33.84Q20.68 35.81 19.47 36.76Q18.25 37.71 17.02 38.02L17.02 38.27Q17.02 39.93 17.80 40.41Q18.58 40.89 20.08 40.89Q20.32 40.89 20.56 40.89Q20.80 40.89 21.00 40.87ZM15.09 34.79Q16.41 34.79 17.04 33.80Q17.67 32.80 17.67 30.09L17.67 16.93Q17.67 14.13 17.04 13.07Q16.41 12.02 15.09 12.02Q13.74 12.02 13.10 13.07Q12.46 14.13 12.46 16.93L12.46 30.09Q12.46 32.80 13.10 33.80Q13.74 34.79 15.09 34.79ZM26.29 32.50L26.29 14.47L30.61 14.47L30.61 31.78Q30.61 33.33 31.09 33.94Q31.57 34.55 32.49 34.55Q33.86 34.55 34.86 33.16L34.86 14.47L39.19 14.47L39.19 38L35.89 38L35.46 35.49Q34.44 37.09 33.16 37.68Q31.89 38.27 30.59 38.27Q28.54 38.27 27.41 36.83Q26.29 35.39 26.29 32.50ZM45.73 11.20Q44.54 11.20 43.81 10.45Q43.08 9.70 43.08 8.33Q43.08 6.81 43.81 6.18Q44.54 5.55 45.75 5.55Q47.02 5.55 47.72 6.23Q48.43 6.91 48.43 8.33Q48.43 9.67 47.72 10.43Q47.00 11.20 45.73 11.20ZM43.60 38L43.60 14.47L47.92 14.47L47.92 38L43.60 38ZM50.37 38L50.37 35.85L56.88 17.75L50.71 17.75L50.71 14.47L61.51 14.47L61.51 16.62L54.98 34.72L61.63 34.72L61.63 38L50.37 38ZM70.00 38.26Q68.87 38.26 67.73 37.92Q66.58 37.59 65.62 36.56Q64.65 35.54 64.07 33.46Q63.49 31.39 63.49 27.90L63.49 24.21Q63.49 20.77 64.09 18.77Q64.69 16.76 65.66 15.77Q66.63 14.79 67.78 14.49Q68.92 14.19 70.02 14.19Q71.08 14.19 72.21 14.48Q73.33 14.76 74.29 15.72Q75.25 16.69 75.85 18.71Q76.44 20.74 76.44 24.21L76.44 27.90Q76.44 31.33 75.83 33.39Q75.21 35.45 74.24 36.50Q73.27 37.56 72.15 37.91Q71.03 38.26 70.00 38.26ZM70.04 35.04Q71.20 35.04 71.65 33.76Q72.10 32.48 72.10 29.18L72.10 23.32Q72.10 20.00 71.65 18.71Q71.20 17.41 70.04 17.41Q68.82 17.41 68.33 18.71Q67.83 20.00 67.83 23.32L67.83 29.18Q67.83 32.48 68.33 33.76Q68.82 35.04 70.04 35.04Z"
                  />
                </g>
              </svg>
            </Link>
            <div className="flex flex-wrap justify-center space-x-3 md:space-x-6 text-sm">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition duration-300 relative group"
              >
                Privacy Policy
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition duration-300 relative group"
              >
                Terms of Service
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition duration-300 relative group"
              >
                Support
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition duration-300 relative group"
              >
                Careers
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>
          </div>
          <p className="text-gray-400 text-xs mt-6">
            &copy; {new Date().getFullYear()} QuizMaster. All rights reserved.
            Crafted with passion for knowledge.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default QuizHomePage;