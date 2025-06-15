"use client";
import useGlobalContextProvider from "@/app/_context/ContextApi";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
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

  const handleSubmit = async () => {
    const isCorrect =
      prefixes[selectedOption] === quizQuestions[currQuizIndex]?.correctAnswer;

    const updatedScore = score + (isCorrect ? 1 : 0);
    const isLastQuestion = currQuizIndex === quizQuestions.length - 1;

    if (!isLastQuestion) {
      if (isCorrect) setScore(updatedScore);
      setCurrQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizCompleted(true);
      setScore(updatedScore);

      try {
        const resp = await axios.post("/api/submit-quiz", {
          quizId: quizToStartObject.selectQuizToStart._id,
          email: email,
          score: updatedScore,
        });

        if (resp?.data.success) {
          toast.success(resp?.data.message, { icon: "👏" });
        } else {
          toast.error(resp?.data.message, { icon: "😕" });
        }
      } catch (err) {
        console.error("Error submitting quiz:", err);
        toast.error("Submission failed!");
      }
    }
  };

  const selectChoiceFunction = (idx) => {
    setSelectedOption(idx);
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
    <div className="w-full my-10 flex items-start justify-center md:flex-row flex-col ">

      {/* Sidebar for question bookmarks */}
      {!quizCompleted && (
        <>
          {/* Sidebar container */}
          <div
            className={`md:w-64 w-full md:static md:h-auto md:translate-x-0 bg-green-50 border-r p-4 z-40 overflow-y-auto transition-transform duration-300 ease-in-out
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

            <h2 className="text-green-900 font-semibold text-lg mb-2">Questions</h2>
            <div className="grid grid-cols-4 gap-2">
              {quizQuestions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrQuizIndex(idx);
                    setShowSidebar(false); // close on mobile
                  }}
                  className={`px-3 py-2  text-sm rounded-md ${currQuizIndex === idx
                      ? "bg-green-700 text-white"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
                    }`}
                >
                  Q{idx + 1}
                </button>
              ))}
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
            <div className="mt-3 flex flex-col items-center justify-center gap-8 text-center">
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
              <div className="mb-4 text-sm md:text-lg font-semibold text-green-900 whitespace-pre-line break-words w-full">
                {currQuizIndex + 1}.{" "}
                {quizQuestions[currQuizIndex]?.mainQuestion}
              </div>


              <div className="space-y-3 px-4 flex flex-col items-center justify-center">
                {quizQuestions[currQuizIndex]?.choices.map((choice, idx) => (
                  <div
                    key={idx}
                    onClick={() => selectChoiceFunction(idx)}
                    className={`p-4 w-screen lg:w-full border rounded-lg cursor-pointer transition-all flex
      ${selectedOption === idx
                        ? "bg-green-600 text-white border-green-700"
                        : "bg-white border-green-300 hover:bg-green-100"
                      }`}
                  >
                    <span className="font-bold mr-2">{prefixes[idx]}.</span>
                    <span className="whitespace-pre-line break-words w-full block">
                      {choice.slice(3)}
                    </span>
                  </div>
                ))}

              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={quizCompleted}
                  className="px-6 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-all"
                >
                  {currQuizIndex === quizQuestions.length - 1
                    ? "Submit"
                    : "Next"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

}

export default QuizStartQuestions;
