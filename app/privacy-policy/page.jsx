// components/PrivacyPolicy.js
"use client"
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'data-collection', title: 'Data Collection' },
    { id: 'data-usage', title: 'Data Usage' },
    { id: 'data-protection', title: 'Data Protection' },
    { id: 'cookies', title: 'Cookies & Tracking' },
    { id: 'rights', title: 'Your Rights' },
    { id: 'changes', title: 'Policy Changes' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Head>
        <title>Privacy Policy | Your Company</title>
        <meta name="description" content="Read our privacy policy to understand how we handle your data." />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy <span className="text-indigo-600">Policy</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="sticky top-24 bg-white rounded-xl shadow-sm p-6 h-fit">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Sections</h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <Link
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={() => setActiveSection(section.id)}
                    className={`block w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-indigo-50 text-indigo-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {section.title}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4 bg-white rounded-xl shadow-sm p-8">
            {/* Introduction */}
            <section
              id="introduction"
              className={`mb-12 ${activeSection === 'introduction' ? 'block' : 'hidden lg:block'}`}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-700 mb-4">
                At <span className="font-semibold">Your Company</span>, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
              <p className="text-gray-700">
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
              </p>
            </section>

            {/* Data Collection */}
            <section
              id="data-collection"
              className={`mb-12 ${activeSection === 'data-collection' ? 'block' : 'hidden lg:block'}`}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Collection</h2>
              <p className="text-gray-700 mb-4">
                We collect information that you provide directly to us when you:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Create an account on our platform</li>
                <li>Subscribe to our newsletter</li>
                <li>Fill out forms or surveys</li>
                <li>Contact us for support or inquiries</li>
                <li>Make purchases or transactions</li>
              </ul>
              <p className="text-gray-700">
                The types of information we may collect include your name, email address, phone number, payment information, and any other information you choose to provide.
              </p>
            </section>

            {/* Data Usage */}
            <section
              id="data-usage"
              className={`mb-12 ${activeSection === 'data-usage' ? 'block' : 'hidden lg:block'}`}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Data</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-indigo-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-indigo-700 mb-2">Service Provision</h3>
                  <p className="text-gray-700">To provide, maintain, and improve our services</p>
                </div>
                <div className="bg-indigo-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-indigo-700 mb-2">Communication</h3>
                  <p className="text-gray-700">To respond to your inquiries and send important notices</p>
                </div>
                <div className="bg-indigo-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-indigo-700 mb-2">Personalization</h3>
                  <p className="text-gray-700">To personalize your experience and deliver relevant content</p>
                </div>
                <div className="bg-indigo-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-indigo-700 mb-2">Security</h3>
                  <p className="text-gray-700">To detect and prevent fraudulent activity</p>
                </div>
              </div>
            </section>

            {/* Data Protection */}
            <section
              id="data-protection"
              className={`mb-12 ${activeSection === 'data-protection' ? 'block' : 'hidden lg:block'}`}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Protection</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing and against accidental loss, destruction, or damage.
              </p>
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      We use industry-standard encryption for data transmission and storage.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section
              id="cookies"
              className={`mb-12 ${activeSection === 'cookies' ? 'block' : 'hidden lg:block'}`}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies & Tracking Technologies</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar tracking technologies to track activity on our website and hold certain information to improve your browsing experience.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Essential</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Required for site functionality</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Performance</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Help us understand site usage</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Functional</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Remember your preferences</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Marketing</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Used for targeted advertising</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Your Rights */}
            <section
              id="rights"
              className={`mb-12 ${activeSection === 'rights' ? 'block' : 'hidden lg:block'}`}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
              <p className="text-gray-700 mb-4">
                Depending on your location, you may have certain rights regarding your personal data:
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Access</h3>
                    <p className="text-gray-700">Request a copy of your personal data</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Rectification</h3>
                    <p className="text-gray-700">Correct inaccurate or incomplete data</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Erasure</h3>
                    <p className="text-gray-700">Request deletion of your personal data</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Policy Changes */}
            <section
              id="changes"
              className={`mb-12 ${activeSection === 'changes' ? 'block' : 'hidden lg:block'}`}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      We encourage you to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-gray-50 p-6 rounded-lg" id='contact'>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:quizoedtech@gmail.com"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Email Us
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Contact Form
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;