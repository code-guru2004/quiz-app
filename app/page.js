'use client'
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ArrowRight, BookOpen, Brain, Users, Zap, Award, Clock, Trophy, BarChart2, Lightbulb, ShieldCheck, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const QuizHomePage = () => {
  const swiperLinks = [
    {
      name: "Latest Live Quiz",
      url: "/dashboard/live-quizzes",
      description: "Join real-time quizzes and compete with others instantly.",
      icon: <Clock className="w-8 h-8 text-teal-600" />
    },
    {
      name: "Practice Quiz",
      url: "/dashboard/practice-quizzes",
      description: "Practice at your own pace across various topics and levels.",
      icon: <BookOpen className="w-8 h-8 text-blue-600" />
    },
    {
      name: "Challenge Friends",
      url: "/dashboard/1vs1-quiz",
      description: "Invite friends to a one-on-one quiz battle and track results.",
      icon: <Users className="w-8 h-8 text-purple-600" />
    },
    {
      name: "Top Study Materials",
      url: "/dashboard/preparation",
      description: "Access curated notes, guides, and preparation resources.",
      icon: <Lightbulb className="w-8 h-8 text-yellow-600" />
    },
    {
      name: "Instant Quiz by AI",
      url: "/dashboard/ai-quiz",
      description: "Generate personalized quizzes instantly using AI.",
      icon: <Brain className="w-8 h-8 text-red-600" />
    },
  ];

  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white font-sans text-gray-800 antialiased overflow-x-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 to-cyan-700 text-white shadow-lg py-2 sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="block ml-4">
            <span className="sr-only">Home</span>
            <div className="flex items-center">
              <div className="relative w-8 h-8 mr-2">
                <div className="absolute inset-0 bg-cyan-400 rounded-full"></div>
                <div className="absolute inset-0 bg-teal-600 rounded-full transform rotate-45"></div>
              </div>
              <Image
                src="/logo-1.png"
                alt="Eduprobe"
                width={180}
                height={150}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAU..." // tiny base64 blur image
              />
            </div>
          </Link>
          <nav>
            <ul className="hidden md:flex space-x-5">
              <li>
                <a href="#" className="text-white hover:text-cyan-200 font-semibold transition duration-300 relative group text-sm">
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-200 group-hover:w-full transition-all duration-300"></span>
                </a>
              </li>
              <li>
                <a href="#feature" className="text-white hover:text-cyan-200 font-semibold transition duration-300 relative group text-sm">
                  Features
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-200 group-hover:w-full transition-all duration-300"></span>
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-white hover:text-cyan-200 font-semibold transition duration-300 relative group text-sm">
                  Testimonials
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-200 group-hover:w-full transition-all duration-300"></span>
                </a>
              </li>
              <li>
                <a href="#steps" className="text-white hover:text-cyan-200 font-semibold transition duration-300 relative group text-sm">
                  How to use
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-200 group-hover:w-full transition-all duration-300"></span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-700 to-cyan-800 text-white py-16 md:py-24 overflow-hidden rounded-b-[4rem] shadow-2xl" id='hero'>
        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0 0V0h2v36h-2v-2ZM12 36h2V0h-2v36zm24 0h2v-2H36v2zm-24 0h2v-2H12v2zm24 4h2v-2H36v2zm-24 0h2v-2H12v2zm24 4h2v-2H36v2zm-24 0h2v-2H12v2zm24 4h2v-2H36v2zm-24 0h2v-2H12v2zm24 4h2v-2H36v2zm-24 0h2v-2H12v2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        }}>
        </div>
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-center md:text-left relative z-10">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12 animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-5 drop-shadow-xl">
              Elevate Your Mind, <br className="hidden md:inline" /> Conquer Every Quiz.
            </h1>
            <p className="text-base md:text-lg mb-8 opacity-95 leading-relaxed font-light">
              Join a vibrant community of learners and challenge yourself with engaging quizzes across all subjects, designed to expand your knowledge.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-white text-teal-700 hover:bg-teal-100 px-7 py-3 rounded-full text-base font-bold shadow-2xl transform transition duration-500 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-70 flex items-center justify-center mx-auto md:mx-0 group relative overflow-hidden"
            >
              <span className="relative z-10">Go to Dashboard</span>
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-teal-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></span>
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center items-center animate-fade-in-right">
            <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] lg:w-[500px] lg:h-[500px]">
              <div className="absolute inset-0 bg-teal-500/10 rounded-full blur-xl animate-pulse"></div>
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <div className="w-full h-full   flex items-center justify-center ">
                  <div className="text-center p-8">
                    <Image
                      src="/quiz-hero.png"
                      alt="Eduprobe"
                      width={250}
                      height={250}
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAU..." // tiny base64 blur image
                    />
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Swiper Section */}
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
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="pb-12"
          >
            {swiperLinks.map((link, index) => (
              <SwiperSlide key={index}>
                <a
                  href={link.url}
                  className="group relative block p-6 rounded-2xl shadow-lg border border-transparent bg-white/80 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-cyan-300 h-36 my-2"
                >
                  <span className="absolute inset-0 bg-gradient-to-br from-teal-300/20 to-cyan-300/20 opacity-0 group-hover:opacity-100 transition duration-700 blur-xl rounded-2xl"></span>
                  <span className="absolute inset-0 z-0 rounded-2xl border-2 border-transparent group-hover:border-gradient-to-br group-hover:from-teal-400 group-hover:to-cyan-400 transition-all duration-500"></span>
                  <div className="relative z-10 flex flex-col justify-center items-center text-center">
                    <div className="mb-2">
                      {link.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-teal-800 group-hover:text-cyan-700 transition duration-300 mb-2">
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

      {/* Feature Sections */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white" id="feature">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-gray-900 leading-tight">
            Unleash Your Potential with Our Powerful Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
            {[
              {
                title: "Live Quiz",
                description: "Dive into real-time quizzes with participants worldwide. Experience the adrenaline of live competition and instant results.",
                icon: <div className="p-4 bg-teal-100 rounded-full"><Clock className="w-8 h-8 text-teal-600" /></div>
              },
              {
                title: "Practice Quiz",
                description: "Refine your knowledge with endless practice sessions. Choose from diverse subjects and difficulty levels to master any topic.",
                icon: <div className="p-4 bg-blue-100 rounded-full"><BookOpen className="w-8 h-8 text-blue-600" /></div>
              },
              {
                title: "AI Quiz",
                description: "Challenge our adaptive AI, designed to personalize your learning path and pinpoint areas for improvement.",
                icon: <div className="p-4 bg-red-100 rounded-full"><Brain className="w-8 h-8 text-red-600" /></div>
              },
              {
                title: "1v1 Challenge",
                description: "Engage in thrilling head-to-head battles against friends or random opponents. Prove your dominance!",
                icon: <div className="p-4 bg-purple-100 rounded-full"><Users className="w-8 h-8 text-purple-600" /></div>
              },
              {
                title: "Preparation Resources",
                description: "Access a rich library of study materials, past papers, and expert strategies to ensure you ace every quiz.",
                icon: <div className="p-4 bg-yellow-100 rounded-full"><Lightbulb className="w-8 h-8 text-yellow-600" /></div>
              },
              {
                title: "Achievements & Leaderboards",
                description: "Track your progress, earn badges, and climb the global leaderboards to become the ultimate QuizMaster!",
                icon: <div className="p-4 bg-orange-100 rounded-full"><Trophy className="w-8 h-8 text-orange-600" /></div>
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg border border-gray-100 flex flex-col items-center text-center transition-transform duration-500 hover:scale-[1.03] hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-100/30 to-cyan-100/30 opacity-0 group-hover:opacity-100 transition duration-500 ease-out blur-sm scale-110 z-0" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="mb-5 group-hover:-translate-y-1 transition-transform duration-500">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-teal-800 mb-3 group-hover:text-cyan-800 transition-colors duration-300">
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

      {/* How to Attend Quiz Section */}
      <section className="py-20 bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-12" id='steps'>
          <div className="md:w-1/2 flex justify-center items-center">
            <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] lg:w-[400px] lg:h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-400 to-cyan-400 rounded-3xl shadow-xl rotate-12"></div>
              <div className="relative z-10 bg-white p-6 rounded-2xl shadow-lg h-full flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-teal-100 p-2 rounded-lg">
                      <BarChart2 className="w-6 h-6 text-teal-600" />
                    </div>
                    <h3 className="font-semibold">Track Your Progress</h3>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <ShieldCheck className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold">Earn Badges</h3>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Globe className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold">Compete Globally</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                  className="flex items-start gap-4 group bg-white/70 backdrop-blur-md border border-gray-200 shadow-md rounded-xl p-4 transition-all hover:shadow-lg"
                >
                  <span className="flex-shrink-0 w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center text-lg font-bold transition-transform group-hover:scale-110 group-hover:bg-cyan-700 shadow-md">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-teal-800 group-hover:text-cyan-700 transition-colors">
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

      {/* Testimonial Section */}
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
                quote: "Eduprobe has truly revolutionized my learning approach. The AI quizzes are incredibly precise in pinpointing areas I need to focus on. Highly intuitive and engaging!",
                avatar: <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold">AC</div>
              },
              {
                name: "Sarah Miller",
                role: "Competitive Gamer",
                quote: "The 1v1 challenges are an absolute blast! It's so addictive to compete with friends and see who's the true quiz champion. The platform is super smooth and responsive.",
                avatar: <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">SM</div>
              },
              {
                name: "Dr. David Lee",
                role: "High School Teacher",
                quote: "As an educator, I constantly seek engaging tools. Eduprobe's rich resource section and varied quiz types make it an invaluable asset for both my students and my own professional development.",
                avatar: <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">DL</div>
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col justify-between transform transition duration-500 hover:scale-[1.02] hover:shadow-xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-teal-100 rounded-full -mt-10 -mr-10 opacity-50 group-hover:scale-125 transition-transform duration-500"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-cyan-100 rounded-full -mb-10 -ml-10 opacity-50 group-hover:scale-125 transition-transform duration-500"></div>
                <p className="text-sm text-gray-700 italic mb-6 relative z-10">
                  <span className="text-teal-400 text-4xl absolute -top-3 -left-2 font-serif opacity-70">“</span>
                  {testimonial.quote}
                  <span className="text-cyan-400 text-4xl absolute -bottom-6 -right-2 font-serif opacity-70">”</span>
                </p>
                <div className="flex items-center mt-auto z-10">
                  {testimonial.avatar}
                  <div className="ml-4 text-left">
                    <p className="text-base font-bold text-teal-800">- {testimonial.name}</p>
                    <p className="text-gray-600 text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-cyan-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Ready to Challenge Yourself?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of learners who are expanding their knowledge and having fun with QuizMaster.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-white text-teal-700 hover:bg-teal-100 px-8 py-4 rounded-full text-lg font-bold shadow-2xl transform transition duration-500 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-70 flex items-center justify-center mx-auto group relative overflow-hidden"
          >
            <span className="relative z-10">Get Started Now</span>
            <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-teal-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10" id='footer'>
        <div className="container mx-auto px-6 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <Link href="/" className="block ml-4">
              <div className="flex items-center">

                <Image
                  src="/logo-1.png"
                  alt="Eduprobe"
                  width={180}
                  height={150}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAU..." // tiny base64 blur image
                />
              </div>
            </Link>
            <div className="flex flex-wrap justify-center space-x-3 md:space-x-6 text-sm">
              <a href="/privacy-policy" className="text-gray-300 hover:text-white transition duration-300 relative group">
                Privacy Policy
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="/terms-of-service" className="text-gray-300 hover:text-white transition duration-300 relative group">
                Terms of Service
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition duration-300 relative group">
                Support
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="/contact" className="text-gray-300 hover:text-white transition duration-300 relative group">
                Careers
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>
          </div>
          <p className="text-gray-400 text-xs mt-6">
            &copy; {new Date().getFullYear()} Eduprobe. All rights reserved. Crafted with passion for knowledge.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default QuizHomePage;