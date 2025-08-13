'use client'
// components/TermsOfService.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'account-terms', title: 'Account Terms' },
    { id: 'test-content', title: 'Test Content' },
    { id: 'user-conduct', title: 'User Conduct' },
    { id: 'intellectual-property', title: 'Intellectual Property' },
    { id: 'limitations', title: 'Limitations' },
    { id: 'termination', title: 'Termination' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Head>
        <title>Terms of Service | Test Portal</title>
        <meta name="description" content="Terms governing your use of our test portal platform" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms of <span className="text-blue-600">Service</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Effective: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <div className="mt-4 bg-blue-50 inline-flex items-center px-4 py-2 rounded-full">
            <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-blue-700">For Test Portal Users</span>
          </div>
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
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {section.title}
                  </Link>
                ))}
              </nav>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <a 
                  href="/privacy-policy" 
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
                >
                  View Privacy Policy
                  <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
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
                Welcome to <span className="font-semibold">Test Portal</span> ("Platform"). These Terms of Service ("Terms") govern your access to and use of our test portal services, including any content, functionality, and services offered on or through the platform.
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use the Platform.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Account Terms */}
            <section
              id="account-terms"
              className={`mb-12 ${activeSection === 'account-terms' ? 'block' : 'hidden lg:block'}`}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Terms</h2>
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xs font-semibold text-blue-800">1</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Eligibility</h3>
                    <p className="text-gray-700">
                      You must be at least 13 years old to use the Platform. If you're under 18, you may only use the Platform with consent from a parent or guardian.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xs font-semibold text-blue-800">2</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Account Security</h3>
                    <p className="text-gray-700">
                      You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xs font-semibold text-blue-800">3</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Accuracy</h3>
                    <p className="text-gray-700">
                      You must provide accurate and complete information when creating an account and keep it updated.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Test Content */}
            <section
              id="test-content"
              className={`mb-12 ${activeSection === 'test-content' ? 'block' : 'hidden lg:block'}`}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Content</h2>
              <p className="text-gray-700 mb-4">
                The Platform provides access to various tests and assessment materials ("Test Content"). Your use of this content is subject to the following conditions:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Test Content is provided for educational and assessment purposes only</li>
                <li>You may not reproduce, distribute, or share Test Content without authorization</li>
                <li>Test results are provided "as is" without warranty of accuracy</li>
                <li>We reserve the right to modify or remove Test Content at any time</li>
              </ul>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Prohibited Actions</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-gray-700">Reverse engineering test questions</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-gray-700">Sharing answers with other users</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-gray-700">Using automated tools to complete tests</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-gray-700">Creating false or misleading test results</span>
                  </div>
                </div>
              </div>
            </section>

            {/* User Conduct */}
            <section
              id="user-conduct"
              className={`mb-12 ${activeSection === 'user-conduct' ? 'block' : 'hidden lg:block'}`}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">User Conduct</h2>
              <p className="text-gray-700 mb-4">
                You agree not to engage in any of the following prohibited activities:
              </p>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consequence</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Cheating or fraud</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Immediate account suspension</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Harassment of other users</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Warning or account termination</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Spamming</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Content removal and restrictions</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Unauthorized access</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Legal action and permanent ban</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Intellectual Property */}
            <section
              id="intellectual-property"
              className={`mb-12 ${activeSection === 'intellectual-property' ? 'block' : 'hidden lg:block'}`}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-gray-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Platform Content</h3>
                  <p className="text-gray-700">
                    All test content, software, designs, text, and graphics on the Platform are owned by or licensed to us and are protected by intellectual property laws.
                  </p>
                </div>
                <div className="flex-1 bg-gray-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">User Content</h3>
                  <p className="text-gray-700">
                    You retain ownership of any content you submit to the Platform, but grant us a license to use, display, and modify it for platform operation.
                  </p>
                </div>
              </div>
            </section>

            {/* Limitations */}
            <section
              id="limitations"
              className={`mb-12 ${activeSection === 'limitations' ? 'block' : 'hidden lg:block'}`}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitations of Liability</h2>
              <p className="text-gray-700 mb-4">
                To the maximum extent permitted by law, the Platform shall not be liable for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Any indirect, incidental, or consequential damages</li>
                <li>Loss of data, profits, or business opportunities</li>
                <li>Errors or inaccuracies in test content or results</li>
                <li>Interruptions or unavailability of the Platform</li>
              </ul>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-700 italic">
                  Some jurisdictions do not allow the exclusion or limitation of certain damages, so some of these limitations may not apply to you.
                </p>
              </div>
            </section>

            {/* Termination */}
            <section
              id="termination"
              className={`mb-12 ${activeSection === 'termination' ? 'block' : 'hidden lg:block'}`}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">By Us</h3>
                    <p className="text-gray-700">
                      We may suspend or terminate your access to the Platform at any time for any reason, including violation of these Terms.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">By You</h3>
                    <p className="text-gray-700">
                      You may stop using the Platform at any time. Account deletion requests can be made through your account settings.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact & Changes */}
            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Contact Us</h2>
                  <p className="text-gray-700 mb-4">
                    For questions about these Terms, please contact our support team.
                  </p>
                  <a
                    href="mailto:quizoedtech@gmail.com"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Contact Support
                  </a>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Changes to Terms</h2>
                  <p className="text-gray-700 mb-4">
                    We may modify these Terms at any time. We'll notify you of significant changes through the Platform or via email.
                  </p>
                  <p className="text-sm text-gray-500">
                    Your continued use of the Platform after changes constitutes acceptance of the new Terms.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;