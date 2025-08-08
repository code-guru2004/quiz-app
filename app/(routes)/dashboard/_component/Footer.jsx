// components/Footer.tsx

import Image from "next/image";
import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-green-100 text-green-800 py-8 border-t border-green-200 mt-auto">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand & Description */}
          <div>
            <div className=" mb-2">
                <Image
                                    src="/logo-1.png"
                                    alt="Eduprobe"
                                    width={180}
                                    height={150}
                                    placeholder="blur"
                                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAU..." // tiny base64 blur image
                                  />
            </div>
            <p className="text-sm">
              Practice, test, and level up your knowledge. Designed for students and teams.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/dashboard" className="hover:underline">Dashboard</a></li>
              <li><a href="https://job-echo-ai.vercel.app/" className="hover:underline">JobEchoAI</a></li>
              <li><a href="/" className="hover:underline">About</a></li>
              <li><a href="/contact" className="hover:underline">Contact</a></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Connect With Us</h3>
            <div className="flex space-x-4 mb-3">
              <a href="https://github.com/code-guru2004" target="_blank" rel="noopener noreferrer">
                <FaGithub className="text-xl hover:text-green-600" />
              </a>
              <a href="https://www.linkedin.com/in/nayan-das2004/" target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="text-xl hover:text-green-600" />
              </a>
              <a href="nayanhetc61@gmail.com">
                <FaEnvelope className="text-xl hover:text-green-600" />
              </a>
            </div>
            
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Quizo. All rights reserved. v-1.21.0
        </div>
      </div>
    </footer>
  );
};

export default Footer;
