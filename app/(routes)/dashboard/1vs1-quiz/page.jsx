'use client';
import React, { useEffect, useState } from 'react';
import { Swords, Sword, UserPlus } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import toast from 'react-hot-toast';
import SearchFriends from '../_component/SearchFriends';
import useGlobalContextProvider from '@/app/_context/ContextApi';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Lottie from 'lottie-react';
import { GiBattleGear } from "react-icons/gi";

function ChallengePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [friendList, setFriendList] = useState([]);
  const { username, allQuiz } = useGlobalContextProvider();
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [quizDrawerOpen, setQuizDrawerOpen] = useState(false); // NEW STATE
  const [selectedQuiz, setSelectedQuiz] = useState(null); // optional
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [timePerQuestion, setTimePerQuestion] = useState(1);
  const LIMIT = 5; // Items per page
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [attendedChallenges, setAttendedChallenges] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    const loadAnimation = async () => {
      const res = await fetch('/assets/game-loading.json');
      const data = await res.json();
      setAnimationData(data);
    };

    loadAnimation();
  }, []);

  useEffect(() => {
    const fetchUserData = async (username) => {
      try {
        const res = await fetch(`/api/get-user?username=${username}`);
        const data = await res.json();
        setFriendList(data.userData.friendList);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      setIsLoading(true);
      fetchUserData(username);
    }
  }, [username]);



  const handleCreateChallenge = async () => {
    if (!selectedFriend || !selectedQuiz) {
      toast.error("Please select a friend and a quiz");
      return;
    }

    try {
      const challengeRes = await axios.post('/api/create-challenge', {
        sender: username,
        opponent: selectedFriend.username,
        questions: selectedQuiz?.quizQuestions, // 👈 this must match the Challenge schema
      });


      //const challengeData = await challengeRes.json();
      console.log("Challenge API response:", challengeRes.data.challengeId);
      if (challengeRes.data.success) {
        const resp = await handleNotify(selectedFriend.username, challengeRes.data.challengeId);
        if (resp) {
          toast.success(`Challenge sent to ${selectedFriend.username} for ${selectedQuiz.quizTitle}`);
          setSelectedFriend(null);
          setSelectedQuiz(null);
          setQuizDrawerOpen(false);
        } else {
          toast.error("Challenge creation failed.");
        }
      }
    } catch (err) {
      console.error("Challenge Error:", err);
      toast.error("Failed to create challenge.");
    }finally{
      setIsDrawerOpen(false)
    }
  };



  const handleNotify = async (opponentUsername, challengeId) => {
    try {
      const res = await fetch('/api/notify-opponent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: username,
          opponent: opponentUsername,
          challengeId
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Challenge sent to ${opponentUsername}!`);
        return true;
      }
    } catch (err) {
      console.error('Challenge Error:', err);
      toast.error("Failed to send challenge.");
      return false;
    }
  };

  useEffect(() => {
    const fetchAttended = async () => {
      try {
        const res = await fetch(
          `/api/challenge/attended?user=${username}&page=${page}&limit=${LIMIT}`
        );
        const data = await res.json();
        if (data.success) {
          setAttendedChallenges(data.challenges);
          setTotalPages(Math.ceil(data.total / LIMIT));
        }
      } catch (err) {
        console.error("Failed to load attended challenges:", err);
      }
    };

    if (username) {
      fetchAttended();
    }
  }, [username, page]);
  async function handleGetAiQuiz(e) {
    e.preventDefault(); // Prevent page reload
    setIsLoading(true)

    if (category === "" || difficulty === "") {
      toast.error("Fill all options.");
      setIsLoading(false)
      return;
    }
    try {
      const resp = await axios.post('/api/get-ai-quiz', {
        category,
        difficulty,
        totalQuestions,
        timePerQuestion
      });

      if (resp?.data?.quiz) {
        console.log(resp.data.quiz);

        setAiQuiz(resp.data.quiz);

      }
    } catch (error) {
      console.error('AI quiz generation failed:', error);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-xl font-semibold">
        <Lottie animationData={animationData} loop autoplay className="w-96 h-96" />
      </div>
    );
  }

  

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="flex justify-center items-center text-2xl font-bold mb-6">
        <Swords className="mr-2" /> 1 v/s 1 Challenge Arena
      </h1>

      <Tabs defaultValue="challenge" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-4">
          <TabsTrigger value="challenge">⚔️ Challenge Quiz</TabsTrigger>
          <TabsTrigger value="friends">👥 Friends</TabsTrigger>
        </TabsList>

        <Drawer open={isDrawerOpen} onOpenChange={() =>{ 
          setIsDrawerOpen(prev => !prev)
          setSelectedFriend(null)
          setSelectedQuiz(null)
          }}>
          {/* Friend Selection Drawer */}
          <DrawerContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Select a Friend</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto my-4 py-3">
              {friendList.map((friend) => (
                <div
                  key={friend.email}
                  className={`cursor-pointer p-3 rounded border transition ${selectedFriend?.email === friend.email
                    ? 'bg-green-300 border-green-500 text-green-900 font-bold'
                    : 'hover:bg-green-200 hover:text-black'
                    }`}
                  onClick={() => {
                    setSelectedFriend(friend);
                    setQuizDrawerOpen(true);
                  }}
                >
                  {friend.username}
                </div>
              ))}
            </div>
          </DrawerContent>

          {/* Quiz Selection Drawer */}
          <Drawer open={quizDrawerOpen} onOpenChange={setQuizDrawerOpen}>
            
            <DrawerContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Select a Quiz</h2>

              <Tabs defaultValue="practice-quiz" className="w-full h-1/2 overflow-y-auto">
                <TabsList>
                  <TabsTrigger value="live-quiz">Live Quiz</TabsTrigger>
                  <TabsTrigger value="practice-quiz">Practice Quiz</TabsTrigger>
                </TabsList>

                <TabsContent value="live-quiz">
                  <div className="space-y-2">
                    {allQuiz
                      .filter((quiz) => quiz.quizMode === "Live Quiz")
                      .map((quiz, index) => (
                        <div
                          key={index}
                          className={`cursor-pointer p-3 rounded border transition ${selectedQuiz === quiz
                            ? 'bg-purple-400 border-purple-500'
                            : 'hover:bg-gray-200 dark:hover:bg-purple-200 hover:text-black '
                            }`}
                          onClick={() => setSelectedQuiz(quiz)}
                        >
                          {quiz.quizTitle}
                        </div>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="practice-quiz">
                  <div className="space-y-2">
                    {allQuiz
                      .filter((quiz) => quiz.quizMode === "Practice Quiz")
                      .map((quiz, index) => (
                        <div
                          key={index}
                          className={`cursor-pointer p-3 rounded border transition ${selectedQuiz === quiz
                            ? 'bg-purple-400 border-purple-500'
                            : 'hover:bg-gray-200 dark:hover:bg-purple-200 hover:text-black '
                            }`}
                          onClick={() => setSelectedQuiz(quiz)}
                        >
                          {quiz.quizTitle}
                        </div>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white mt-4"
                onClick={handleCreateChallenge}
              >
                Send Challenge
              </Button>
            </DrawerContent>
          </Drawer>
        </Drawer>
        {/* CHALLENGE TAB */}
        <TabsContent value="challenge">
          {attendedChallenges.length === 0 ? (
            <>
              <button onClick={() => setIsDrawerOpen(true)} className="bg-emerald-950 text-emerald-400 border border-emerald-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
                <span className="bg-emerald-400 shadow-emerald-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]" />
                Challenge +
              </button>
              <p className="text-center text-gray-500 mt-7">No challenge found😕</p>
            </>
          ) : (
            <div className="space-y-6">
              <button onClick={() => setIsDrawerOpen(true)} className="bg-emerald-950 text-emerald-400 border border-emerald-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
                <span className="bg-emerald-400 shadow-emerald-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]" />
                Challenge +
              </button>
              {/* Challenge Drawer */}
              <div className="mb-6 p-4 rounded-xl bg-purple-50 dark:bg-gray-900 border border-purple-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-2">
                  💡Challenge Status Guide
                </h2>
                <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                  <li>
                    <span className="font-medium text-yellow-600">Pending</span>: You have sent or received a challenge, but the opponent hasn’t accepted it yet.
                  </li>
                  <li>
                    <span className="font-medium text-green-600">Accepted</span>: The opponent has accepted the challenge. You can now attend the quiz.
                  </li>
                </ul>
              </div>
              {/* Attended Challenges List */}

              {attendedChallenges.map((ch) => {
                const opponent = ch.fromUser === username ? ch.toUser : ch.fromUser;
                const yourResponse = ch.responses.find((r) => r.user === username);
                const isAccepted = ch.status === "accepted";

                return (
                  <div
                    key={ch.challengeId}
                    className="bg-white dark:bg-gray-800 border dark:border-gray-700 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-5"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                        Challenge vs <span className="text-purple-600">{opponent}</span>
                      </h3>
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${ch.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : ch.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-200 text-gray-700"
                          }`}
                      >
                        {ch.status}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1 mb-4">
                      <p>
                        <strong>Your Score:</strong>{" "}
                        {yourResponse?.score ?? "Not submitted"}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(ch.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <button
                        className={`px-4 py-1.5 rounded-lg text-white font-medium transition ${isAccepted
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-gray-400 cursor-not-allowed"
                          }`}
                        disabled={!isAccepted}
                        onClick={() => {
                          if (isAccepted) {
                            router.push(`/challenge-quiz/${ch.challengeId}`);
                          }
                        }}
                      >
                        Attend Quiz
                      </button>
                      {ch.status === "pending" && ch.toUser === username && (
                        <Button
                          className="bg-green-600 hover:bg-green-700 text-white ml-2"
                          onClick={() => router.push(`/dashboard/Challenge/${ch?.challengeId}`)}
                        >
                          Accept Challenge
                        </Button>
                      )}

                    </div>
                  </div>
                );
              })}
              {/* Pagination Controls */}
              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  variant="outline"
                  className="px-4 py-2"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </Button>

                <span className="text-sm text-gray-700 dark:text-gray-200">
                  Page {page} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  className="px-4 py-2"
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                >
                  Next
                </Button>
              </div>

            </div>

          )}
        </TabsContent>

        {/* FRIEND TAB */}
        <TabsContent value="friends">
          <div className="space-y-4">
            {/* Search input */}
            <SearchFriends friendList={friendList} />

            {/* Friends list */}
            <div className="space-y-2">
              {friendList.length === 0 ? (
                <p className="text-center text-gray-500 italic">No friends yet</p>
              ) : (
                friendList.map((friend, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar placeholder */}
                      <div className="w-10 h-10 rounded-full bg-purple-200 text-purple-800 font-bold flex items-center justify-center uppercase">
                        {friend.username?.charAt(0)}
                      </div>

                      {/* Username */}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {friend.username}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{friend.email}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ChallengePage;
