'use client';
import React, { useEffect, useState } from 'react';
import { Swords, Sword, UserPlus, ArrowRight, Zap, Check, X, Bookmark } from 'lucide-react';
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
  const [submittedChallengeIds, setSubmittedChallengeIds] = useState([]);
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
      // Step 1: Create the challenge
      const challengeRes = await axios.post('/api/create-challenge', {
        sender: username,
        opponent: selectedFriend.username,
        testTopic: selectedQuiz.quizTitle,
        questions: selectedQuiz.quizQuestions, // must match your schema
      });
      if (challengeRes.data.success && challengeRes.data.challengeId) {
        setAttendedChallenges(prev => [
          challengeRes.data.newChallenge,
          ...prev
        ])
        // Step 2: Notify the opponent (optional, based on your app logic)
        const notifyRes = await handleNotify(
          selectedFriend.username,
          challengeRes.data.challengeId
        );
        if (notifyRes?.data?.success && notifyRes?.data?.newChallenge) {
          toast.success(`Challenge sent to ${selectedFriend.username} for ${selectedQuiz.quizTitle}`);

          setSelectedFriend(null);
          setSelectedQuiz(null);
        } else {
          // Fallback: Challenge created, but notify failed
          toast.success(`Challenge created for ${selectedFriend.username}, but notification failed.`);
        }
      } else {
        toast.error("Challenge creation failed.");
      }
    } catch (err) {
      console.error("Challenge Error:", err);
      toast.error("Failed to create challenge.");
    } finally {
      setQuizDrawerOpen(false)
      setIsDrawerOpen(false); // close outer drawer
    }
  };

  useEffect(() => {
    const submittedIds = attendedChallenges
      .filter((challenge) =>
        challenge.responses?.some(
          (res) => res.user === username && res.submittedAt
        )
      )
      .map((c) => c.challengeId);
    //console.log(submittedIds);

    setSubmittedChallengeIds(submittedIds);
  }, [attendedChallenges, username]);


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
        console.log(data);

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
  // handle reject finction
  const handleReject = async (challengeId) => {
    try {
      const resp = await axios.patch("/api/challenge/reject", { challengeId });
      // console.log(resp.data.message);
      setAttendedChallenges(prev =>
        prev.map(c =>
          c.challengeId === challengeId ? { ...c, status: 'reject' } : c
        )
      );
      router.refresh()
    } catch (error) {
      console.error("Failed to reject challenge:", error?.response?.data?.message || error.message);
    } finally {
      router.refresh();
    }
  };
  // handle accept
  const handleAccept = async (challengeId) => {
    try {
      const resp = await axios.patch(`/api/challenge/accept`, { challengeId });
      setAttendedChallenges(prev =>
        prev.map(c =>
          c.challengeId === challengeId ? { ...c, status: 'accepted' } : c
        )
      );
      router.refresh()
    } catch (error) {
      console.error("Failed to accept challenge:", error?.response?.data?.message || error.message);
    }
  }

  const handleAddFriend = (friendUsername, email) => {
    //console.log("friendUsername,email" + friendUsername + " ", email)
    const newFrind = {
      username : friendUsername,
      email
    }
    setFriendList(prev => [newFrind, ...prev])
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
      <h1 className="flex justify-center items-center text-2xl font-bold mb-6 bg-gradient-to-l from-blue-500 via-teal-500 to-green-500 text-transparent bg-clip-text">
        <Swords className="mr-2 text-green-600" /> 1 v/s 1 Challenge Arena
      </h1>

      <Tabs defaultValue="challenge" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-4">
          <TabsTrigger value="challenge">⚔️ Challenge Quiz</TabsTrigger>
          <TabsTrigger value="friends">👥 Friends</TabsTrigger>
        </TabsList>

        <Drawer open={isDrawerOpen} onOpenChange={() => {
          setIsDrawerOpen(prev => !prev)
          setSelectedFriend(null)
          setSelectedQuiz(null)
        }}>
          {/* Friend Selection Drawer */}
          <DrawerContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Select a Friend</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto my-4 py-3">
              {
                friendList.length === 0 && (
                  <div>
                    No friends found
                  </div>
                )
              }
              {friendList.length > 0 && friendList.map((friend) => (
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

              {attendedChallenges.filter(ch => ch.status !== "reject").map((ch) => {
                const opponent = ch.fromUser === username ? ch.toUser : ch.fromUser;
                const yourResponse = ch.responses.find((r) => r.user === username);
                const isAccepted = ch.status === "accepted";
                const isSubmitted = submittedChallengeIds.includes(ch.challengeId);

                return (
                  <div key={ch.challengeId} className="group relative">
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 overflow-hidden">
                      {/* Status ribbon */}
                      <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-semibold rounded-bl-lg rounded-tr-2xl ${ch.status === "pending"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : ch.status === "accepted"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-gray-500/10 text-gray-600 dark:text-gray-400"
                        }`}>
                        {ch.status.charAt(0).toUpperCase() + ch.status.slice(1)}
                      </div>

                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                            Challenge vs <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{opponent}</span>
                          </h3>

                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Created: {new Date(ch.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                          <div className="flex items-center gap-2  text-sm mt-2">
                            <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 px-2.5 py-1 rounded-full flex items-center text-xs">
                              <Bookmark className="w-3 h-3 mr-1.5" />
                              {ch.topic}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Your Score</p>
                          <p className="text-lg font-semibold text-gray-800 dark:text-white">
                            {yourResponse?.score ?? (
                              <span className="text-gray-400 dark:text-gray-500">--</span>
                            )}
                          </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
                          <p className="text-lg font-semibold capitalize text-gray-800 dark:text-white">
                            {isSubmitted ? "Completed" : ch.status}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-3">
                        {isAccepted && (
                          <button
                            onClick={() => {
                              if (isSubmitted) {
                                router.push(`/challenge-result/${ch.challengeId}`);
                              } else {
                                router.push(`/challenge-quiz/${ch.challengeId}`);
                              }
                            }}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center ${isSubmitted
                              ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                              : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md"
                              }`}
                          >
                            {isSubmitted ? (
                              <>
                                View Results
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </>
                            ) : (
                              <>
                                Attend Now
                                <Zap className="w-4 h-4 ml-2 fill-white" />
                              </>
                            )}
                          </button>
                        )}

                        {ch.status === "pending" && ch.toUser === username && (
                          <>
                            <button
                              onClick={() => handleAccept(ch?.challengeId)}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center"
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Accept
                            </button>
                            <button
                              onClick={() => handleReject(ch?.challengeId)}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Decline
                            </button>
                          </>
                        )}
                      </div>

                      {/* Hover effect border */}
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-400/20 rounded-xl pointer-events-none transition-all duration-300"></div>
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
            <SearchFriends friendList={friendList} onAddFriend={handleAddFriend} />

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
