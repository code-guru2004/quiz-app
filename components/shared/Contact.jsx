'use client'

import { motion } from 'framer-motion'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { FaFacebook, FaGithub, FaTwitter } from "react-icons/fa";
import Link from 'next/link';
import { useState } from 'react';

const socialLinks = [
  {
    title: "Facebook",
    icon: <FaFacebook className="size-7 text-blue-500" />,
    link: "https://facebook.com",
  },
  {
    title: "Github",
    icon: <FaGithub className="size-7 text-black" />,
    link: "https://github.com",
  },
  {
    title: "Twitter",
    icon: <FaTwitter className="size-7" color="#1DA1F2"/>,
    link: "https://twitter.com",
  },
  {
    title: "Linkedin",
    icon: <FaLinkedin className="size-7 text-blue-600" />,
    link: "https://linkedin.com",
  },
];
export default function Contact() {
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
                const response = await fetch('/api/email/send-feedback-email', {
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
        <section id="contact" className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Get In Touch
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Have questions or feedback? We'd love to hear from you!
                    </p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="lg:w-1/2"
                    >
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">
                                Send us a message
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Your First Name
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        autoComplete="given-name"
                                        
                                        className={`w-full px-4 py-2 rounded-lg border ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                    {errors.firstName && (
                                                <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Your Last Name
                                    </label>
                                    <input
                                         type="text"
                                         id="lastName"
                                         name="lastName"
                                         value={formData.lastName}
                                         onChange={handleChange}
                                         autoComplete="family-name"
                                        className={`w-full px-4 py-2 rounded-lg border ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                    {errors.firstName && (
                                                <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        autoComplete="email"
                                        className={`w-full px-4 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                        Subject
                                    </label>
                                    <input
                                        id="subject"
                                        name="subject"
                                        type="text"
                                        value={formData.subject}
                                        onChange={handleChange}
                                       
                                        className={`w-full px-4 py-2 rounded-lg border ${errors.subject ? 'border-red-500' : 'border-gray-300'
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                    {errors.subject && (
                                        <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                        Message
                                    </label>
                                    <textarea
                                       id="message"
                                       name="message"
                                       rows={4}
                                       value={formData.message}
                                       onChange={handleChange}
                                        className={`w-full px-4 py-2 rounded-lg border ${errors.message ? 'border-red-500' : 'border-gray-300'
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    ></textarea>
                                    {errors.message && (
                                        <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                                    )}
                                </div>

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
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="lg:w-1/2"
                    >
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-full">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                                        <FaEnvelope className="text-blue-600 text-lg" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-1">Email</h4>
                                        <p className="text-gray-600">eduprobe.exam@gmail.com</p>
                                       
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-green-100 p-3 rounded-full mr-4">
                                        <FaPhone className="text-green-600 text-lg" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-1">Phone</h4>
                                        <p className="text-gray-600">+91 9088813015</p>
                                        <p className="text-gray-600">Mon-Fri, 9am-5pm IST</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-purple-100 p-3 rounded-full mr-4">
                                        <FaMapMarkerAlt className="text-purple-600 text-lg" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-1">Address</h4>
                                        <p className="text-gray-600">244, AJC Bose Road, Kolkata</p>
                                        <p className="text-gray-600">West Bengal, India</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h4 className="font-medium text-gray-900 mb-4">Follow Us</h4>
                                <div className="flex space-x-4">
                                    {socialLinks.map((social,idx) => (
                                        <Link
                                            key={idx}
                                            href={social.link}
                                            className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                        >
                                            {social.icon}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}