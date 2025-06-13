"use client";
import useGlobalContextProvider from "@/app/_context/ContextApi";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";


function QuizStartQuestions({ timeLeft,setTimeLeft }) {
  const prefixes = ["A", "B", "C", "D", "E"];
  const { quizToStartObject,email } = useGlobalContextProvider();
  const { selectQuizToStart } = quizToStartObject;
  const { quizQuestions } = selectQuizToStart;
  const [currQuizIndex, setCurrQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [indexOfQuizSelected, setIndexOfQuizSelected] = useState(null);
  const [isEnded, setIsEnded] = useState(false);
  const [score, setScore] = useState(0);
  //const [timeLeft, setTimeLeft] = useState(60);

  const [quizCompleted, setQuizCompleted] = useState(false);

  let res = 0;
  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizCompleted) {
      console.log("Completed");
      toast.success('Successfully completed!',{
        icon: '👏',
      })
      setQuizCompleted(true);
      console.log(score);
    }
  }, [timeLeft, quizCompleted]);

  const handleSubmit =  () => {
    if (prefixes[selectedOption] === quizQuestions[currQuizIndex]?.correctAnswer) {
      console.log("Currect Answer");
      res++;
      setScore(res);
      //console.log(res);
      
    }
    setTimeout(async () => {
      if (currQuizIndex < quizQuestions.length - 1) {
        setCurrQuizIndex(currQuizIndex + 1);
        setSelectedOption(null);
      } else {
        setQuizCompleted(true);
        console.log("your score", score);
        // axios submit-quiz
        const resp = await axios.post("/api/submit-quiz",{
          quizId:quizToStartObject.selectQuizToStart._id,
          email:email,
          score:score+1
        })
        if(resp?.data.success){
          localStorage.setItem(quizToStartObject.selectQuizToStart._id,'1');
          toast.success(resp?.data.message,{
            icon: '👏',
          })
        }else{
          toast.error(resp?.data.message,{
            icon: '😕',
          })
        }
      }
    }, 500);
  };
  // const handleSubmit = () => {
  //   if (currQuizIndex === quizQuestions.length - 1 || timeLeft===0) {
  //       console.log("Quiz ended");
  //       console.log(score);

  //     return;
  //   }
  //   if(selectedOption===quizQuestions[currQuizIndex]?.correctAnswer){
  //       console.log("Currect Answer");
  //       setScore(score+1)
  //   }else{
  //       console.log("Wrong");

  //   }
  //   setCurrQuizIndex(currQuizIndex + 1);
  //   setSelectedOption(null)
  //   setTimeLeft(300);
  // };

  const selectChoiceFunction = (idx) => {
    //console.log(idx);
    setSelectedOption(idx);
  };

  function emojiIconScore(){
    const emojis=[
      'confused-emoji.png',
      'happy-emoji.png',
      'very-happy-emoji.png'
    ]

    let result = (score / quizQuestions.length) * 100;

    if(result < 25){
      return emojis[0];
    }
    if (result < 70) {
      return emojis[1]
    }
    return emojis[2]
  }
  return (
    <div className="w-full flex items-center justify-center">
      {quizCompleted ? (
        <div className="mt-3 flex flex-col items-center gap-4">
          <Image
            src={`/${emojiIconScore()}`}
            alt="happy"
            width={150}
            height={150}
          />
          <div className="flex flex-col items-center gap-1">
            <h2>You have completed quiz</h2>
            <h1 className="text-base font-bold">Your Score: {score}</h1>
          </div>
          <div className="flex gap-2">
            <Image
              src={"/correct-answer.png"}
              alt="correct"
              width={24}
              height={20}
            />
            <h1 className="text-green-600 font-bold">Correct answer: {score}</h1>
          </div>
          <div className="flex gap-2">
            <Image
              src={"/incorrect-answer.png"}
              alt="correct"
              width={24}
              height={20}
            />
            <h1 className="text-red-600 font-bold">Incorrect answer: {quizQuestions.length - score}</h1>
          </div>
        </div>
      ) : (
        <>
          <div className="rounded-sm w-9/12 m-9">
            {/* question part */}
            <div className="flex justify-start items-center gap-2">
              <div className="bg-green-700 flex justify-center items-center rounded-md w-11 h-11 text-white">
                {currQuizIndex + 1}
              </div>
              <p>{quizQuestions[currQuizIndex]?.mainQuestion}</p>
            </div>
            {/* options */}
            <div className="mt-7 flex flex-col gap-2">
              {quizQuestions[currQuizIndex]?.choices.map((option, idx) => (
                <div
                  key={idx}
                  className={`p-3 ml-11 w-10/12 border border-green-700 rounded-md bg-green-50 hover:bg-green-200 transition-all cursor-pointer hover:border-l-green-700 hover:border-l-8 hover:text-green-800  ${
                    selectedOption === idx ? "bg-green-400" : "bg-green-50"
                  }`}
                  onClick={() => selectChoiceFunction(idx)}
                >
                  {option}
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-14">
              <button
                className="p-2 px-5 text-[15px] text-white rounded-md bg-green-700 mr-[70px] cursor-pointer transition-all hover:bg-green-800"
                onClick={handleSubmit}
                disabled={quizCompleted}
              >
                Submit
              </button> 
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default QuizStartQuestions;
