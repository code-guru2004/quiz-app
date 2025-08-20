'use client'

import { motion } from 'framer-motion'
import {
    FaLightbulb,
    FaUserFriends,
    FaCalendarAlt,
    FaRobot,
    FaTrophy,
    FaBookOpen,
} from 'react-icons/fa'

export default function Features() {
    const features = [
        {
            icon: <FaLightbulb className="text-blue-500 text-3xl" />,
            title: 'Live Quiz',
            description: 'Join real-time quizzes with players worldwide and test your knowledge under pressure.',
        },
        {
            icon: <FaBookOpen className="text-green-500 text-3xl" />,
            title: 'Practice Mode',
            description: 'Improve at your own pace with thousands of practice questions across various categories.',
        },
        {
            icon: <FaCalendarAlt className="text-purple-500 text-3xl" />,
            title: 'Scheduled Contests',
            description: 'Daily, weekly, and monthly contests with leaderboards and prizes for top performers.',
        },
        {
            icon: <FaUserFriends className="text-red-500 text-3xl" />,
            title: '1vs1 Challenge',
            description: 'Challenge friends or random opponents to head-to-head knowledge battles.',
        },
        {
            icon: <FaBookOpen className="text-yellow-500 text-3xl" />,
            title: 'Preparation Mode',
            description: 'Structured learning paths for exams, certifications, and academic subjects.',
        },
        {
            icon: <FaRobot className="text-indigo-500 text-3xl" />,
            title: 'AI Quiz Generator',
            description: 'Generate custom quizzes on any topic using our advanced AI technology.',
        },
    ]

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const item = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
        },
    }

    return (
        <section id="features" className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Powerful Features to Boost Your Learning
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        QuizMaster Pro offers everything you need to test your knowledge, compete with others,
                        and track your progress.
                    </p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            whileHover={{ y: -5 }}
                            className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:border-blue-200 transition-all"
                        >
                            <div className="mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white"
                >
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-2/3 mb-8 md:mb-0">
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">
                                Ready to Challenge Yourself?
                            </h3>
                            <p className="text-blue-100 mb-6">
                                Join thousands of users who are improving their knowledge daily with QuizMaster Pro.
                            </p>
                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center">
                                    Start Free Trial
                                </button>
                                <button className="px-6 py-3 bg-transparent border border-white text-white rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center">
                                    Learn More
                                </button>
                            </div>
                        </div>
                        <div className="md:w-1/3 flex justify-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="w-full max-w-xs"
                            >
                                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-1 rounded-xl shadow-lg border border-gray-200/50">
                                    <div className="bg-white p-5 rounded-lg backdrop-blur-sm">
                                        <div className="flex items-center justify-center space-x-3 mb-5">
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                className="bg-gradient-to-r from-yellow-400 to-yellow-500 w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                                            >
                                                <FaTrophy className="text-yellow-800 text-lg" />
                                            </motion.div>
                                            <h3 className="font-bold text-gray-800 text-lg">Leaderboard</h3>
                                        </div>

                                        <div className="space-y-3">
                                            {['Alex K.', 'Maria S.', 'Jamie R.', 'Tom B.', 'Priya M.'].map((name, i) => (
                                                <motion.div
                                                    key={i}
                                                    whileHover={{ x: 5 }}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm
                  ${i === 0 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                                                                i === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                                                                    i === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-700' :
                                                                        'bg-gradient-to-r from-blue-500 to-blue-600'}`}
                                                        >
                                                            {i + 1}
                                                        </div>
                                                        <span className="font-medium text-gray-700">{name}</span>
                                                    </div>
                                                    <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                        {1000 - i * 200} pts
                                                    </span>
                                                </motion.div>
                                            ))}
                                        </div>

                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="mt-6"
                                        >
                                            <button className="w-full py-2.5 rounded-lg font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all shadow-md">
                                                View Full Leaderboard
                                            </button>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}