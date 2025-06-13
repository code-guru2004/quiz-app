"use client";

import React, { useEffect, useState } from "react";
import useGlobalContextProvider from "@/app/_context/ContextApi";
import axios from "axios";
import { FaTrophy } from "react-icons/fa";

const cupColors = ["text-yellow-400", "text-gray-400", "text-orange-500"];
const cupSizes = ["text-5xl", "text-4xl", "text-3xl"];

const LeaderboardPage = () => {
        const params = useParams();         // returns an object like { id: '12345' }
        const quizId = params.id;
    const { quizToStartObject, userEmail } = useGlobalContextProvider();
    const { selectQuizToStart } = quizToStartObject;

    const [submissions, setSubmissions] = useState([]);
    const [userRank, setUserRank] = useState(null);
    const [loading, setLoading] = useState(true);

   
    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (!quizId) return;
            try {
                const res = await axios.post("/api/submissions", { quizId });
                const sorted = res.data.submissions
                    .sort((a, b) => b.score - a.score)
                    .map((sub, idx) => ({ ...sub, rank: idx + 1 }));

                setSubmissions(sorted.slice(0, 10));

                const yourRank = sorted.find((s) => s.email === userEmail);
                if (yourRank && yourRank.rank > 10) {
                    setUserRank(yourRank);
                }
            } catch (err) {
                console.error("Error loading leaderboard:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [quizId, userEmail]);

    if (!quizId) {
        return <p className="text-center mt-10 text-red-600 font-semibold">No quiz selected</p>;
    }

    return (
        <div className="max-w-3xl mx-auto mt-10 p-4">
            <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">🏆 Quiz Leaderboard</h1>

            {loading ? (
                <p className="text-center text-gray-500">Loading leaderboard...</p>
            ) : (
                <>
                    <div className="grid grid-cols-3 gap-4 mb-8 justify-items-center">
                        {submissions.slice(0, 3).map((user, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <FaTrophy className={`${cupSizes[i]} ${cupColors[i]}`} />
                                <p className="text-lg font-semibold mt-1">{user.email.split("@")[0]}</p>
                                <p className="text-sm text-gray-500">{user.score} pts</p>
                            </div>
                        ))}
                    </div>

                    <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden text-left text-sm">
                        <thead className="bg-blue-100 text-blue-800 uppercase">
                            <tr>
                                <th className="py-3 px-4">Rank</th>
                                <th className="py-3 px-4">User</th>
                                <th className="py-3 px-4">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.slice(3).map((user) => (
                                <tr key={user.email} className="border-t hover:bg-gray-50">
                                    <td className="py-3 px-4 font-semibold text-gray-700">#{user.rank}</td>
                                    <td className="py-3 px-4">{user.email.split("@")[0]}</td>
                                    <td className="py-3 px-4">{user.score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {userRank && (
                        <div className="mt-10 p-4 border-t text-center">
                            <h3 className="text-gray-700 font-semibold mb-1">Your Rank</h3>
                            <p className="text-lg font-bold text-green-600">#{userRank.rank} — {userRank.score} pts</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default LeaderboardPage;
