'use client'
import React, { useEffect, useState } from 'react'
import { Menu as MenuIcon, X as XIcon, LayoutDashboard, ListChecks, BookOpenCheck, Settings, LogOut, Menu, User, BellIcon, Brain, Swords, BookOpenText } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Loader from '@/components/shared/Loader'
import useGlobalContextProvider from '@/app/_context/ContextApi'
import QuizArea from './_component/QuizArea'
import Footer from './_component/Footer'
import Header from './_component/Header'
import clsx from 'clsx';
import ThemeToggle, { ModeToggle } from '@/components/shared/ModeToggle'
import NotificationDropdown from '@/components/shared/NotificationDropdown'
import Image from 'next/image'
import { GiTrophyCup, GiTwoCoins } from 'react-icons/gi'
import { RiCodeAiFill } from 'react-icons/ri'
import CreditProgressBar from '@/components/shared/CreditsProgressbar'
import axios from 'axios'

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false)
  const { username, email } = useGlobalContextProvider();
  const { isLoading, setIsLoading, userDetails,credits,setCredits } = useGlobalContextProvider()
  const [menuSelected, setMenuSelected] = useState(0)
  const [profileImage, setProfileImage] = useState(null)
  // const toggleSidebar = () => {
  //   setSidebarOpen((prev) => !prev);
  //   sidebarDrawerOpen((prev) => !prev)
  // }
  useEffect(() => {
    setIsLoading(false)
  }, [])
  useEffect(() => {
    let isMounted = true;
  
    const fetchDetails = async () => {
      try {
        const resp = await axios.get(`/api/user/get-credits?email=${email}`);
        if (resp.data.success && isMounted) {
          setProfileImage(resp.data?.image);
          setCredits(resp.data?.credits);
          console.log(resp.data?.credits);
          
        }
      } catch (error) {
        console.error("Failed to fetch credits:", error);
      }
    };
  
    if (email) fetchDetails();
  
    return () => { isMounted = false; };
  }, [email]);
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/sign-in';
  };

  const navLinks = [
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="size-5" /> },
    { label: 'Live Quizzes', href: '/dashboard/live-quizzes', icon: <ListChecks className="size-5" /> },
    { label: 'Practice Quiz', href: '/dashboard/practice-quizzes', icon: <BookOpenCheck className="size-5" /> },
    { label: 'AI Quiz', href: '/dashboard/ai-quiz', icon: <Brain className="size-5" /> },
    { label: '1vs1 Challenge', href: '/dashboard/peer-challenge', icon: <Swords className="size-5" /> },
    { label: 'Scheduled Contest', href: '/dashboard/contest', icon: <GiTrophyCup className="size-5" /> },
    { label: 'Snippet Quest', href: '/dashboard/coding', icon: <RiCodeAiFill className="size-5" /> },
    { label: 'Preparation', href: '/dashboard/preparation', icon: <BookOpenText className="size-5" /> },
  ];


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
                <div className="flex items-center justify-between py-0.5 border-b border-gray-800">
                  <Link href="/" className="block ml-4">
                    <span className="sr-only">Home</span>
                    <Image
                      src="/logo-1.png"
                      alt="Eduprobe"
                      width={180}
                      height={150}
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAU..." // tiny base64 blur image
                    />


                  </Link>

                </div>
                <nav className="flex-1 p-4 space-y-4">
                  {navLinks.map(({ label, href, icon }, idx) => (
                    <Link
                      key={label}
                      href={href}
                      className={clsx(
                        'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-300',
                        menuSelected === idx
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-700 dark:to-teal-700 text-white shadow-md'
                          : 'text-black dark:text-white hover:bg-gradient-to-r hover:bg-slate-300 dark:hover:bg-slate-700  dark:hover:text-gray-300'
                      )}
                      onClick={() => setMenuSelected(idx)}
                    >
                      {icon}
                      <span>{label}</span>
                    </Link>

                  ))}
                </nav>
                <div>
                  <CreditProgressBar currentCredits={2} />
                </div>
                <div className="p-4 border-t border-gray-800 space-y-2">
                  {/* Profile Link */}
                  <Link
                    href={`/profile/${username}`}
                    className="flex items-center gap-3 cursor-pointer bg-gradient-to-r from-slate-700 to-slate-900 dark:to-slate-850 hover:from-slate-700 hover:to-slate-800 transition-all duration-300 p-2 rounded-md"
                  >
                    {profileImage ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-600 flex-shrink-0">
                        <Image
                          src={profileImage}
                          alt="user"
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <User className="size-6 text-gray-200 dark:text-white" />
                    )}
                    <span className="text-gray-100 font-medium">Profile</span>
                  </Link>
                  {/* Logout Button */}
                  <div
                    onClick={handleLogout}
                    className="flex items-center gap-3 cursor-pointer bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 transition-all duration-300 p-2 rounded-md"
                  >
                    <LogOut className="size-6 text-white" />
                    <span className="text-white font-medium">Logout</span>
                  </div>
                </div>

              </>
            )}
          </aside>

          {/* Sidebar - Mobile */}
          <aside className={`fixed top-0 left-0 h-screen w-64 bg-gray-900 z-40 transform transition-transform duration-300 ease-in-out ${sidebarDrawerOpen ? 'translate-x-0' : '-translate-x-full'} border-r border-gray-800 lg:hidden`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="text-xl font-bold text-amber-500">
                <Image
                  src="/logo-1.png"
                  alt="Eduprobe"
                  width={180}
                  height={150}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAU..." // tiny base64 blur image
                />
              </div>
              <Button onClick={() => setSidebarDrawerOpen(false)} size="icon" className="bg-transparent hover:bg-gray-800">
                <XIcon className="text-gray-300 size-5" />
              </Button>
            </div>
            <div className='flex flex-col justify-between h-[80%]'>
              <nav className="p-4 space-y-3">
                {navLinks.map(({ label, href, icon }) => (
                  <Link key={label} href={href} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-white transition" onClick={() => setSidebarDrawerOpen(false)}>
                    {icon}
                    <span>{label}</span>
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t border-gray-800 space-y-2">
                <Link href={`/profile/${username}`} className="flex items-center gap-3 cursor-pointer bg-gradient-to-r from-slate-700 to-slate-900 dark:to-slate-850 hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-800 transition-colors duration-500 p-2 rounded-md">
                  {profileImage ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-600 flex-shrink-0">
                      <Image
                        src={profileImage}
                        alt="user"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <User className="size-6 text-gray-200 dark:text-white" />
                  )}
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


            <header className="fixed top-0 left-0 right-0 z-30 bg-gray-50 dark:bg-gray-900 shadow mb-12">
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
                    <Image
                      src="/logo-1.png"
                      alt="Eduprobe"
                      width={150}
                      height={130}
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAU..." // tiny base64 blur image
                    />
                  </Link>
                </div>

                <div className="ml-1 flex relative items-center gap-3">
                  <div className="flex items-center gap-2 lg:hidden px-3 py-1.5 rounded-full 
                bg-white/20 backdrop-blur-md shadow-md border border-white/30">
                    <GiTwoCoins className="text-yellow-600 dark:text-yellow-400 w-5 h-5 drop-shadow-sm" />
                    <span className="font-bold text-amber-900 dark:text-yellow-200 drop-shadow">{credits}</span>
                  </div>

                  <ThemeToggle />
                  <NotificationDropdown />
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

