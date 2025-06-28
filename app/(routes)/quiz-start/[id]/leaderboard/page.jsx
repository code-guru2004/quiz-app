"use client";

import React, { useEffect, useState } from "react";
import useGlobalContextProvider from "@/app/_context/ContextApi";
import axios from "axios";
import { FaTrophy } from "react-icons/fa";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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

  if (!quizId) {
    return <p className="text-center mt-10 text-red-600 font-semibold">No quiz selected</p>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-2 p-4">
      <div className="relative">
        <Link href={"/dashboard"} className="absolute -left-3 p-2 bg-green-200 dark:bg-green-700 rounded-full hover:bg-green-300 dark:hover:bg-green-600 transition-all">
          <ArrowLeft />
        </Link>
        <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-300 mb-8">
          🏆 Quiz Leaderboard
        </h1>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-300">Loading leaderboard...</p>
      ) : (
        <>
          {/* Podium Display */}
          <div className="grid grid-cols-3 gap-4 mb-8 justify-center items-center">
            {topTen.slice(0, 3).map((user, i) => (
              <div key={i} className="flex flex-col items-center">
                <FaTrophy className={`${cupSizes[i]} ${cupColors[i]}`} />
                <p className="text-lg font-semibold mt-1 text-gray-800 dark:text-gray-100">
                  {user.email.split("@")[0]}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.score} pts</p>
              </div>
            ))}
          </div>

          {/* Top 10 Leaderboard Table */}
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden text-left text-sm">
              <thead className="bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 uppercase">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4 text-center">Score</th>
                </tr>
              </thead>
              <tbody>
                {topTen.map((user) => (
                  <tr
                    key={user.email}
                    className={`border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 ${user.email === email ? "bg-green-100 dark:bg-green-800 font-bold text-green-700 dark:text-green-300" : ""
                      }`}
                  >
                    <td className="py-3 px-4">#{user.rank}</td>
                    <td className="py-3 px-4">
                      <Link href={`/profile/${user.username}`} className="hover:underline">
                        {user.username}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-center">{user.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Show user rank if not in top 10 */}
          {userRank && userRank.rank > 10 && (
            <div className="mt-10 py-3 px-3 border-t border-gray-300 dark:border-gray-600 text-center flex items-center justify-between bg-amber-200 dark:bg-yellow-900 rounded-md">
              <p className="text-lg font-bold text-green-600 dark:text-green-300">
                #{userRank.rank}
              </p>
              <p className="pr-[7%] md:pr-[9%] text-gray-800 dark:text-gray-200">
                {userRank.score} pts
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LeaderboardPage;
