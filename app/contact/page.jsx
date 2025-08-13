'use client'
import { useState } from 'react';
import Head from 'next/head';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: '',
        consent: false
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }

        if (!formData.subject) newErrors.subject = 'Please select a subject';
        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters';
        }

        if (!formData.consent) newErrors.consent = 'You must agree to our privacy policy';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // Replace with your actual API endpoint
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitStatus({ type: 'success', message: 'Your message has been sent successfully!' });
                // Reset form
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    subject: '',
                    message: '',
                    consent: false
                });
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            setSubmitStatus({ type: 'error', message: 'There was an error submitting your message. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <Head>
                <title>Contact Us | Your Company</title>
                <meta name="description" content="Get in touch with our team" />
            </Head>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Contact <span className="text-indigo-600">Us</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Have questions or feedback? We'd love to hear from you.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Contact Information */}
                    <div className="lg:w-1/3">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 h-fit sticky top-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Get in touch</h2>

                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <svg
                                            className="h-5 w-5 text-indigo-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Email</h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">eduprobe.exam@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:w-2/3">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a message</h2>

                            {/* Status Messages */}
                            {submitStatus && (
                                <div
                                    className={`mb-6 rounded-lg p-4 ${submitStatus.type === 'success'
                                            ? 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200'
                                        }`}
                                >
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg
                                                className={`h-5 w-5 ${submitStatus.type === 'success'
                                                        ? 'text-green-400'
                                                        : 'text-red-400'
                                                    }`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                {submitStatus.type === 'success' ? (
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                        clipRule="evenodd"
                                                    />
                                                ) : (
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                        clipRule="evenodd"
                                                    />
                                                )}
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p
                                                className={`text-sm font-medium ${submitStatus.type === 'success'
                                                        ? 'text-green-800 dark:text-green-200'
                                                        : 'text-red-800 dark:text-red-200'
                                                    }`}
                                            >
                                                {submitStatus.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    {/* First Name */}
                                    <div>
                                        <label
                                            htmlFor="firstName"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            First name
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                id="firstName"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                autoComplete="given-name"
                                                className={`block w-full h-10 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 lg:text-xl sm:text-sm p-2`}
                                            />
                                            {errors.firstName && (
                                                <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <label
                                            htmlFor="lastName"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Last name
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                id="lastName"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                autoComplete="family-name"
                                                className={`block w-full h-10 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 lg:text-xl sm:text-sm p-2`}
                                            />
                                            {errors.lastName && (
                                                <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Email address
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                autoComplete="email"
                                                className={`block w-full h-10 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 lg:text-xl sm:text-sm p-2`}
                                            />
                                            {errors.email && (
                                                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Subject */}
                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="subject"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Subject
                                        </label>
                                        <div className="mt-1">
                                            <select
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className={`block w-full h-10 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                            >
                                                <option value="">Select a subject</option>
                                                <option value="support">Support</option>
                                                <option value="sales">Careers</option>
                                                <option value="feedback">Feedback</option>
                                                <option value="other">Other</option>
                                            </select>
                                            {errors.subject && (
                                                <p className="mt-2 text-sm text-red-600">{errors.subject}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="message"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Message
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                id="message"
                                                name="message"
                                                rows={4}
                                                value={formData.message}
                                                onChange={handleChange}
                                                className={`block w-full rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-1`}
                                            />
                                            {errors.message && (
                                                <p className="mt-2 text-sm text-red-600">{errors.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Consent */}
                                <div className="flex items-center">
                                    <input
                                        id="consent"
                                        name="consent"
                                        type="checkbox"
                                        checked={formData.consent}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                                    />
                                    <label
                                        htmlFor="consent"
                                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                                    >
                                        I agree to the{' '}
                                        <a
                                            href="/privacy-policy"
                                            className="text-indigo-600 hover:text-indigo-500"
                                        >
                                            Privacy Policy
                                        </a>
                                    </label>
                                </div>
                                {errors.consent && (
                                    <p className="mt-2 text-sm text-red-600">{errors.consent}</p>
                                )}

                                {/* Submit Button */}
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg
                                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Sending...
                                            </>
                                        ) : (
                                            'Send message'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default ContactForm;