"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { RiMailForbidFill } from "react-icons/ri";

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check system preference for dark mode
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);
    
    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleUnsubscribe = async () => {
    if (!token) {
      setMessage("Invalid link. No token provided.");
      setStatus("error");
      return;
    }

    try {
      setStatus("loading");
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "You have been unsubscribed successfully.");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to unsubscribe. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className={`w-full max-w-md mx-auto p-8 rounded-xl shadow-lg transition-all duration-300 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
        <div className="text-center mb-6">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${isDarkMode ? "bg-red-900/20" : "bg-red-100"}`}>
          <RiMailForbidFill className="size-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mt-4">Email Unsubscribe</h1>
        </div>

        {/* Warning Message */}
        <div className={`p-4 rounded-lg mb-6 ${isDarkMode ? "bg-amber-900/20 border border-amber-700" : "bg-amber-50 border border-amber-200"}`}>
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              <strong>Note:</strong> By unsubscribing, you will no longer receive any contest notifications, including updates about latest contests and important announcements.
            </p>
          </div>
        </div>

        {status === "idle" && (
          <>
            <p className={`mb-6 text-center ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              Are you sure you want to unsubscribe from our contest notification emails?
            </p>
            <button
              onClick={handleUnsubscribe}
              disabled={!token || status === "loading"}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${
                !token || status === "loading" 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400" 
                  : "bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300 dark:bg-red-700 dark:hover:bg-red-600"
              }`}
            >
              {status === "loading" ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Unsubscribing...
                </>
              ) : (
                "Unsubscribe🚫"
              )}
            </button>
          </>
        )}
        
        {(status === "success" || status === "error") && (
          <div className={`p-4 rounded-lg text-center ${status === "success" ? (isDarkMode ? "bg-green-900/20 text-green-400" : "bg-green-50 text-green-700") : (isDarkMode ? "bg-red-900/20 text-red-400" : "bg-red-50 text-red-700")}`}>
            <div className="flex flex-col items-center">
              {status === "success" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <p className="font-medium">{message}</p>
            </div>
          </div>
        )}
        
        <div className={`mt-6 pt-6 border-t text-center text-sm ${isDarkMode ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"}`}>
          <p>If you change your mind, you can resubscribe anytime through your account settings.</p>
        </div>
      </div>
    </div>
  );
}