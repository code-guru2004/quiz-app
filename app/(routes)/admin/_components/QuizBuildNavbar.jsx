'use client';
import useGlobalContextProvider from '@/app/_context/ContextApi';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';

function QuizBuildNavbar({ newQuiz, quizQuestions }) {
  const route = useRouter();
  const { allQuiz, setAllQuiz } = useGlobalContextProvider();
  //console.log(newQuiz);

  async function addNewQuiz() {
    // validation before the submission
    for (let i = 0; i < quizQuestions.length; i++) {
      const q = quizQuestions[i];
      const isMainEmpty = q.mainQuestion.trim() === "";
      const hasEmptyChoice = q.choices.some((choice) => {
        const content = choice.slice(3).trim(); // Remove "A. ", "B. ", etc.
        return content.length === 0;
      });

      const isInsufficientChoices = q.choices.length < 3;
      const isAnswerEmpty = q.correctAnswer.trim() === ""; //🟡 check the answser is empty or not i.e. validation is already done in the AnswerInputSection section
      if (isMainEmpty || hasEmptyChoice || isInsufficientChoices) {
        isMainEmpty
          ? toast.error(`Please complete question ${i + 1}.`)
          : toast.error(`Please fill all options in question ${i + 1}.`);
        return;
      } else if (isAnswerEmpty) {
        toast.error("Write the answer of quoestion " + (i + 1))
        return;
      }
    }
    // check the title empty or not
    if (newQuiz.quizTitle.trim(' ').length === 0) {
      return toast.error("Write the quiz title first")
    }
    setAllQuiz([...allQuiz, newQuiz]);


    try {
      const addNewQuiz = await axios.post("/api/add-quiz", { ...newQuiz });
      if (!addNewQuiz?.data.success) {
        toast.success(addNewQuiz?.data.message)
      }
      toast.success(addNewQuiz?.data.message)
      route.replace('/admin')
    } catch (error) {
      toast.error("Failed to add quiz");
    }

    // console.log(allQuiz);
  }
  //console.log(allQuiz);

  return (
    <nav className="bg-white shadow-md py-3 rounded-md sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex gap-3 items-center">
          <Image
            src="/quiz-builder-icon.png"
            alt="Quiz Builder Logo"
            width={50}
            height={50}
            priority
          />
          <span className="text-2xl poppins">
            Quiz <span className="text-green-700 font-bold">Builder</span>
          </span>
        </div>

        {/* Save Button */}
        <button className="p-2 px-4 bg-green-700 rounded-md text-white hover:bg-green-800 transition-all " onClick={addNewQuiz}>
          Save
        </button>
      </div>
    </nav>
  );
}

export default QuizBuildNavbar;
