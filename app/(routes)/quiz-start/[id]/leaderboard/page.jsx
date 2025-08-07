"use client";

import React, { useEffect, useState } from "react";
import useGlobalContextProvider from "@/app/_context/ContextApi";
import axios from "axios";
import { FaTrophy, FaCrown } from "react-icons/fa";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FaRankingStar } from "react-icons/fa6";
import { IoMdMedal } from "react-icons/io";
import { Skeleton } from "@/components/ui/skeleton";

const cupColors = ["text-yellow-400", "text-gray-400", "text-orange-500"];
const cupSizes = ["text-5xl", "text-4xl", "text-3xl"];

const LeaderboardPage = () => {
  const params = useParams();
  const quizId = params.id;

  const { quizToStartObject, email, username } = useGlobalContextProvider();
  const { selectQuizToStart } = quizToStartObject;

  const [allSubmissions, setAllSubmissions] = useState([]);
  const [topTen, setTopTen] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [yourRankNo, setYourRankNo] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!quizId) return;
      try {
        const res = await axios.post("/api/submissions", { quizId });
        const sorted = res.data.submissions
          .sort((a, b) => b.score - a.score)
          .map((sub, idx) => ({ ...sub, rank: idx + 1 }));

        setAllSubmissions(sorted);
        const index = sorted.findIndex((s) => s.email === email);
        if (index !== -1) {
          setYourRankNo(index + 1);
          await axios.patch("/api/save-rank", { quizId, rank: index + 1, email });
        }

        setTopTen(sorted.slice(0, 10));
        const yourRank = sorted.find((s) => s.email === email);
        if (yourRank) setUserRank(yourRank);
      } catch (err) {
        console.error("Error loading leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [quizId, email]);

  function showRank(rank) {
    if (rank === 1) {
      return <FaCrown className="text-yellow-400 text-xl" />;
    } else if (rank === 2) {
      return <IoMdMedal className="text-gray-400 text-xl" />;
    } else if (rank === 3) {
      return <IoMdMedal className="text-amber-600 text-xl" />;
    } else {
      return <span className="text-gray-600 dark:text-gray-300">{rank}</span>;
    }
  }

  if (!quizId) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-400 p-4 rounded">
          <p className="text-red-700 dark:text-red-300 font-medium">
            No quiz selected
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 relative">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-14 ">
        <Link
          href="/dashboard"
          className="group flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors z-50"
        >
          <ArrowLeft className="w-5 h-5 transform transition-transform duration-200 group-hover:-translate-x-1" />
          <span className="hidden sm:inline">Back to Dashboard</span>
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 w-full absolute">
          {/* <FaRankingStar className="size-7 text-white" /> */}
          Leaderboard
        </h1>

        <div className="w-8"></div> {/* Spacer for alignment */}
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-4 w-24 mt-2" />
                <Skeleton className="h-3 w-12 mt-1" />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Podium Display */}
          <div className="grid grid-cols-3 gap-4 mb-10 items-end">
            {topTen.slice(0, 3).map((user, i) => (
              <div
                key={i}
                className={`flex flex-col items-center ${i === 0 ? "order-2" : i === 1 ? "order-1" : "order-3"}`}
              >
                <div className={`relative w-full flex flex-col items-center ${i === 0 ? "h-40" : i === 1 ? "h-32" : "h-24"} bg-gradient-to-b ${i === 0 ? "from-yellow-300 to-yellow-100 dark:from-yellow-600 dark:to-yellow-800" : i === 1 ? "from-gray-300 to-gray-100 dark:from-gray-500 dark:to-gray-700" : "from-[#cd7f32] to-[#b87333] dark:from-[#a97142] dark:to-[#8c5a2b]"} rounded-t-lg shadow-lg`}>
                  <div className="absolute -top-6">
                    <FaTrophy className={`${cupSizes[i]} ${cupColors[i]} drop-shadow-md`} />
                  </div>
                  <div className="mt-auto mb-4 text-center">
                    <p className="font-bold text-gray-900 dark:text-white truncate w-full px-2">
                      {user.username || user.email.split("@")[0]}
                    </p>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {user.score} pts
                    </p>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-b-lg"></div>
              </div>
            ))}
          </div>

          {/* Leaderboard Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="grid grid-cols-12 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white p-4 font-semibold">
              <div className="col-span-1 text-center">Rank</div>
              <div className="col-span-8 md:col-span-9">User</div>
              <div className="col-span-3 md:col-span-2 text-right pr-4">Score</div>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {topTen.map((user) => (
                <div
                  key={user.email}
                  className={`grid grid-cols-12 items-center p-4 transition-all ${user.email === email ? "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500" : "hover:bg-gray-50 dark:hover:bg-gray-700/50"}`}
                >
                  <div className="col-span-1 flex justify-center">
                    {showRank(user.rank)}
                  </div>
                  <div className="col-span-8 md:col-span-9 flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${user.rank === 1 ? "bg-yellow-100 dark:bg-yellow-900/50" : user.rank === 2 ? "bg-gray-100 dark:bg-gray-700" : user.rank === 3 ? "bg-orange-100 dark:bg-orange-900/50" : "bg-blue-100 dark:bg-blue-900/50"} mr-3`}>
                      <span className={`text-sm font-medium ${user.rank <= 3 ? "text-gray-900 dark:text-white" : "text-blue-600 dark:text-blue-300"}`}>
                        {user.rank}
                      </span>
                    </div>
                    <Link
                      href={`/profile/${user.username}`}
                      className="font-medium text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 truncate"
                    >
                      {user.username || user.email.split("@")[0]}{user.email === email && " (You)"}
                    </Link>
                  </div>
                  <div className="col-span-3 md:col-span-2 text-right pr-4">
                    <span className="font-semibold text-gray-700 dark:text-gray-200">
                      {user.score}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current User Rank (if not in top 10) */}
          {userRank && userRank.rank > 10 && (
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg border border-blue-200 dark:border-blue-800/50 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center mr-4">
                    <span className="text-white font-bold">{userRank.rank}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">Your Ranking</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{userRank.username || userRank.email.split("@")[0]}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{userRank.score} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">pts</span></p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LeaderboardPage;