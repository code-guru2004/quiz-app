"use client"; // Required for Next.js App Router

import { useState } from "react";
import Link from "next/link";
import { ShieldUser } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-teal-600 font-bold text-xl">
            Admin Panel
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 text-gray-700">
          <NavItem href="#">Dashboard</NavItem>
            <NavItem href="#">Quizes</NavItem>
            <NavItem href="#">New Quiz</NavItem>
          </nav>

          {/* Admin Page Button */}
          <p
            className="hidden  bg-teal-600 text-white px-5 py-2.5 md:flex gap-2 rounded-md shadow hover:bg-teal-700"
          >
            <ShieldUser />
            Admin Page
          </p>

          {/* Mobile Menu Button */}
         
          <button
            className="md:hidden text-gray-600 hover:text-gray-800"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <nav className="md:hidden mt-2 space-y-2 bg-gray-50 p-4 rounded-md">
            
            <NavItem href="#">Dashboard</NavItem>
            <NavItem href="#">Quizes</NavItem>
            <NavItem href="#">New Quiz</NavItem>

           
          </nav>
        )}
      </div>
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
