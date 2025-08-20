'use client'

import { motion } from 'framer-motion'
import { FaCheck, FaTimes } from 'react-icons/fa'

export default function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Perfect for trying out QuizMaster Pro',
      features: [
        '5 daily live quizzes',
        'Unlimited practice quizzes',
        'Basic categories',
        'Limited 1vs1 challenges',
        'Community leaderboard',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: '/month',
      description: 'For serious knowledge seekers',
      features: [
        'Unlimited live quizzes',
        'Unlimited practice quizzes',
        'All categories',
        'Unlimited 1vs1 challenges',
        'Premium leaderboard',
        'Scheduled contests',
        'AI quiz generator (10/month)',
      ],
      cta: 'Go Pro',
      popular: true,
    },
    {
      name: 'Premium',
      price: '$24.99',
      period: '/month',
      description: 'For competitive players and professionals',
      features: [
        'Everything in Pro',
        'Priority support',
        'Unlimited AI quizzes',
        'Custom quiz creation',
        'Advanced analytics',
        'Exam simulation mode',
        'Early access to features',
      ],
      cta: 'Get Premium',
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. Start for free, upgrade anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl border ${
                plan.popular
                  ? 'border-blue-500 shadow-xl transform md:-translate-y-4'
                  : 'border-gray-200 shadow-sm'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-500 text-sm ml-1">{plan.period}</span>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-lg font-medium ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  } transition-colors`}
                >
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 bg-gray-50 rounded-xl p-6 max-w-3xl mx-auto"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {[
              {
                question: 'Can I switch plans later?',
                answer: 'Yes, you can upgrade or downgrade your plan at any time.',
              },
              {
                question: 'Is there a free trial?',
                answer: 'The Starter plan is completely free forever. For Pro and Premium, we offer a 7-day free trial.',
              },
              {
                question: 'How does the AI quiz generator work?',
                answer: 'Our AI analyzes your performance and creates personalized quizzes to target your weak areas.',
              },
              {
                question: 'Can I cancel anytime?',
                answer: 'Absolutely. No long-term contracts, cancel anytime with one click.',
              },
            ].map((faq, i) => (
              <div key={i} className="border-b border-gray-200 pb-4">
                <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}