'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaQuoteLeft } from 'react-icons/fa'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Medical Student',
      content:
        'QuizMaster Pro has been invaluable for my exam preparation. The 1vs1 challenges keep me motivated, and the AI-generated quizzes help me focus on my weak areas.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Software Engineer',
      content:
        'I love the live quizzes! The competition is fierce, and I\'ve learned so much from the diverse range of topics. The weekly programming contests are my favorite.',
      rating: 5,
    },
    {
      name: 'Priya Patel',
      role: 'High School Teacher',
      content:
        'My students are obsessed with QuizMaster. I use the scheduled contests as fun classroom activities, and the preparation mode helps them study for exams.',
      rating: 4,
    },
  ]

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our community has to say about QuizMaster Pro.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="mb-4 text-yellow-400">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <FaQuoteLeft className="text-gray-300 text-xl mb-4" />
              <p className="text-gray-600 mb-6">{testimonial.content}</p>
              <div className="flex items-center">
                <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 text-center"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Join our growing community of knowledge seekers
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Thousands of users from students to professionals are using QuizMaster Pro to test their
            knowledge and learn something new every day.
          </p>
          <Link href={'sign-up'} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Join Now - It's Free
          </Link>
        </motion.div>
      </div>
    </section>
  )
}