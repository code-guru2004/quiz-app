'use client'
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger for mobile */}
      <button 
        className="md:hidden p-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`bg-gray-800 text-white fixed top-0 left-0 h-full z-30 w-64 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:w-60`}
      >
        <div className="p-6 text-xl font-bold border-b border-gray-700">QuizDash</div>
        <nav className="flex flex-col p-4 space-y-4 text-base">
          <Link href="/dashboard" className="hover:text-yellow-300">🏠 Dashboard</Link>
          <Link href="/my-quizzes" className="hover:text-yellow-300">📝 My Quizzes</Link>
          <Link href="/notifications" className="hover:text-yellow-300">🔔 Notifications</Link>
          <Link href="/settings" className="hover:text-yellow-300">⚙️ Settings</Link>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
