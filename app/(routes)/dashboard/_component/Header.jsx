'use client';

import { useState } from "react";
import Link from "next/link";
import useGlobalContextProvider from "@/app/_context/ContextApi";

export default function Header({ email }) {
  const {username} = useGlobalContextProvider()
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/sign-in';
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow mb-4">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="block">
          <span className="sr-only">Home</span>
          <svg data-logo="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 124 46" className="h-8">
            <g id="logogram" transform="translate(0, 2.5)">
              <path d="M20.9053 0.809967C9.85957 0.809967 0.905273 9.76427 0.905273 20.81C11.951 20.81 20.9053 11.8557 20.9053 0.809967Z" fill="#45D2B0"/>
              <path d="M20.9053 40.81C31.951 40.81 40.9053 31.8557 40.9053 20.81C29.8596 20.81 20.9053 29.7643 20.9053 40.81Z" fill="#45D2B0"/>
              <path d="M20.9053 0.809967C31.951 0.809967 40.9053 9.76427 40.9053 20.81C29.8596 20.81 20.9053 11.8557 20.9053 0.809967Z" fill="#23216E"/>
              <path d="M20.9053 40.81C9.85957 40.81 0.905272 31.8557 0.905273 20.81C11.951 20.81 20.9053 29.7643 20.9053 40.81Z" fill="#23216E"/>
            </g>
            <g id="logotype" transform="translate(47, 1)">
              <path fill="#111111" d="M21.00 40.87L21.00 43.26Q20.17 43.64 19.43 43.78Q18.70 43.91 17.88 43.91Q17.35 43.91 16.57 43.78Q15.79 43.66 15.05 43.20Q14.31 42.75 13.80 41.81Q13.30 40.87 13.30 39.23L13.30 38.09Q12.32 37.90 11.36 37.36Q10.39 36.82 9.59 35.75Q8.79 34.68 8.31 32.92Q7.83 31.15 7.83 28.50L7.83 18.16Q7.83 15.53 8.32 13.78Q8.80 12.02 9.60 10.97Q10.39 9.92 11.36 9.40Q12.32 8.88 13.30 8.72Q14.27 8.55 15.09 8.55Q15.88 8.55 16.84 8.71Q17.81 8.86 18.77 9.37Q19.72 9.87 20.52 10.91Q21.31 11.96 21.80 13.72Q22.29 15.48 22.29 18.16L22.29 28.50Q22.29 31.86 21.48 33.84Q20.68 35.81 19.47 36.76Q18.25 37.71 17.02 38.02L17.02 38.27Q17.02 39.93 17.80 40.41Q18.58 40.89 20.08 40.89Q20.32 40.89 20.56 40.89Q20.80 40.89 21.00 40.87ZM15.09 34.79Q16.41 34.79 17.04 33.80Q17.67 32.80 17.67 30.09L17.67 16.93Q17.67 14.13 17.04 13.07Q16.41 12.02 15.09 12.02Q13.74 12.02 13.10 13.07Q12.46 14.13 12.46 16.93L12.46 30.09Q12.46 32.80 13.10 33.80Q13.74 34.79 15.09 34.79ZM26.29 32.50L26.29 14.47L30.61 14.47L30.61 31.78Q30.61 33.33 31.09 33.94Q31.57 34.55 32.49 34.55Q33.86 34.55 34.86 33.16L34.86 14.47L39.19 14.47L39.19 38L35.89 38L35.46 35.49Q34.44 37.09 33.16 37.68Q31.89 38.27 30.59 38.27Q28.54 38.27 27.41 36.83Q26.29 35.39 26.29 32.50ZM45.73 11.20Q44.54 11.20 43.81 10.45Q43.08 9.70 43.08 8.33Q43.08 6.81 43.81 6.18Q44.54 5.55 45.75 5.55Q47.02 5.55 47.72 6.23Q48.43 6.91 48.43 8.33Q48.43 9.67 47.72 10.43Q47.00 11.20 45.73 11.20ZM43.60 38L43.60 14.47L47.92 14.47L47.92 38L43.60 38ZM50.37 38L50.37 35.85L56.88 17.75L50.71 17.75L50.71 14.47L61.51 14.47L61.51 16.62L54.98 34.72L61.63 34.72L61.63 38L50.37 38ZM70.00 38.26Q68.87 38.26 67.73 37.92Q66.58 37.59 65.62 36.56Q64.65 35.54 64.07 33.46Q63.49 31.39 63.49 27.90L63.49 24.21Q63.49 20.77 64.09 18.77Q64.69 16.76 65.66 15.77Q66.63 14.79 67.78 14.49Q68.92 14.19 70.02 14.19Q71.08 14.19 72.21 14.48Q73.33 14.76 74.29 15.72Q75.25 16.69 75.85 18.71Q76.44 20.74 76.44 24.21L76.44 27.90Q76.44 31.33 75.83 33.39Q75.21 35.45 74.24 36.50Q73.27 37.56 72.15 37.91Q71.03 38.26 70.00 38.26ZM70.04 35.04Q71.20 35.04 71.65 33.76Q72.10 32.48 72.10 29.18L72.10 23.32Q72.10 20.00 71.65 18.71Q71.20 17.41 70.04 17.41Q68.82 17.41 68.33 18.71Q67.83 20.00 67.83 23.32L67.83 29.18Q67.83 32.48 68.33 33.76Q68.82 35.04 70.04 35.04Z"/>
            </g>
          </svg>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 text-sm text-gray-700">
          <NavItem href="#">About</NavItem>
          <NavItem href="#">Quizes</NavItem>
        </nav>

        {/* Right-side buttons */}
        <div className="flex items-center gap-4">
          {email ? (
            <div className="flex items-center gap-4">
              <Link href={`/profile/${username}`} className="text-sm text-gray-700 hidden sm:inline hover:border-b-green-700 hover:border-b-2 transition-all">👋 {email}</Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600 hidden md:block"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex sm:gap-4">
              <Link
                className="bg-teal-600 px-5 py-2.5 text-sm font-medium text-white rounded-md shadow hover:bg-teal-700"
                href="/sign-in"
              >
                Login
              </Link>
              <Link
                className="bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 rounded-md hover:text-teal-600/75"
                href="/sign-up"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden bg-gray-100 p-2.5 text-gray-600 rounded-md hover:text-gray-800"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <nav className="md:hidden bg-gray-50 p-4 space-y-2 rounded-md">
          <NavItem href="/">About</NavItem>
          <NavItem href="/dashboard">Quiz</NavItem>
          <NavItem href={`/profile/${username}`}>Profile</NavItem>

          {!email ? (
            <>
              <Link
                className="block text-center bg-teal-600 text-white px-5 py-2.5 rounded-md shadow hover:bg-teal-700"
                href="/sign-in"
              >
                Login
              </Link>
              <Link
                className="block text-center bg-gray-100 text-teal-600 px-5 py-2.5 rounded-md hover:text-teal-600/75"
                href="/sign-up"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className=" w-full text-center bg-red-500 text-white px-5 py-2.5 rounded-md shadow hover:bg-red-600 block md:hidden"
            >
              Logout
            </button>
          )}
        </nav>
      )}
    </header>
  );
}

function NavItem({ href, children }) {
  return (
    <Link href={href} className="block text-gray-600 hover:text-teal-600">
      {children}
    </Link>
  );
}
