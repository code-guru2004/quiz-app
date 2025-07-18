"use client";
import useGlobalContextProvider from "@/app/_context/ContextApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { redirect, useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

function QuizStartQuestions({ timeLeft, setTimeLeft }) {
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
  const [showSidebar, setShowSidebar] = useState(false); // For mobile
  const [timeSpent, setTimeSpent] = useState(0);
  const [questionTimes, setQuestionTimes] = useState([]);
  const [totaltime, setTotaltime] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState(Array(quizQuestions.length).fill(null));
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const [reviewQues, setReviewQues] = useState([]);
  const [isCurrQuizMarked, setIsCurrQuizMarked] = useState(false);
  const [allUserAnswers, setAllUserAnswers] = useState([])
  const [wantSubmitted, setWantSubmitted] = useState(false);
  const router = useRouter();

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

  const handleConfirmSubmission = () => {

    setWantSubmitted(true);
  }
  const handleNext = () => {
    const isLastQuestion = currQuizIndex === quizQuestions.length - 1;
    if (!isLastQuestion && timeLeft > 0) {
      setCurrQuizIndex((prev) => prev + 1);
    }
  }

  const handleSubmit = async () => {
    const selectedOption = selectedOptions[currQuizIndex];
    const isCorrect =
      prefixes[selectedOption] === quizQuestions[currQuizIndex]?.correctAnswer;

    const isLastQuestion = currQuizIndex === quizQuestions.length - 1;

    // Prevent resubmitting the same question
    if (!submittedQuestions.includes(currQuizIndex)) {
      if (isCorrect) setScore(prev => prev + 1);

      setSubmittedQuestions(prev => [...prev, currQuizIndex]);
      setQuestionTimes([...questionTimes, timeSpent]);
    }

    if (!isLastQuestion && timeLeft > 0) {
      setCurrQuizIndex((prev) => prev + 1);
    } else {
      setQuizCompleted(true);

      const finalTimes = [...questionTimes];
      finalTimes[currQuizIndex] = timeSpent;

      const total = finalTimes.reduce((acc, val) => acc + val, 0);
      setTotaltime(total);

      try {
        const resp = await axios.post("/api/submit-quiz", {
          quizId: quizToStartObject.selectQuizToStart._id,
          email: email,
          score: score + (submittedQuestions.includes(currQuizIndex) ? 0 : isCorrect ? 1 : 0),
          perQuestionTimes: finalTimes,
          totaltime: total,
          selectedAnswers: allUserAnswers,
        });

        if (resp?.data.success) {
          toast.success(resp?.data.message, { icon: "👏" });
          setTimeout(() => {
            redirect(`quiz-start/${quizId}/leaderboard`)
          }, 1000);
        } else {
          toast.error(resp?.data.message, { icon: "😕" });
        }
      } catch (err) {
        console.error("Error submitting quiz:", err);
        toast.error("Submission failed!");
      }
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
      questionId: quizQuestions[currQuizIndex]?._id, // assuming each question has a unique `_id`
      selectedOption: prefixes[idx], // e.g., "A", "B", etc.
    };

    // Update allUserAnswers
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

  useEffect(() => {
    console.log(allUserAnswers);

  }, [allUserAnswers])


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
    <div className="w-full my-10 flex items-start justify-center md:flex-row flex-col body ">

      {/* Sidebar for question bookmarks */}
      {!quizCompleted && (
        <>
          {/* Sidebar container */}
          <div
            className={`md:w-64 w-full md:static md:h-auto md:translate-x-0 bg-green-50 dark:bg-slate-800 body border-r p-4 z-40 overflow-y-auto transition-transform duration-300 ease-in-out
    ${showSidebar ? "fixed top-0 left-0 h-full translate-x-0" : "fixed top-0 left-0 h-full -translate-x-full"} md:relative`}
          >
            {/* Close button for mobile */}
            <div className="flex justify-end md:hidden mb-4">
              <button
                onClick={() => setShowSidebar(false)}
                className="text-green-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <h2 className="text-green-900 dark:text-green-500 font-semibold text-lg mb-2">Questions</h2>
            <div className="grid grid-cols-4 gap-2">
              {quizQuestions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedOption(null);
                    setCurrQuizIndex(idx);
                    setShowSidebar(false);
                  }}
                  className={`px-3 py-2 text-sm rounded-md relative 
                  ${currQuizIndex === idx
                      ? "bg-green-700 text-white"
                      : reviewQues.includes(idx)
                        ? "bg-yellow-200 text-yellow-900 border border-yellow-500"
                        : "bg-green-100 text-green-800 hover:bg-green-200"
                    }`}
                >
                  Q{idx + 1}
                  {reviewQues.includes(idx) && (
                    <span className="absolute -top-1 right-0 h-3 w-3 bg-yellow-600 rounded-full" />
                  )}
                </button>

              ))}
            </div>
            <div className="w-full flex items-center">
              <button className="absolute  bottom-4 w-[90%] bg-green-600 rounded-md p-2 sm:block lg:hidden text-white ">
                Submit
              </button>
            </div>
          </div>

          {/* Backdrop for mobile */}
          {showSidebar && (
            <div
              onClick={() => setShowSidebar(false)}
              className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
            />
          )}
        </>
      )}

      {/* Hamburger button */}
      {!quizCompleted && (
        <button
          className="md:hidden fixed top-4 left-4 z-50 bg-green-700 text-white p-2 rounded-md"
          onClick={() => setShowSidebar(true)}
        >
          ☰
        </button>
      )}

      {/* Main quiz area */}
      <div className="flex-grow flex justify-center items-center px-4 ">
        <div className="w-full max-w-2xl ">
          {quizCompleted ? (
            <div className="mt-3 flex flex-col items-center justify-center gap-8 text-center w-full">
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
              {/* make it at center */}
              <div className="mb-4 text-sm md:text-lg font-semibold text-green-900 dark:text-green-500 whitespace-pre-line break-words w-full">
                {currQuizIndex + 1}.{" "}
                {quizQuestions[currQuizIndex]?.mainQuestion}
              </div>
              {quizQuestions[currQuizIndex]?.mainQuestionImage && (
                <div className="mt-4 mb-4 w-full">
                  <img
                    src={quizQuestions[currQuizIndex].mainQuestionImage}
                    alt="Question Illustration"
                    className="rounded-lg object-contain max-h-[300px] flex items-center justify-center"
                  />
                </div>
              )}

              <div className="space-y-3  flex flex-col items-center justify-center">
                {quizQuestions[currQuizIndex]?.choices.map((choice, idx) => (
                  <div
                    key={idx}
                    onClick={() => selectChoiceFunction(idx)}
                    className={`p-4 w-screen lg:w-full border rounded-lg cursor-pointer transition-all flex
      ${selectedOptions[currQuizIndex] === idx

                        ? "bg-green-600 dark:bg-green-600 text-white border-green-700"
                        : "bg-white dark:bg-slate-600 border-green-300 hover:bg-green-200 dark:hover:bg-slate-500"
                      }`}
                  >
                    <span className="font-bold mr-2">{prefixes[idx]}.</span>
                    <span className="whitespace-pre-line break-words w-full block">
                      {choice.slice(3)}
                    </span>
                  </div>
                ))}

              </div>

              <div className="mt-6 flex justify-between gap-4 px-5">
                {isCurrQuizMarked ? (
                  <button
                    onClick={handleRemoveMarkForReview}
                    className="px-3 lg:px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-all"
                  >
                    Unmark Review
                  </button>
                ) : (
                  <button
                    onClick={handleAddMarkForReview}
                    className="px-3 lg:px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-all"
                  >
                    Mark For Review
                  </button>
                )}

                <div className="flex gap-5">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={quizCompleted}
                    className="px-3 lg:px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
                  >
                    Previous
                  </button>
                  {
                    currQuizIndex < quizQuestions.length - 1 && (
                      <button
                        onClick={handleNext}

                        className="px-3 lg:px-6 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-all"
                      >
                        Next
                      </button>
                    )
                  }
                  {
                    currQuizIndex === quizQuestions.length - 1 && (
                      <button
                        onClick={handleConfirmSubmission}
                        disabled={quizCompleted}
                        className="px-3 lg:px-6 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-all"
                      >
                        Submit
                      </button>
                    )
                  }

                </div>

                <Dialog open={wantSubmitted} onOpenChange={()=>setWantSubmitted(prev=> !prev)} className="bg-white dark:bg-gray-900">
                  <DialogContent>
                    <DialogHeader>
                      <div className="max-w-xl w-full mx-auto bg-white dark:bg-gray-900 rounded-xl overflow-hidden transition-colors duration-300">
                        <div className="max-w-md mx-auto pt-12 pb-14 px-5 text-center">
                          <div className="inline-flex items-center justify-center w-12 h-12 mb-5 rounded-full">
                            <svg viewBox="0 0 48 48" height={100} width={100} xmlns="http://www.w3.org/2000/svg">
                              <linearGradient id="SVGID_1__8tZkVc2cOjdg_gr1" x1="37.081" x2="10.918" y1="10.918" y2="37.081" gradientUnits="userSpaceOnUse">
                                <stop offset="0" stopColor="#60fea4" />
                                <stop offset=".033" stopColor="#6afeaa" />
                                <stop offset=".197" stopColor="#97fec4" />
                                <stop offset=".362" stopColor="#bdffd9" />
                                <stop offset=".525" stopColor="#daffea" />
                                <stop offset=".687" stopColor="#eefff5" />
                                <stop offset=".846" stopColor="#fbfffd" />
                                <stop offset="1" stopColor="#fff" />
                              </linearGradient>
                              <circle cx={24} cy={24} r="18.5" fill="url(#SVGID_1__8tZkVc2cOjdg_gr1)" />
                              <path d="M35.401,38.773C32.248,41.21,28.293,42.66,24,42.66C13.695,42.66,5.34,34.305,5.34,24	c0-2.648,0.551-5.167,1.546-7.448"
                                stroke="#10e36c" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                              <path d="M12.077,9.646C15.31,6.957,19.466,5.34,24,5.34c10.305,0,18.66,8.354,18.66,18.66c0,2.309-0.419,4.52-1.186,6.561"
                                stroke="#10e36c" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                              <polyline points="16.5,23.5 21.5,28.5 32,18"
                                stroke="#10e36c" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            </svg>
                          </div>
                          <h4 className="text-xl font-semibold mb-5 text-gray-900 dark:text-gray-100">
                            Are you sure to submit?
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 font-medium">
                            Check once. You have still some time left.
                          </p>
                        </div>
                        <div className="pt-5 pb-6 px-6 text-right bg-gray-100 dark:bg-gray-800 -mb-2 transition-colors duration-300">
                          <button
                            onClick={() => setWantSubmitted(false)}
                            className="inline-block w-full sm:w-auto py-3 px-5 mb-2 mr-4 text-center font-semibold leading-6 text-gray-800 dark:text-gray-200 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 rounded-lg transition duration-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSubmit}
                            disabled={quizCompleted}
                            className="inline-block w-full sm:w-auto py-3 px-5 mb-2 text-center font-semibold leading-6 text-white bg-green-500 hover:bg-green-600 rounded-lg transition duration-200 disabled:opacity-50"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

}

export default QuizStartQuestions;
