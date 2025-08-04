"use client";
import useGlobalContextProvider from "@/app/_context/ContextApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { redirect, useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

function QuizStartQuestions({ timeLeft, setTimeLeft, isForceSubmit }) {
  const params = useParams();
  const quizId = params.id;
  const prefixes = ["A", "B", "C", "D", "E"];
  const { quizToStartObject, email } = useGlobalContextProvider();
  const { selectQuizToStart } = quizToStartObject;
  const { quizQuestions } = selectQuizToStart;

  const [currQuizIndex, setCurrQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [questionTimes, setQuestionTimes] = useState([]);
  const [totaltime, setTotaltime] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState(Array(quizQuestions.length).fill(null));
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const [reviewQues, setReviewQues] = useState([]);
  const [isCurrQuizMarked, setIsCurrQuizMarked] = useState(false);
  const [allUserAnswers, setAllUserAnswers] = useState([]);
  const [wantSubmitted, setWantSubmitted] = useState(false);
  const router = useRouter();

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizCompleted) {
      handleSubmit();
      toast.success("Successfully completed!", { icon: "👏" });
      setQuizCompleted(true);
    }
  }, [timeLeft, quizCompleted]);

  useEffect(() => {
    const isMarked = reviewQues.includes(currQuizIndex);
    setIsCurrQuizMarked(isMarked);

    setTimeSpent(0);
    const interval = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [currQuizIndex, reviewQues]);

  useEffect(()=>{
    if(isForceSubmit){
      alert("Suspicious activity detected. Your test has been automatically submitted.");
      handleSubmit()
      setQuizCompleted(true)
    }
    
  },[isForceSubmit])

  const handleConfirmSubmission = () => {
    setWantSubmitted(true);
  };

  const handleNext = () => {
    const isLastQuestion = currQuizIndex === quizQuestions.length - 1;
    if (!isLastQuestion && timeLeft > 0) {
      setCurrQuizIndex((prev) => prev + 1);
    }
  };

  function calculateScore() {
    let score = 0;
    const length = allUserAnswers.length
    for (let i = 0; i < length; i++) {
      const data = allUserAnswers[i]
      const { questionId, selectedOption, index } = data
      const actualQuizData = quizQuestions[index].correctAnswer
      console.log(selectedOption+"--->"+actualQuizData);
      
      if (selectedOption === actualQuizData) {
        score = score + 1;
      }

    }
    return score
  }
  const handleSubmit = async () => {
    const myscore = calculateScore();
    console.log("score "+myscore);
    setQuizCompleted(true)
    setScore(myscore)
    setWantSubmitted(false)
    const finalTimes = [...questionTimes];
      finalTimes[currQuizIndex] = timeSpent;

      const total = finalTimes.reduce((acc, val) => acc + val, 0);
      setTotaltime(total);
    try {
      console.log("trycatch");
      
      const resp = await axios.post("/api/submit-quiz", {
        quizId: quizToStartObject.selectQuizToStart._id,
        email: email,
        score: myscore,
        perQuestionTimes: finalTimes,
        totaltime: total,
        selectedAnswers: allUserAnswers,
      });

      if (resp?.data.success) {
        toast.success(resp?.data.message, { icon: "👏" });
        setTimeout(() => {
          redirect(`/quiz-start/${quizId}/leaderboard`)
        }, 1000);
      } else {
        toast.error(resp?.data.message, { icon: "😕" });
      }
    } catch (err) {
      console.error("Error submitting quiz:", err);
      toast.error("Submission failed!");
    }
  };

  function handleAddMarkForReview() {
    if (!reviewQues.includes(currQuizIndex)) {
      setReviewQues([...reviewQues, currQuizIndex]);
      setIsCurrQuizMarked(true);
      toast.success(`Question ${currQuizIndex + 1} is marked for review`)
    }
  }

  function handleRemoveMarkForReview() {
    const filtered = reviewQues.filter((q) => q !== currQuizIndex);
    setReviewQues(filtered);
    setIsCurrQuizMarked(false);
  }

  function handlePreviousQuestion() {
    if (currQuizIndex > 0) {
      setCurrQuizIndex(prev => prev - 1)
    } else {
      toast.error("This is the first question")
    }
  }

  const selectChoiceFunction = (idx) => {
    const updatedSelections = [...selectedOptions];
    updatedSelections[currQuizIndex] = idx;
    setSelectedOptions(updatedSelections);

    const selectedAns = {
      questionId: quizQuestions[currQuizIndex]?._id,
      selectedOption: prefixes[idx],
      index: currQuizIndex
    };

    const updatedAnswers = [...allUserAnswers];
    const existingIndex = updatedAnswers.findIndex(
      (ans) => ans.questionId === selectedAns.questionId
    );

    if (existingIndex !== -1) {
      updatedAnswers[existingIndex] = selectedAns;
    } else {
      updatedAnswers.push(selectedAns);
    }

    setAllUserAnswers(updatedAnswers);
  };

  function emojiIconScore() {
    const emojis = [
      "confused-emoji.png",
      "happy-emoji.png",
      "very-happy-emoji.png",
    ];
    const result = (score / quizQuestions.length) * 100;
    if (result < 25) return emojis[0];
    if (result < 70) return emojis[1];
    return emojis[2];
  }

  return (
    <div className="max-h-screen bg-gray-50 dark:bg-gray-900 py-4 w-full">
      <div className=" mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="flex flex-col-reverse w-full lg:flex-row">
          {/* Main quiz content */}
          <div className="lg:w-full p-4 sm:p-6 md:p-8">
            {quizCompleted ? (
              <div className="flex flex-col items-center justify-center gap-8 text-center">
                <Image
                  src={`/${emojiIconScore()}`}
                  alt="emoji"
                  width={150}
                  height={150}
                />
                <div className="flex flex-col items-center gap-1">
                  <h2 className="text-lg font-medium">You have completed the quiz</h2>
                  <h1 className="text-base font-bold">Your Score: {score}</h1>
                </div>
                <div className="flex gap-2">
                  <Image
                    src={"/correct-answer.png"}
                    alt="correct"
                    width={24}
                    height={20}
                  />
                  <h1 className="text-green-600 font-bold">
                    Correct: {score}
                  </h1>
                </div>
                <div className="flex gap-2">
                  <Image
                    src={"/incorrect-answer.png"}
                    alt="incorrect"
                    width={24}
                    height={20}
                  />
                  <h1 className="text-red-600 font-bold">
                    Incorrect: {quizQuestions.length - score}
                  </h1>
                </div>
                <Link
                  href={`/quiz-start/${quizId}/leaderboard`}
                  className="bg-green-700 text-white rounded-md px-5 py-3 mt-10"
                >
                  View Leaderboard
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h2 className="text-sm sm:text-base font-medium text-gray-500 dark:text-gray-400">
                      Question {currQuizIndex + 1} of {quizQuestions.length}
                    </h2>
                    {isCurrQuizMarked ? (
                      <button
                        onClick={handleRemoveMarkForReview}
                        className="px-2 py-1 text-xs sm:text-sm rounded-md bg-yellow-100 text-yellow-800 border border-yellow-300"
                      >
                        ✓ Review
                      </button>
                    ) : (
                      <button
                        onClick={handleAddMarkForReview}
                        className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 hover:bg-gray-200 px-2 py-1 text-xs sm:text-sm rounded-md"
                      >
                        Mark For Review
                      </button>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3 sm:mb-4 whitespace-pre-line break-words">
                    {currQuizIndex + 1}. {quizQuestions[currQuizIndex]?.mainQuestion}
                  </h3>
                  {quizQuestions[currQuizIndex]?.mainQuestionImage && (

                    <div className="mt-4 mb-4 w-full">
                      <img
                        src={quizQuestions[currQuizIndex].mainQuestionImage}
                        alt="Question Illustration"
                        className="rounded-lg object-contain max-h-[300px] flex items-center justify-center"
                      />
                    </div>


                  )}

                  <div className="space-y-3 ">
                    {quizQuestions[currQuizIndex]?.choices.map((choice, idx) => (
                      <div
                        key={idx}
                        onClick={() => selectChoiceFunction(idx)}
                        className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-colors ${selectedOptions[currQuizIndex] === idx
                          ? 'border-green-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-700'
                          : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700'
                          }`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center mr-2 sm:mr-3 ${selectedOptions[currQuizIndex] === idx
                              ? 'border-green-500 bg-green-500  dark:bg-blue-500 dark:border-blue-500'
                              : 'border-gray-400 dark:border-gray-500'
                              }`}
                          >
                            {selectedOptions[currQuizIndex] === idx && (
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <span className="font-bold mr-3 text-gray-700 dark:text-gray-300">{prefixes[idx]}.</span>
                          <span className="whitespace-pre-line break-words text-gray-700 dark:text-gray-200">
                            {choice.slice(3)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currQuizIndex === 0}
                    className={`px-4 py-2 rounded-md ${currQuizIndex === 0
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      }`}
                  >
                    Previous
                  </button>
                  {currQuizIndex < quizQuestions.length - 1 ? (
                    <button
                      onClick={handleNext}
                      className="px-4 py-2  bg-gradient-to-tr from-[#22c55e] via-[#0e7490] to-[#3b82f6] text-white rounded-md hover:bg-green-800"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleConfirmSubmission}
                      className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
                    >
                      Submit
                    </button>
                  )}

                </div>
              </>
            )}
          </div>

          {/* Desktop Question Navigation */}
          {!quizCompleted && (
            <div className="lg:w-1/3 bg-gray-50 dark:bg-gray-800 p-4 border-l border-gray-200 dark:border-gray-700">
              <div className="sticky top-4">
                <h3 className="font-medium text-gray-700 dark:text-gray-200 mb-3">Question Navigation</h3>
                <div className="grid grid-cols-5 gap-2">
                  {quizQuestions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedOption(null);
                        setCurrQuizIndex(idx);
                      }}
                      className={`p-2 rounded-md flex items-center justify-center relative
              ${currQuizIndex === idx
                          ? "bg-gradient-to-bl from-[#84cc16] via-[#16a34a] to-[#0f766e] text-white"
                          : reviewQues.includes(idx)
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-300 dark:bg-yellow-700 dark:text-yellow-100 dark:border-yellow-600"
                            : selectedOptions[idx] !== null
                              ? "bg-gradient-to-br from-sky-100 via-blue-200 to-sky-300 text-blue-800 border border-sky-300 dark:from-blue-700 dark:via-blue-800 dark:to-blue-900 dark:text-blue-100 dark:border-blue-600"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        }`}
                    >
                      {idx + 1}
                      {reviewQues.includes(idx) && (
                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-600 dark:bg-yellow-400 rounded-full border border-white dark:border-gray-800" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="mt-4 space-y-2 hidden lg:block">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-gradient-to-bl from-[#84cc16] via-[#16a34a] to-[#0f766e] mr-2"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Current</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 border border-green-300 dark:from-blue-700 dark:via-blue-800 dark:to-blue-900 dark:border-blue-600 mr-2"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Answered</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-300 dark:bg-yellow-700 dark:border-yellow-600 mr-2"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Marked</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-700 mr-2"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Unanswered</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submission Confirmation Dialog */}
        <Dialog open={wantSubmitted} onOpenChange={() => setWantSubmitted(prev => !prev)}>
          <DialogContent className="bg-white dark:bg-gray-900 max-w-md">
            <DialogHeader>
              <div className="pt-8 pb-6 px-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-green-100">
                  <svg viewBox="0 0 48 48" height={40} width={40} xmlns="http://www.w3.org/2000/svg">
                    <polyline points="16.5,23.5 21.5,28.5 32,18"
                      stroke="#10e36c" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Are you sure to submit?
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Check once. You have still some time left.
                </p>
              </div>
              <div className="pt-4 pb-5 px-6 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setWantSubmitted(false)}
                  className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-5 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                >
                  Submit Quiz
                </button>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default QuizStartQuestions;