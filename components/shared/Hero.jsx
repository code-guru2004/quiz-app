'use client'

import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaArrowRight, FaTrophy, FaUsers, FaClock, FaBrain } from 'react-icons/fa'

export default function Hero() {
    const [animationData, setAnimationData] = useState(null)
    const stats = [
        { value: '50,000+', label: 'Active Users', icon: <FaUsers className="text-blue-500" /> },
        { value: '1M+', label: 'Quizzes Taken', icon: <FaTrophy className="text-yellow-500" /> },
        { value: '24/7', label: 'Live Quizzes', icon: <FaClock className="text-green-500" /> },
        { value: 'AI', label: 'Powered', icon: <FaBrain className="text-purple-500" /> },
    ]

    useEffect(() => {
        const loadAnimation = async () => {
          const res = await fetch('/assets/quiz-hero-animate.json');
          const data = await res.json();
          setAnimationData(data);
        };
    
        loadAnimation();
      }, []);

    return (
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col  items-center">
                    <div className='flex flex-col md:flex-row items-center justify-between'>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="md:w-1/2 mb-12 md:mb-0 px-5 lg:px-2"
                        >
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                                Test Your Knowledge with <span className="text-blue-600">QuizMaster Pro</span>
                            </h1>
                            <p className="text-lg text-gray-600 mb-8 w-full ">
                                The ultimate platform for live quizzes, practice tests, and competitive challenges.
                                Join thousands of users improving their knowledge daily.
                            </p>
                            
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className=""
                        >
                            <div className="">
                                
                                    <Lottie animationData={animationData} loop autoplay className="w-96 h-96" />
                                    
                            </div>
                        </motion.div>

                    </div>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <Link
                                href="/dashboard"
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                            >
                                Get Started <FaArrowRight className="ml-2" />
                            </Link>
                            <Link
                                href="#features"
                                className="px-6 py-3 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition-colors border border-gray-200 flex items-center justify-center"
                            >
                                Learn More
                            </Link>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-3"
                        >
                            <div className="text-2xl">{stat.icon}</div>
                            <div>
                                <div className="font-bold text-gray-900 text-xl">{stat.value}</div>
                                <div className="text-gray-500 text-sm">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}