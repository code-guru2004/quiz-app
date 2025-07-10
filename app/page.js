'use client'
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Lottie from 'lottie-react';
import { ArrowRight, BookOpen, Brain, Users, Zap, Award } from 'lucide-react';

const QuizHomePage = () => {
  const swiperLinks = [
    { name: 'Latest Tech Quizzes', url: '#', description: 'Stay updated with the newest tech challenges.' },
    { name: 'History Quiz Archives', url: '#', description: 'Dive into historical events and figures.' },
    { name: 'Science Fact Challenges', url: '#', description: 'Test your knowledge on scientific phenomena.' },
    { name: 'General Knowledge Hub', url: '#', description: 'Explore a wide range of GK topics.' },
    { name: 'Math Problem Solvers', url: '#', description: 'Sharpen your mathematical skills.' },
  ];

  const [animationHero, setAnimationHero] = useState(null);
  const [animationLiveQuiz, setAnimationLiveQuiz] = useState(null);
  const [animationPracticeQuiz, setAnimationPracticeQuiz] = useState(null);
  const [animationAiQuiz, setAnimationAiQuiz] = useState(null);
  const [animationOneVsOne, setAnimationOneVsOne] = useState(null);
  const [animationResources, setAnimationResources] = useState(null);
  const [animationHowToUse, setAnimationHowToUse] = useState(null);
  const [animationChampion, setAnimationChampion] = useState(null);
  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const [
          resHero, resLiveQuiz, resPracticeQuiz, resAiQuiz, resOneVsOne, resResources, resHowToUse,resChampion
        ] = await Promise.all([
          fetch('/assets/hero-sec.json'), // Make sure these paths are correct relative to your public folder
          fetch('/assets/live-quiz.json'),
          fetch('/assets/practice-quiz.json'),
          fetch('/assets/ai-quiz.json'),
          fetch('/assets/battle.json'),
          fetch('/assets/resources.json'),
          fetch('/assets/how-to-use.json'),
          fetch('/assets/Champion.json'),
        ]);
        const [
          dataHero, dataLiveQuiz, dataPracticeQuiz, dataAiQuiz, dataOneVsOne, dataResources, dataHowToUse,dataChampion
        ] = await Promise.all([
          resHero.json(), resLiveQuiz.json(), resPracticeQuiz.json(), resAiQuiz.json(), resOneVsOne.json(), resResources.json(), resHowToUse.json(),resChampion.json()
        ]);
        setAnimationHero(dataHero);
        setAnimationLiveQuiz(dataLiveQuiz);
        setAnimationPracticeQuiz(dataPracticeQuiz);
        setAnimationAiQuiz(dataAiQuiz);
        setAnimationOneVsOne(dataOneVsOne);
        setAnimationResources(dataResources);
        setAnimationHowToUse(dataHowToUse);
        setAnimationChampion(dataChampion)
      } catch (error) {
        console.error("Failed to load Lottie animations:", error);
      }
    };
    loadAnimation();
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-emerald-50 font-sans text-gray-800 antialiased overflow-x-hidden">
      {/* Header */}
      <header className="bg-gradient-to-br from-emerald-700 to-lime-800 text-white backdrop-blur-md shadow-lg py-2 border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <a href="#" className="text-xl font-extrabold text-emerald-800 tracking-tight flex items-center gap-1.5">
            <Brain size={24} className="text-lime-600" /> QuizMaster
          </a>
          <nav>
            <ul className="flex space-x-5">
              <li><a href="#" className="text-gray-700 hover:text-emerald-600 font-semibold transition duration-300 relative group text-sm">Home<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300"></span></a></li>
              <li><a href="#" className="text-gray-700 hover:text-emerald-600 font-semibold transition duration-300 relative group text-sm">Features<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300"></span></a></li>
              <li><a href="#" className="text-gray-700 hover:text-emerald-600 font-semibold transition duration-300 relative group text-sm">Testimonials<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300"></span></a></li>
              <li><a href="#" className="text-gray-700 hover:text-emerald-600 font-semibold transition duration-300 relative group text-sm">Contact<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300"></span></a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-700 to-lime-800 text-white py-16 md:py-24 overflow-hidden rounded-b-[4rem] shadow-2xl">
        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0 0V0h2v36h-2v-2ZM12 36h2V0h-2v36zm24 0h2v-2H36v2zm-24 0h2v-2H12v2zm24 4h2v-2H36v2zm-24 0h2v-2H12v2zm24 4h2v-2H36v2zm-24 0h2v-2H12v2zm24 4h2v-2H36v2zm-24 0h2v-2H12v2zm24 4h2v-2H36v2zm-24 0h2v-2H12v2z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-center md:text-left relative z-10">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12 animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-5 drop-shadow-xl">
              Elevate Your Mind, <br className="hidden md:inline"/> Conquer Every Quiz.
            </h1>
            <p className="text-base md:text-lg mb-8 opacity-95 leading-relaxed font-light">
              Join a vibrant community of learners and challenge yourself with engaging quizzes across all subjects, designed to expand your knowledge.
            </p>
            <button className="bg-white text-emerald-700 hover:bg-emerald-100 px-7 py-3 rounded-full text-base font-bold shadow-2xl transform transition duration-500 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-70 flex items-center justify-center mx-auto md:mx-0 group relative overflow-hidden">
              <span className="relative z-10">Go to Dashboard</span>
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
              <span className="absolute inset-0 bg-gradient-to-r from-lime-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></span>
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center items-center animate-fade-in-right">
            {animationHero && (
              <Lottie animationData={animationHero} loop autoplay className="w-[350px] h-[350px] lg:w-[450px] lg:h-[450px] drop-shadow-2xl" />
            )}
          </div>
        </div>
      </section>

      {/* Swiper Section for Links */}
      <section className="py-12 bg-white rounded-3xl shadow-2xl mx-5 md:mx-auto max-w-7xl -mt-16 relative z-20 border border-gray-100 transform rotate-1 translate-y-2 scale-[0.98] md:scale-100 md:rotate-0 transition-all duration-700 ease-out origin-center">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">Explore Diverse Quiz Categories</h2>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={15}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 15,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
            }}
            className="pb-8"
          >
            {swiperLinks.map((link, index) => (
              <SwiperSlide key={index}>
                <a
                  href={link.url}
                  className="block p-5 bg-gradient-to-br from-emerald-50 to-lime-50 hover:from-emerald-100 hover:to-lime-100 rounded-lg shadow-md transition duration-500 transform hover:-translate-y-2 hover:shadow-lg text-center h-full flex flex-col justify-center items-center border border-emerald-100 group relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-lime-200 opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-sm"></span>
                  <h3 className="text-lg font-bold text-emerald-800 mb-1.5 group-hover:text-lime-800 transition-colors duration-300 relative z-10">{link.name}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed relative z-10">{link.description}</p>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Feature Sections */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-gray-900 leading-tight">
            Unleash Your Potential with Our Powerful Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
            {[
              { title: 'Live Quiz', description: 'Dive into real-time quizzes with participants worldwide. Experience the adrenaline of live competition and instant results.', animation: animationLiveQuiz },
              { title: 'Practice Quiz', description: 'Refine your knowledge with endless practice sessions. Choose from diverse subjects and difficulty levels to master any topic.', animation: animationPracticeQuiz },
              { title: 'AI Quiz', description: 'Challenge our adaptive AI, designed to personalize your learning path and pinpoint areas for improvement.', animation: animationAiQuiz },
              { title: '1v1 Challenge', description: 'Engage in thrilling head-to-head battles against friends or random opponents. Prove your dominance!', animation: animationOneVsOne },
              { title: 'Preparation Resources', description: 'Access a rich library of study materials, past papers, and expert strategies to ensure you ace every quiz.', animation: animationResources },
              {
                title: 'Achievements & Leaderboards',
                description: 'Track your progress, earn badges, and climb the global leaderboards to become the ultimate QuizMaster!',
                animation: animationChampion
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center border border-gray-100 transform transition duration-700 hover:scale-[1.02] hover:shadow-xl group relative overflow-hidden
                before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-br before:from-emerald-50 before:to-lime-50 before:opacity-0 before:scale-0 before:rounded-2xl before:group-hover:opacity-100 before:group-hover:scale-100 before:transition-all before:duration-500 before:ease-out
                "
              >
                <div className="relative z-10 flex flex-col items-center">
                  {feature.animation ? (
                    <Lottie animationData={feature.animation} loop autoplay className="w-40 h-40 mb-5" />
                  ) : feature.icon ? (
                    feature.icon
                  ) : (
                    <Zap size={48} className="text-emerald-500 group-hover:text-lime-600 transition-colors duration-300 mb-5" />
                  )}
                  <h3 className="text-xl font-bold text-emerald-800 mb-3 group-hover:text-lime-800 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Attend Quiz Section */}
      <section className="py-16 bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-12">
          <div className="md:w-1/2 flex justify-center items-center">
            {animationHowToUse && (
              <Lottie animationData={animationHowToUse} loop autoplay className="w-[320px] h-[320px] lg:w-[400px] lg:h-[400px]" />
            )}
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-900 leading-tight">
              Your Journey to Knowledge Starts Here
            </h2>
            <ol className="space-y-6 text-sm text-gray-700">
              <li className="flex items-start group">
                <span className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4 shadow-md transform transition duration-300 group-hover:scale-110 group-hover:bg-lime-700">1</span>
                <div>
                  <strong className="text-lg text-emerald-800 block mb-1 group-hover:text-lime-700 transition-colors duration-300">Effortless Account Creation:</strong>
                  <p className="text-gray-700">Sign up in seconds to unlock a world of quizzes. It's completely free and designed for quick access.</p>
                </div>
              </li>
              <li className="flex items-start group">
                <span className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4 shadow-md transform transition duration-300 group-hover:scale-110 group-hover:bg-lime-700">2</span>
                <div>
                  <strong className="text-lg text-emerald-800 block mb-1 group-hover:text-lime-700 transition-colors duration-300">Discover Your Perfect Challenge:</strong>
                  <p className="text-gray-700">Browse our extensive library. Pick a category, difficulty, or challenge type that perfectly suits your learning goals.</p>
                </div>
              </li>
              <li className="flex items-start group">
                <span className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4 shadow-md transform transition duration-300 group-hover:scale-110 group-hover:bg-lime-700">3</span>
                <div>
                  <strong className="text-lg text-emerald-800 block mb-1 group-hover:text-lime-700 transition-colors duration-300">Engage, Play & Compete:</strong>
                  <p className="text-gray-700">Start answering questions, track your score in real-time, and see how you rank against others on dynamic leaderboards.</p>
                </div>
              </li>
              <li className="flex items-start group">
                <span className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4 shadow-md transform transition duration-300 group-hover:scale-110 group-hover:bg-lime-700">4</span>
                <div>
                  <strong className="text-lg text-emerald-800 block mb-1 group-hover:text-lime-700 transition-colors duration-300">Analyze, Learn & Master:</strong>
                  <p className="text-gray-700">Review detailed explanations for every question. Understand your mistakes and continuously improve your knowledge to master any subject.</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-gray-900 leading-tight">
            Hear From Our Thriving Community
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
            {[
              {
                name: 'Alex Chen', role: 'University Student',
                quote: 'QuizMaster has truly revolutionized my learning approach. The AI quizzes are incredibly precise in pinpointing areas I need to focus on. Highly intuitive and engaging!'
              },
              {
                name: 'Sarah Miller', role: 'Competitive Gamer',
                quote: 'The 1v1 challenges are an absolute blast! It\'s so addictive to compete with friends and see who\'s the true quiz champion. The platform is super smooth and responsive.'
              },
              {
                name: 'Dr. David Lee', role: 'High School Teacher',
                quote: 'As an educator, I constantly seek engaging tools. QuizMaster\'s rich resource section and varied quiz types make it an invaluable asset for both my students and my own professional development.'
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col justify-between transform transition duration-500 hover:scale-[1.02] hover:shadow-xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-100 rounded-full -mt-10 -mr-10 opacity-50 group-hover:scale-125 transition-transform duration-500"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-lime-100 rounded-full -mb-10 -ml-10 opacity-50 group-hover:scale-125 transition-transform duration-500"></div>
                <p className="text-sm text-gray-700 italic mb-6 relative z-10">
                  <span className="text-emerald-400 text-4xl absolute -top-3 -left-2 font-serif opacity-70">“</span>
                  {testimonial.quote}
                  <span className="text-lime-400 text-4xl absolute -bottom-6 -right-2 font-serif opacity-70">”</span>
                </p>
                <div className="text-right mt-auto z-10">
                  <p className="text-base font-bold text-emerald-800">- {testimonial.name}</p>
                  <p className="text-gray-600 text-xs">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-6 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <a href="#" className="text-2xl font-extrabold text-emerald-400 tracking-tight mb-5 md:mb-0 flex items-center gap-2">
              <Brain size={28} className="text-lime-500" /> QuizMaster
            </a>
            <div className="flex flex-wrap justify-center space-x-3 md:space-x-6 text-sm">
              <a href="#" className="text-gray-300 hover:text-white transition duration-300 relative group">Privacy Policy<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span></a>
              <a href="#" className="text-gray-300 hover:text-white transition duration-300 relative group">Terms of Service<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span></a>
              <a href="#" className="text-gray-300 hover:text-white transition duration-300 relative group">Support<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span></a>
              <a href="#" className="text-gray-300 hover:text-white transition duration-300 relative group">Careers<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span></a>
            </div>
          </div>
          <p className="text-gray-400 text-xs mt-6">
            &copy; {new Date().getFullYear()} QuizMaster. All rights reserved. Crafted with passion for knowledge.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default QuizHomePage;