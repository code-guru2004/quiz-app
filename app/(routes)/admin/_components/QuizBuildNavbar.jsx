'use client';

import useGlobalContextProvider from '@/app/_context/ContextApi';
import ThemeToggle from '@/components/shared/ModeToggle';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

function QuizBuildNavbar({ newQuiz, quizQuestions }) {
  const route = useRouter();
  const { allQuiz, setAllQuiz } = useGlobalContextProvider();
  const [category, setCategory] = useState('');

  function handleQuizTypeChange(e) {
    newQuiz.quizMode = e.target.value;
  }

  function handleQuizCategoryChange(e) {
    setCategory(e.target.value);
    newQuiz.quizCategory = e.target.value;
  }

  async function addNewQuiz() {
    for (let i = 0; i < quizQuestions.length; i++) {
      const q = quizQuestions[i];
      const isMainEmpty = q.mainQuestion.trim() === '';
      const hasEmptyChoice = q.choices.some((choice) => {
        const content = choice.slice(3).trim();
        return content.length === 0;
      });
      const isInsufficientChoices = q.choices.length < 3;
      const isAnswerEmpty = q.correctAnswer.trim() === '';

      if (isMainEmpty || hasEmptyChoice || isInsufficientChoices) {
        isMainEmpty
          ? toast.error(`Please complete question ${i + 1}.`)
          : toast.error(`Please fill all options in question ${i + 1}.`);
        return;
      } else if (isAnswerEmpty) {
        toast.error('Write the answer of question ' + (i + 1));
        return;
      }
    }

    if (newQuiz.quizCategory === '') {
      toast.error('Select the quiz category.');
      return;
    }

    if (newQuiz.quizTitle.trim().length === 0) {
      return toast.error('Write the quiz title first');
    }

    setAllQuiz([...allQuiz, newQuiz]);

    try {
      const addNewQuiz = await axios.post('/api/add-quiz', { ...newQuiz });
      toast.success(addNewQuiz?.data.message);
      route.replace('/admin');
    } catch (error) {
      toast.error('Failed to add quiz');
    }
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md py-3 rounded-md sticky top-0 z-50 transition-colors">
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
          <span className="text-2xl poppins text-gray-800 dark:text-white">
            Quiz <span className="text-green-700 font-bold">Builder</span>
          </span>
        </div>

        {/* Select & Save Section */}
        <div className="flex gap-4 items-center flex-wrap">
          {/* Category Select */}
          <div className="flex flex-col border-r-2 pr-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quiz Category
            </label>
            <select
              value={category}
              onChange={handleQuizCategoryChange}
              className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 text-sm"
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

          {/* Type Select */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quiz Type
            </label>
            <select
              defaultValue="Live Quiz"
              onChange={handleQuizTypeChange}
              className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 text-sm"
            >
              <option value="Live Quiz">Live Quiz</option>
              <option value="Practice Quiz">Practice Quiz</option>
            </select>
          </div>

          {/* Save Button */}
          <ThemeToggle/>
          <button
            onClick={addNewQuiz}
            className="bg-green-700 hover:bg-green-800 transition-colors text-white px-4 py-2 rounded-md text-sm mt-5 md:mt-0"
          >
            Save
          </button>
        </div>
      </div>
    </nav>
  );
}

export default QuizBuildNavbar;
