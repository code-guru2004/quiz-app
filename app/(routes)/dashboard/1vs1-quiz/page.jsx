'use client';
import React, { useEffect, useState } from 'react';
import { Swords, Sword, UserPlus, ArrowRight, Zap, Check, X, Bookmark, ChevronRight, Trophy, BookOpen, Send, Search, History, CheckCircle, AlertCircle, Users } from 'lucide-react';
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
import { FiAward, FiBarChart2, FiCpu, FiHardDrive } from 'react-icons/fi';
import { LuClock, LuZap } from 'react-icons/lu';

function ChallengePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [friendList, setFriendList] = useState([]);
  const { username, allQuiz } = useGlobalContextProvider();
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [quizDrawerOpen, setQuizDrawerOpen] = useState(false); // NEW STATE
  const [selectedQuiz, setSelectedQuiz] = useState(null); // optional
  const LIMIT = 5; // Items per page
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [attendedChallenges, setAttendedChallenges] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [submittedChallengeIds, setSubmittedChallengeIds] = useState([]);
  const [animationData, setAnimationData] = useState(null);
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState('');
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [timePerQuestion, setTimePerQuestion] = useState(1);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isGetAiQuiz, setIsGetAiQuiz] = useState(false);

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
        testTopic: selectedQuiz.quizTitle || selectedQuiz.category,
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
      username: friendUsername,
      email
    }
    setFriendList(prev => [newFrind, ...prev])
  }

  async function handleGetAiQuiz(e) {
    e.preventDefault();
    setIsLoadingAI(true);

    if (!topic || !difficulty) {
      toast.error("Please select category and difficulty");
      setIsLoadingAI(false);
      return;
    }

    try {
      const resp = await axios.post('/api/get-ai-quiz', {
        category: topic,
        difficulty,
        totalQuestions,
        timePerQuestion
      });

      if (resp?.data?.quiz) {
        console.log(resp.data.quiz);
        setSelectedQuiz(resp.data.quiz);
        setIsGetAiQuiz(true)
      }
    } catch (error) {
      toast.error("Failed to generate quiz. Please try again.");
      console.error('AI quiz generation failed:', error);
    } finally {
      setIsLoadingAI(false);
      setIsGetAiQuiz(false)
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
          <DrawerContent className="p-6 max-h-[80vh]">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Select Friend</h2>
                <X
                  className="h-5 w-5 text-gray-500 cursor-pointer"
                  onClick={() => setIsDrawerOpen(false)}
                />
              </div>

              {friendList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Users className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">No friends found</p>
                  <p className="text-sm text-gray-400 mt-1">Invite friends to challenge them</p>
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-2">
                  {friendList.map((friend) => (
                    <div
                      key={friend.email}
                      className={`flex items-center p-4 rounded-lg transition-all cursor-pointer ${selectedFriend?.email === friend.email
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent'
                        }`}
                      onClick={() => {
                        setSelectedFriend(friend);
                        setQuizDrawerOpen(true);
                      }}
                    >
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-medium">
                        {friend.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">{friend.username}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{friend.email}</p>
                      </div>
                      <ChevronRight className="ml-auto h-5 w-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DrawerContent>

          {/* Quiz Selection Drawer */}
          <Drawer open={quizDrawerOpen} onOpenChange={setQuizDrawerOpen}>
            <DrawerContent className="p-6 max-h-[80vh]">
              <div className="space-y-6 ">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Select Quiz</h2>
                    {selectedFriend && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Challenging: <span className="font-medium text-indigo-600 dark:text-indigo-400">{selectedFriend.username}</span>
                      </p>
                    )}
                  </div>
                  <X
                    className="h-5 w-5 text-gray-500 cursor-pointer"
                    onClick={() => setQuizDrawerOpen(false)}
                  />
                </div>

                <Tabs defaultValue="practice-quiz" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800">
                    <TabsTrigger
                      value="live-quiz"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Live Quiz
                    </TabsTrigger>
                    <TabsTrigger
                      value="practice-quiz"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Practice Quiz
                    </TabsTrigger>
                    <TabsTrigger
                      value="ai-quiz"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700"
                    >
                      <FiCpu className="h-4 w-4 mr-2" />
                      AI Quiz
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="live-quiz" className="">
                    <div className="space-y-3 overflow-y-auto max-h-[45vh] pr-2">
                      {allQuiz
                        .filter((quiz) => quiz.quizMode === "Live Quiz")
                        .map((quiz) => (
                          <div
                            key={quiz._id}
                            className={`flex items-center p-4 rounded-lg transition-all cursor-pointer ${selectedQuiz?._id === quiz._id
                              ? 'bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent'
                              }`}
                            onClick={() => setSelectedQuiz(quiz)}
                          >
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300">
                              <Trophy className="h-5 w-5" />
                            </div>
                            <div className="ml-4 flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 dark:text-white truncate">{quiz.quizTitle}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{quiz.quizDescription}</p>
                            </div>
                            {selectedQuiz?._id === quiz._id && (
                              <Check className="h-5 w-5 text-green-500 ml-2" />
                            )}
                          </div>
                        ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="practice-quiz" className="mt-4">
                    <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-2">
                      {allQuiz
                        .filter((quiz) => quiz.quizMode === "Practice Quiz")
                        .map((quiz) => (
                          <div
                            key={quiz._id}
                            className={`flex items-center p-4 rounded-lg transition-all cursor-pointer ${selectedQuiz?._id === quiz._id
                              ? 'bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent'
                              }`}
                            onClick={() => setSelectedQuiz(quiz)}
                          >
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                              <BookOpen className="h-5 w-5" />
                            </div>
                            <div className="ml-4 flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 dark:text-white truncate">{quiz.quizTitle}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{quiz.quizDescription}</p>
                            </div>
                            {selectedQuiz?._id === quiz._id && (
                              <Check className="h-5 w-5 text-green-500 ml-2" />
                            )}
                          </div>
                        ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="ai-quiz" className="mt-4">
                    <div className="space-y-4 overflow-y-auto max-h-[44vh] pr-2">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <FiCpu className="text-blue-600 dark:text-blue-400" />
                          Generate AI Quiz
                        </h3>

                        <form className="space-y-5" onSubmit={handleGetAiQuiz}>
                          {/* Topic Input */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Topic
                            </label>
                            <input
                              type="text"
                              placeholder="Enter quiz topic (e.g., JavaScript, Machine Learning)"
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                              onChange={(e) => {
                                setTopic(e.target.value)
                                setIsGetAiQuiz(false)
                              }}
                              value={topic}
                              required
                            />
                          </div>

                          {/* Difficulty Level */}
                          <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                              <FiBarChart2 className="mr-2 w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                              Difficulty Level
                            </label>

                            <div className="grid grid-cols-3 gap-3">
                              {[
                                {
                                  level: 'easy',
                                  color: 'from-green-400 to-emerald-500',
                                  hover: 'hover:from-green-500 hover:to-emerald-600',
                                  icon: <FiAward className="w-4 h-4" />,
                                  label: 'Beginner'
                                },
                                {
                                  level: 'medium',
                                  color: 'from-amber-400 to-orange-500',
                                  hover: 'hover:from-amber-500 hover:to-orange-600',
                                  icon: <FiHardDrive className="w-4 h-4" />,
                                  label: 'Intermediate'
                                },
                                {
                                  level: 'hard',
                                  color: 'from-rose-500 to-red-600',
                                  hover: 'hover:from-rose-600 hover:to-red-700',
                                  icon: <LuZap className="w-4 h-4" />,
                                  label: 'Advanced'
                                }
                              ].map(({ level, color, hover, icon, label }) => (
                                <button
                                  type="button"
                                  key={level}
                                  onClick={() => {
                                    setDifficulty(level);
                                    setIsGetAiQuiz(false);
                                  }}
                                  className={`relative overflow-hidden group rounded-xl p-0.5 ${difficulty === level
                                    ? `bg-gradient-to-r ${color}`
                                    : 'bg-gray-200 dark:bg-gray-700'
                                    }`}
                                >
                                  <div className={`relative z-10 flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-[10px] transition-all ${difficulty === level
                                      ? 'bg-white/10 text-white'
                                      : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}>
                                    <div className={`p-2 rounded-full ${difficulty === level
                                        ? 'bg-white/20 text-white'
                                        : `bg-gradient-to-r ${color} text-white`
                                      }`}>
                                      {icon}
                                    </div>
                                    <span className={`text-sm font-medium ${difficulty === level ? 'text-white' : 'text-gray-800 dark:text-gray-200'
                                      }`}>
                                      {label}
                                    </span>
                                  </div>

                                  {/* Animated background for selected state */}
                                  {difficulty === level && (
                                    <div className="absolute inset-0 bg-gradient-to-r opacity-75 animate-pulse"></div>
                                  )}

                                  {/* Hover effect */}
                                  {difficulty !== level && (
                                    <div className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity ${color} ${hover}`}></div>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>


                          {/* Number of Questions */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Total Questions */}
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Number of Questions
                              </label>
                              <div className="flex items-center gap-4">
                                <input
                                  type="range"
                                  min={3}
                                  max={20}
                                  value={totalQuestions}
                                  onChange={(e) => {
                                    setTotalQuestions(Number(e.target.value))
                                    setIsGetAiQuiz(false)
                                  }}
                                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                />
                                <span className="text-lg font-bold text-blue-600 dark:text-blue-400 min-w-[2rem] text-center">
                                  {totalQuestions}
                                </span>
                              </div>
                            </div>

                            {/* Time per Question */}
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                <LuClock className="inline mr-2 w-4 h-4" />
                                Time per Question (min)
                              </label>
                              <div className="flex items-center gap-4">
                                <input
                                  type="range"
                                  min={0.5}
                                  max={5}
                                  step={0.5}
                                  value={timePerQuestion}
                                  onChange={(e) => {
                                    setTimePerQuestion(Number(e.target.value))
                                    setIsGetAiQuiz(false)
                                  }}
                                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                />
                                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400 min-w-[3rem] text-center">
                                  {timePerQuestion}
                                </span>
                              </div>
                            </div>
                          </div>
                          {/* Generate Button */}
                          <button
                            type="submit"
                            disabled={isLoadingAI || isGetAiQuiz}
                            className={`w-full py-3 px-6 rounded-xl font-medium text-white shadow-lg transition-all ${isLoadingAI
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl'
                              }`}
                          >
                            {isLoadingAI ? (
                              <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                              </span>
                            ) : (
                              <span className="flex items-center justify-center gap-2">
                                <LuZap className="w-5 h-5" />
                                Generate Quiz
                              </span>
                            )}
                          </button>
                        </form>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <Button
                  className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg"
                  onClick={handleCreateChallenge}
                  disabled={!selectedQuiz}
                >
                  <Send className="h-5 w-5 mr-2" />
                  Send Challenge
                </Button>
              </div>
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
          <div className="space-y-6">
            {/* Search input with modern styling */}
            <div className="relative">
              <SearchFriends friendList={friendList} onAddFriend={handleAddFriend} />

            </div>

            {/* Friends list */}
            <div className="space-y-3">
              {friendList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                  <Users className="h-10 w-10 text-gray-400 mb-3" />
                  <h4 className="text-lg font-medium text-gray-500 dark:text-gray-400">No friends yet</h4>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Add friends to start challenging them
                  </p>
                </div>
              ) : (
                friendList.map((friend) => (
                  <div
                    key={friend.email}
                    className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar with gradient */}
                      <div className="relative">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg uppercase">
                          {friend.username?.charAt(0)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
                      </div>

                      {/* User info */}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {friend.username}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                          {friend.email}
                        </p>
                      </div>
                    </div>

                    {/* Action button */}
                    <div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hidden  md:flex "
                        onClick={() => {
                          setSelectedFriend(friend);
                          setQuizDrawerOpen(true);
                        }}
                      >
                        Challenge
                        <Zap className="ml-2 h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30  md:hidden"
                        onClick={() => {
                          setSelectedFriend(friend);
                          setQuizDrawerOpen(true);
                        }}
                      >
                        <Zap className=" h-4 w-4" />
                      </Button>
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
