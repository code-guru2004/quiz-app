'use client'
import React, { useEffect, useState } from 'react'
import { Menu as MenuIcon, X as XIcon, LayoutDashboard, ListChecks, BookOpenCheck, Settings, LogOut, Menu, User, BellIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Loader from '@/components/shared/Loader'
import useGlobalContextProvider from '@/app/_context/ContextApi'
import QuizArea from './_component/QuizArea'
import Footer from './_component/Footer'
import Header from './_component/Header'
import clsx from 'clsx';
import ThemeToggle, { ModeToggle } from '@/components/shared/ModeToggle'

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false)
  const { username, email } = useGlobalContextProvider();
  const { isLoading, setIsLoading } = useGlobalContextProvider()
  const [menuSelected, setMenuSelected] = useState(0)
  // const toggleSidebar = () => {
  //   setSidebarOpen((prev) => !prev);
  //   sidebarDrawerOpen((prev) => !prev)
  // }
  useEffect(() => {
    setIsLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/sign-in';
  };

  const navLinks = [
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="size-5" /> },
    { label: 'Live Quizzes', href: '/dashboard/live-quizzes', icon: <ListChecks className="size-5" /> },
    { label: 'Practice Quiz', href: '/dashboard/practice-quizzes', icon: <BookOpenCheck className="size-5" /> },
  ]

  return (
    <>
      {isLoading ? (
        <div className="w-full h-screen flex items-center justify-center bg-white">
          <Loader />
        </div>
      ) : (
        <div className="flex min-h-screen overflow-hidden">
          {/* Sidebar - Desktop */}
          <aside className={`fixed top-0 left-0 h-full z-50 border-r body border-gray-200 dark:border-gray-800 backdrop-blur-sm hidden lg:flex flex-col transition-all duration-300 w-[17%]`}>
            {sidebarOpen && (
              <>
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                  <Link href="/" className="block ml-4">
                    <span className="sr-only">Home</span>
                    <svg data-logo="logo"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 124 46"
                      className="h-8 fill-black dark:fill-white">
                      <g id="logogram" transform="translate(0, 2.5)">
                        <path d="M20.9053 0.809967C9.85957 0.809967 0.905273 9.76427 0.905273 20.81C11.951 20.81 20.9053 11.8557 20.9053 0.809967Z" fill="#45D2B0" />
                        <path d="M20.9053 40.81C31.951 40.81 40.9053 31.8557 40.9053 20.81C29.8596 20.81 20.9053 29.7643 20.9053 40.81Z" fill="#45D2B0" />
                        <path d="M20.9053 0.809967C31.951 0.809967 40.9053 9.76427 40.9053 20.81C29.8596 20.81 20.9053 11.8557 20.9053 0.809967Z" fill="#23216E" />
                        <path d="M20.9053 40.81C9.85957 40.81 0.905272 31.8557 0.905273 20.81C11.951 20.81 20.9053 29.7643 20.9053 40.81Z" fill="#23216E" />
                      </g>
                      <g id="logotype" transform="translate(47, 1)">
                        <path fill="currentColor" d="M21.00 40.87L21.00 43.26Q20.17 43.64 19.43 43.78Q18.70 43.91 17.88 43.91Q17.35 43.91 16.57 43.78Q15.79 43.66 15.05 43.20Q14.31 42.75 13.80 41.81Q13.30 40.87 13.30 39.23L13.30 38.09Q12.32 37.90 11.36 37.36Q10.39 36.82 9.59 35.75Q8.79 34.68 8.31 32.92Q7.83 31.15 7.83 28.50L7.83 18.16Q7.83 15.53 8.32 13.78Q8.80 12.02 9.60 10.97Q10.39 9.92 11.36 9.40Q12.32 8.88 13.30 8.72Q14.27 8.55 15.09 8.55Q15.88 8.55 16.84 8.71Q17.81 8.86 18.77 9.37Q19.72 9.87 20.52 10.91Q21.31 11.96 21.80 13.72Q22.29 15.48 22.29 18.16L22.29 28.50Q22.29 31.86 21.48 33.84Q20.68 35.81 19.47 36.76Q18.25 37.71 17.02 38.02L17.02 38.27Q17.02 39.93 17.80 40.41Q18.58 40.89 20.08 40.89Q20.32 40.89 20.56 40.89Q20.80 40.89 21.00 40.87ZM15.09 34.79Q16.41 34.79 17.04 33.80Q17.67 32.80 17.67 30.09L17.67 16.93Q17.67 14.13 17.04 13.07Q16.41 12.02 15.09 12.02Q13.74 12.02 13.10 13.07Q12.46 14.13 12.46 16.93L12.46 30.09Q12.46 32.80 13.10 33.80Q13.74 34.79 15.09 34.79ZM26.29 32.50L26.29 14.47L30.61 14.47L30.61 31.78Q30.61 33.33 31.09 33.94Q31.57 34.55 32.49 34.55Q33.86 34.55 34.86 33.16L34.86 14.47L39.19 14.47L39.19 38L35.89 38L35.46 35.49Q34.44 37.09 33.16 37.68Q31.89 38.27 30.59 38.27Q28.54 38.27 27.41 36.83Q26.29 35.39 26.29 32.50ZM45.73 11.20Q44.54 11.20 43.81 10.45Q43.08 9.70 43.08 8.33Q43.08 6.81 43.81 6.18Q44.54 5.55 45.75 5.55Q47.02 5.55 47.72 6.23Q48.43 6.91 48.43 8.33Q48.43 9.67 47.72 10.43Q47.00 11.20 45.73 11.20ZM43.60 38L43.60 14.47L47.92 14.47L47.92 38L43.60 38ZM50.37 38L50.37 35.85L56.88 17.75L50.71 17.75L50.71 14.47L61.51 14.47L61.51 16.62L54.98 34.72L61.63 34.72L61.63 38L50.37 38ZM70.00 38.26Q68.87 38.26 67.73 37.92Q66.58 37.59 65.62 36.56Q64.65 35.54 64.07 33.46Q63.49 31.39 63.49 27.90L63.49 24.21Q63.49 20.77 64.09 18.77Q64.69 16.76 65.66 15.77Q66.63 14.79 67.78 14.49Q68.92 14.19 70.02 14.19Q71.08 14.19 72.21 14.48Q73.33 14.76 74.29 15.72Q75.25 16.69 75.85 18.71Q76.44 20.74 76.44 24.21L76.44 27.90Q76.44 31.33 75.83 33.39Q75.21 35.45 74.24 36.50Q73.27 37.56 72.15 37.91Q71.03 38.26 70.00 38.26ZM70.04 35.04Q71.20 35.04 71.65 33.76Q72.10 32.48 72.10 29.18L72.10 23.32Q72.10 20.00 71.65 18.71Q71.20 17.41 70.04 17.41Q68.82 17.41 68.33 18.71Q67.83 20.00 67.83 23.32L67.83 29.18Q67.83 32.48 68.33 33.76Q68.82 35.04 70.04 35.04Z" />
                      </g>
                    </svg>
                  </Link>
                  {/* <Button onClick={() => setSidebarOpen(true)} size="icon" className="bg-transparent hover:bg-red-300">
                    <XIcon className="text-red-800 size-5" />
                  </Button> */}
                </div>
                <nav className="flex-1 p-4 space-y-2">
                  {navLinks.map(({ label, href, icon }, idx) => (
                    <Link
                      key={label}
                      href={href}
                      className={clsx(
                        'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-300',
                        menuSelected === idx
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-700 dark:to-teal-700 text-white shadow-md'
                          : 'text-black dark:text-white hover:bg-gradient-to-r hover:from-green-200 hover:to-teal-200 dark:hover:from-green-700 dark:hover:to-teal-700'
                      )}
                      onClick={() => setMenuSelected(idx)}
                    >
                      {icon}
                      <span>{label}</span>
                    </Link>

                  ))}
                </nav>
                <div className="p-4 border-t border-gray-800 space-y-2">
                  <Link href={`/profile/${username}`} className="flex items-center gap-3 cursor-pointer bg-gradient-to-r from-slate-700 to-slate-900 dark:to-slate-850 hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-800 transition-colors duration-500 p-2 rounded-md">
                    <User className="size-5 text-gray-200 dark:text-white" />
                    <span className="text-gray-100">Profile</span>
                  </Link>
                  <div onClick={handleLogout} className="flex items-center gap-3 cursor-pointer bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700
 p-2 rounded-md">
                    <LogOut className="size-5 text-white" />
                    <span className="text-white">Logout</span>
                  </div>
                </div>
              </>
            )}
          </aside>

          {/* Sidebar - Mobile */}
          <aside className={`fixed top-0 left-0 h-screen w-64 bg-gray-900 z-40 transform transition-transform duration-300 ease-in-out ${sidebarDrawerOpen ? 'translate-x-0' : '-translate-x-full'} border-r border-gray-800 lg:hidden`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="text-xl font-bold text-amber-500">Quizo</div>
              <Button onClick={() => setSidebarDrawerOpen(false)} size="icon" className="bg-transparent hover:bg-gray-800">
                <XIcon className="text-gray-300 size-5" />
              </Button>
            </div>
            <div className='flex flex-col justify-between h-[90%]'>
              <nav className="p-4 space-y-2">
                {navLinks.map(({ label, href, icon }) => (
                  <Link key={label} href={href} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-white transition" onClick={() => setSidebarDrawerOpen(false)}>
                    {icon}
                    <span>{label}</span>
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t border-gray-800 space-y-2">
                <Link href={`/profile/${username}`} className="flex items-center gap-3 cursor-pointer bg-gradient-to-r from-slate-700 to-slate-900 dark:to-slate-850 hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-800 transition-colors duration-500 p-2 rounded-md">
                  <User className="size-5 text-gray-200 dark:text-gray-100" />
                  <span className="text-gray-100">Profile</span>
                </Link>
                <div onClick={handleLogout} className="flex items-center gap-3 cursor-pointer bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700
  p-2 rounded-md">
                  <LogOut className="size-5 text-white" />
                  <span className="text-white">Logout</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Section */}
          <main className={`flex-1 flex flex-col min-h-screen justify-between transition-all duration-300 ${sidebarOpen ? 'lg:ml-[17%]' : 'lg:ml-0'}`}>

            {/* Header */}

            
            <header className="fixed top-0 left-0 right-0 z-30 bg-white dark:bg-gray-900 shadow mb-12">
              <div className=" flex h-16 justify-between  items-center px-0.5 lg:px-5">
                {/* Sidebar Toggle Button */}
                <div className='flex gap-3 items-center'>
                  <div className="flex items-center justify-start w-10 lg:w-0 ">

                    {!sidebarDrawerOpen && (
                      <button
                        onClick={() => setSidebarDrawerOpen(true)}
                        className="bg-transparent flex items-center justify-center p-2 rounded cursor-pointer shadow lg:hidden hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors duration-200 mr-4"
                      >
                        <MenuIcon className="text-gray-900 dark:text-white size-6" />
                      </button>
                    )}
                  </div>

                  {/* Logo */}
                  <Link href="/" className="block lg:hidden">
                    <span className="sr-only">Home</span>
                    <svg data-logo="logo"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 124 46"
                      className="h-8 fill-black dark:fill-white">
                      <g id="logogram" transform="translate(0, 2.5)">
                        <path d="M20.9053 0.809967C9.85957 0.809967 0.905273 9.76427 0.905273 20.81C11.951 20.81 20.9053 11.8557 20.9053 0.809967Z" fill="#45D2B0" />
                        <path d="M20.9053 40.81C31.951 40.81 40.9053 31.8557 40.9053 20.81C29.8596 20.81 20.9053 29.7643 20.9053 40.81Z" fill="#45D2B0" />
                        <path d="M20.9053 0.809967C31.951 0.809967 40.9053 9.76427 40.9053 20.81C29.8596 20.81 20.9053 11.8557 20.9053 0.809967Z" fill="#23216E" />
                        <path d="M20.9053 40.81C9.85957 40.81 0.905272 31.8557 0.905273 20.81C11.951 20.81 20.9053 29.7643 20.9053 40.81Z" fill="#23216E" />
                      </g>
                      <g id="logotype" transform="translate(47, 1)">
                        <path fill="currentColor" d="M21.00 40.87L21.00 43.26Q20.17 43.64 19.43 43.78Q18.70 43.91 17.88 43.91Q17.35 43.91 16.57 43.78Q15.79 43.66 15.05 43.20Q14.31 42.75 13.80 41.81Q13.30 40.87 13.30 39.23L13.30 38.09Q12.32 37.90 11.36 37.36Q10.39 36.82 9.59 35.75Q8.79 34.68 8.31 32.92Q7.83 31.15 7.83 28.50L7.83 18.16Q7.83 15.53 8.32 13.78Q8.80 12.02 9.60 10.97Q10.39 9.92 11.36 9.40Q12.32 8.88 13.30 8.72Q14.27 8.55 15.09 8.55Q15.88 8.55 16.84 8.71Q17.81 8.86 18.77 9.37Q19.72 9.87 20.52 10.91Q21.31 11.96 21.80 13.72Q22.29 15.48 22.29 18.16L22.29 28.50Q22.29 31.86 21.48 33.84Q20.68 35.81 19.47 36.76Q18.25 37.71 17.02 38.02L17.02 38.27Q17.02 39.93 17.80 40.41Q18.58 40.89 20.08 40.89Q20.32 40.89 20.56 40.89Q20.80 40.89 21.00 40.87ZM15.09 34.79Q16.41 34.79 17.04 33.80Q17.67 32.80 17.67 30.09L17.67 16.93Q17.67 14.13 17.04 13.07Q16.41 12.02 15.09 12.02Q13.74 12.02 13.10 13.07Q12.46 14.13 12.46 16.93L12.46 30.09Q12.46 32.80 13.10 33.80Q13.74 34.79 15.09 34.79ZM26.29 32.50L26.29 14.47L30.61 14.47L30.61 31.78Q30.61 33.33 31.09 33.94Q31.57 34.55 32.49 34.55Q33.86 34.55 34.86 33.16L34.86 14.47L39.19 14.47L39.19 38L35.89 38L35.46 35.49Q34.44 37.09 33.16 37.68Q31.89 38.27 30.59 38.27Q28.54 38.27 27.41 36.83Q26.29 35.39 26.29 32.50ZM45.73 11.20Q44.54 11.20 43.81 10.45Q43.08 9.70 43.08 8.33Q43.08 6.81 43.81 6.18Q44.54 5.55 45.75 5.55Q47.02 5.55 47.72 6.23Q48.43 6.91 48.43 8.33Q48.43 9.67 47.72 10.43Q47.00 11.20 45.73 11.20ZM43.60 38L43.60 14.47L47.92 14.47L47.92 38L43.60 38ZM50.37 38L50.37 35.85L56.88 17.75L50.71 17.75L50.71 14.47L61.51 14.47L61.51 16.62L54.98 34.72L61.63 34.72L61.63 38L50.37 38ZM70.00 38.26Q68.87 38.26 67.73 37.92Q66.58 37.59 65.62 36.56Q64.65 35.54 64.07 33.46Q63.49 31.39 63.49 27.90L63.49 24.21Q63.49 20.77 64.09 18.77Q64.69 16.76 65.66 15.77Q66.63 14.79 67.78 14.49Q68.92 14.19 70.02 14.19Q71.08 14.19 72.21 14.48Q73.33 14.76 74.29 15.72Q75.25 16.69 75.85 18.71Q76.44 20.74 76.44 24.21L76.44 27.90Q76.44 31.33 75.83 33.39Q75.21 35.45 74.24 36.50Q73.27 37.56 72.15 37.91Q71.03 38.26 70.00 38.26ZM70.04 35.04Q71.20 35.04 71.65 33.76Q72.10 32.48 72.10 29.18L72.10 23.32Q72.10 20.00 71.65 18.71Q71.20 17.41 70.04 17.41Q68.82 17.41 68.33 18.71Q67.83 20.00 67.83 23.32L67.83 29.18Q67.83 32.48 68.33 33.76Q68.82 35.04 70.04 35.04Z" />
                      </g>
                    </svg>
                  </Link>
                </div>

                <div className="ml-1 flex relative items-center gap-4">
                  <ThemeToggle />
                  <button className=" p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-800 right-4">
                    <BellIcon className="h-6 w-6 text-gray-700 dark:text-gray-400" />
                    <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                </div>

              </div>
            </header>


            {/* Quiz + Footer Section */}
            <section className={`flex-1  min-h-screen mt-20 lg:mt-12 overflow-y-auto px-2 sm:px-4 scroll-smooth ${sidebarDrawerOpen ? 'blur-xs lg:blur-none' : ''}`}>
              {children}
            </section>
            <Footer />
          </main>
        </div>
      )}
    </>
  )
}

export default DashboardLayout

