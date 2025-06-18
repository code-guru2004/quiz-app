"use client"; // This component runs on the client side

import Head from 'next/head';
import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-800 to-green-900 text-white flex flex-col items-center justify-center font-inter relative overflow-hidden p-4">
      <Head>
        <title>404 - Page Not Found</title>
        <meta name="description" content="Oops! The page you're looking for doesn't exist." />
      </Head>

      {/* Background stars / particles */}
      <div className="absolute inset-0 z-0 opacity-50">
        <div className="star star-1"></div>
        <div className="star star-2"></div>
        <div className="star star-3"></div>
        <div className="star star-4"></div>
        <div className="star star-5"></div>
      </div>

      <div className="z-10 text-center space-y-6">
        <div className="text-8xl md:text-9xl font-extrabold text-emerald-300 animate-pulse-slow">
          404
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-teal-200">
          Lost in the Digital Cosmos?
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-80">
          It looks like the page you were searching for has ventured off into uncharted digital territory.
          Perhaps it's on a coffee break.
        </p>

        {/* Optional: A small "lost object" icon or animation */}
        <div className="relative w-32 h-32 mx-auto mt-8 animate-spin-slow">
          {/* Simple SVG for a "lost" icon - could be a broken link, a question mark, etc. */}
          <svg className="w-full h-full text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        </div>


        <Link href="/" className="inline-block px-8 py-4 bg-emerald-500 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-emerald-600 transform hover:scale-105 transition-all duration-300">
          Return to Basecamp
        </Link>
      </div>

      {/* Global styles for animations - add these to your global CSS file (e.g., globals.css) */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.98); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Starfield effect */
        .star {
          position: absolute;
          background-color: white;
          border-radius: 50%;
          animation: twinkle 5s infinite;
        }
        .star-1 {
          width: 2px; height: 2px;
          top: 10%; left: 20%;
          animation-delay: 0s;
        }
        .star-2 {
          width: 3px; height: 3px;
          top: 50%; left: 70%;
          animation-delay: 1s;
        }
        .star-3 {
          width: 2.5px; height: 2.5px;
          top: 80%; left: 40%;
          animation-delay: 2s;
        }
        .star-4 {
          width: 1.5px; height: 1.5px;
          top: 30%; left: 90%;
          animation-delay: 3s;
        }
        .star-5 {
          width: 4px; height: 4px;
          top: 5%; left: 60%;
          animation-delay: 4s;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
}