// app/challenges/[id]/accept/page.jsx
"use client";

import useGlobalContextProvider from "@/app/_context/ContextApi";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";

export default function AcceptChallengePage() {
  const { id } = useParams();
  const router = useRouter();
  const { email, username } = useGlobalContextProvider();
  const [challengeData, setChallengeData] = useState(null);
  const [fromUser, setFromUser] = useState(null);
  const [toUser, setToUser] = useState(null);
  const [topic, setTopic] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchChallenge() {
      try {
        setIsLoading(true);
        const resp = await axios.get(`/api/challenge/get-challenge/${id}`);
        const respData = resp?.data;
        if (respData.success) {
          setChallengeData(respData.challenge);
          setFromUser(respData.challenge.fromUser);
          setToUser(respData.challenge.toUser);
          setTopic(respData.challenge.topic);
          setTotalQuestions(respData.challenge.questions.length);
          const hasSubmitted = respData.challenge.responses.some((resp) => resp.user === username);
          setIsSubmitted(hasSubmitted);
        } else {
          toast.error('Failed to load challenge data', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        }
      } catch (err) {
        toast.error("Failed to load challenge", {
          position: "top-right",
          autoClose: 5000,
          theme: "colored",
          transition: Bounce,
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchChallenge();
  }, [id, username]);

  const handleReject = async (challengeId) => {
    if (username !== toUser) {
      toast.error('Unauthorized Access', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }
    try {
      const resp = await axios.patch("/api/challenge/reject", { challengeId });
      if (resp.data.success) {
        setChallengeData((prev) => ({ ...prev, status: "rejected" }));
        toast.info("Challenge Rejected ❌", { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Failed to reject challenge:", error?.response?.data?.message || error.message);
      toast.error("Failed to reject challenge");
    } finally {
      router.refresh();
    }
  };

  const handleAccept = async (challengeId) => {
    if (username !== toUser) {
      toast.error('Unauthorized Access', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }
    try {
      const resp = await axios.patch(`/api/challenge/accept`, { challengeId });
      if (resp.data.success) {
        setChallengeData((prev) => ({ ...prev, status: "accepted" }));
        toast.success("Challenge Accepted ✅", { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Failed to accept challenge:", error?.response?.data?.message || error.message);
      toast.error("Failed to accept challenge");
    } finally {
      router.refresh();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Loading challenge details...</p>
      </div>
    );
  }

  if (!challengeData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Challenge Not Found</h2>
          <p className="text-gray-600 mb-6">The challenge you're looking for doesn't exist or may have been removed.</p>
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {username !== toUser ? (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
          <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center">
            <div className="text-red-500 text-5xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Unauthorized Access</h2>
            <p className="text-gray-600 mb-6">You are not allowed to view this challenge.</p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
          <div className="max-w-md w-full bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white text-center">
              <h1 className="text-2xl font-bold mb-2">You've Been Challenged! 🏆</h1>
              <p className="opacity-90">Prove your knowledge and claim victory!</p>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-center mb-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                    <span className="font-semibold text-indigo-600">{fromUser?.charAt(0) || "U"}</span>
                  </div>
                  <span className="font-medium text-gray-700">{fromUser || "Unknown User"}</span>
                </div>
                
                <div className="mx-4 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-500 font-bold">VS</span>
                  </div>
                  <div className="h-0.5 w-16 bg-gray-300 my-2"></div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-2">
                    <span className="font-semibold text-pink-600">{toUser?.charAt(0) || "Y"}</span>
                  </div>
                  <span className="font-medium text-gray-700">You</span>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500 uppercase">Topic</p>
                    <p className="font-semibold">{topic || "N/A"}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500 uppercase">Questions</p>
                    <p className="font-semibold">{totalQuestions || 0}</p>
                  </div>
                </div>
                
                <div className="mt-4 bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-xs text-gray-500 uppercase">Status</p>
                  <p className={`font-semibold ${
                    challengeData.status === "accepted" ? "text-green-600" :
                    challengeData.status === "rejected" ? "text-red-600" :
                    "text-yellow-600"
                  }`}>
                    {challengeData.status?.charAt(0).toUpperCase() + challengeData.status?.slice(1) || "Pending"}
                  </p>
                </div>
              </div>

              {username === toUser && challengeData.status === "pending" && (
                <div className="space-y-3">
                  <button
                    onClick={() => handleAccept(challengeData.challengeId)}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                  >
                    ✅ Accept Challenge
                  </button>
                  <button
                    onClick={() => handleReject(challengeData.challengeId)}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                  >
                    ❌ Reject Challenge
                  </button>
                </div>
              )}

              {username === toUser && challengeData.status === "accepted" && (
                <div className="text-center">
                  <div className="bg-green-100 text-green-700 p-4 rounded-xl mb-6">
                    <p className="font-semibold">✅ You accepted the challenge!</p>
                    <p className="text-sm mt-1">Time to show your skills!</p>
                  </div>
                  {isSubmitted ? (
                    <Link
                      href={`/challenge-result/${challengeData.challengeId}`}
                      className="inline-block w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg text-center"
                    >
                      View Results
                    </Link>
                  ) : (
                    <Link
                      href={`/challenge-quiz/${challengeData.challengeId}`}
                      className="inline-block w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg text-center"
                    >
                      Start Challenge
                    </Link>
                  )}
                </div>
              )}

              {username === toUser && challengeData.status === "rejected" && (
                <div className="text-center">
                  <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6">
                    <p className="font-semibold">❌ You rejected the challenge.</p>
                    <p className="text-sm mt-1">Maybe next time!</p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="inline-block w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg text-center"
                  >
                    Return to Dashboard
                  </Link>
                </div>
              )}

              <p className="text-xs text-gray-400 mt-6 text-center">
                By accepting, you'll be redirected to the challenge quiz.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}