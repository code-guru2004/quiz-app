'use client';
import useGlobalContextProvider from '@/app/_context/ContextApi';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

function QuizBuildNavbar({ newQuiz, quizQuestions }) {
  const route = useRouter();
  const { allQuiz, setAllQuiz } = useGlobalContextProvider();
 const [category, setCategory] = useState('')
  // 🟢 Handle quiz type change
  function handleQuizTypeChange(e) {
    newQuiz.quizMode = e.target.value; // Add/Update quizMode in newQuiz
  }
  function handleQuizCategoryChange(e){
    setCategory(e.target.value)
    newQuiz.quizCategory = e.target.value;
  }
  async function addNewQuiz() {
    for (let i = 0; i < quizQuestions.length; i++) {
      const q = quizQuestions[i];
      const isMainEmpty = q.mainQuestion.trim() === "";
      const hasEmptyChoice = q.choices.some((choice) => {
        const content = choice.slice(3).trim();
        return content.length === 0;
      });
      const isInsufficientChoices = q.choices.length < 3;
      const isAnswerEmpty = q.correctAnswer.trim() === "";

      if (isMainEmpty || hasEmptyChoice || isInsufficientChoices) {
        isMainEmpty
          ? toast.error(`Please complete question ${i + 1}.`)
          : toast.error(`Please fill all options in question ${i + 1}.`);
        return;
      } else if (isAnswerEmpty) {
        toast.error("Write the answer of question " + (i + 1));
        return;
      }
    }
    if(newQuiz.quizCategory===''){
      toast.error("Select the quiz category.");
      return;
    }

    if (newQuiz.quizTitle.trim(' ').length === 0) {
      return toast.error("Write the quiz title first");
    }

    setAllQuiz([...allQuiz, newQuiz]);

    try {
      const addNewQuiz = await axios.post("/api/add-quiz", { ...newQuiz });
      if (!addNewQuiz?.data.success) {
        toast.success(addNewQuiz?.data.message);
      }
      toast.success(addNewQuiz?.data.message);
      route.replace('/admin');
    } catch (error) {
      toast.error("Failed to add quiz");
    }
  }

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

        {/* Select & Save Section */}
        <div className="flex gap-4 items-center">
          <div className='flex   border-r-2 p-2'>
              <label className="block text-sm font-medium">Quiz Category</label>
              <select
                value={category}
                onChange={handleQuizCategoryChange}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="">Select Category</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Programming">Programming</option>
                <option value="Math">Math</option>
                <option value="Aptitude">Aptitude</option>
                <option value="Science">Science</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Engineering">Engineering</option>
                <option value="History">History</option>
                <option value="General Science">General Science</option>
              </select>
          </div>

          {/* 🟡 Select Input */}
          <label className="block text-sm font-medium">Quiz Type</label>
          <select
            defaultValue="Live Quiz"
            onChange={handleQuizTypeChange}
            className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="Live Quiz">Live Quiz</option>
            <option value="Practice Quiz">Practice Quiz</option>
          </select>

          {/* Save Button */}
          <button
            className="p-2 px-4 bg-green-700 rounded-md text-white hover:bg-green-800 transition-all"
            onClick={addNewQuiz}
          >
            Save
          </button>
        </div>
      </div>
    </nav>
  );
}

export default QuizBuildNavbar;
