// app/challenges/[id]/accept/page.jsx
"use client";

import useGlobalContextProvider from "@/app/_context/ContextApi";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";

export default function AcceptChallengePage() {
  const { id } = useParams();
  const router = useRouter();
  const {email} = useGlobalContextProvider();
  const [challengeData, setChallengeData] = useState(null);
  const [fromUser, setFromUser] = useState(null);
  const [toUser, setToUser] = useState(null);
  const [topic, setTopic] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(null);

  useEffect(() => {
    async function fetchChallenge() {
      try {
        const resp = await axios.get(`/api/challenge/get-challenge/${id}`);
        const respData = resp?.data;
        if (respData.success && respData.challenge) {
          setChallengeData(respData.challenge);
          setFromUser(respData.challenge.fromUser);
          setToUser(respData.challenge.toUser);
          setTopic(respData.challenge.topic);
          setTotalQuestions(respData.challenge.questions.length);
        } else {
          toast.error("Challenge not found", {
            position: "top-right",
            autoClose: 5000,
            theme: "colored",
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
      }
    }
    fetchChallenge();
  }, [id]);

  const handleReject = async (challengeId) => {
    if(email !== toUser){
      toast('Unauthorized Access', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
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
    } finally {
      router.refresh();
    }
  };

  const handleAccept = async (challengeId) => {
    if(email !== toUser){
      toast('Unauthorized Access', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
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
    } finally {
      router.refresh();
    }
  };

  if (!challengeData) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading challenge...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">You’ve been challenged! 🏆</h1>

        <p className="text-gray-600 mb-4">
          <span className="font-semibold text-indigo-600">{fromUser || "Unknown User"}</span>{" "}
          has challenged{" "}
          <span className="font-semibold text-pink-600">{toUser || "You"}</span> to a quiz!
        </p>

        <div className="bg-gray-50 p-4 rounded-xl mb-6 text-sm text-gray-700">
          <p>
            <span className="font-semibold">Topic:</span> {topic || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Questions:</span> {totalQuestions || 0}
          </p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`${
                challengeData.status === "accepted"
                  ? "text-green-600"
                  : challengeData.status === "rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              } font-semibold`}
            >
              {challengeData.status || "pending"}
            </span>
          </p>
        </div>

        {challengeData.status === "pending" && (
          <div className="space-y-3">
            <button
              onClick={() => handleReject(challengeData._id)}
              className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition"
            >
              Reject Challenge
            </button>
            <button
              onClick={() => handleAccept(challengeData._id)}
              className="w-full py-3 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition"
            >
              Accept Challenge
            </button>
          </div>
        )}

        {challengeData.status === "accepted" && (
          <p className="text-green-600 font-semibold mt-4">✅ You accepted the challenge!</p>
        )}

        {challengeData.status === "rejected" && (
          <p className="text-red-600 font-semibold mt-4">❌ You rejected the challenge.</p>
        )}

        <p className="text-xs text-gray-400 mt-6">
          By accepting, you’ll be redirected to the challenge quiz.
        </p>
      </div>
    </div>
  );
}
