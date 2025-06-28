'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { ICONS } from '@/app/Icon';
// Assuming '@/app/Icon' provides an array of icon objects
// For demonstration, let's define a mock ICONS array if not available


function QuizBuildTitle({ onQuizTitleChange, onQuizIconChange }) {
  const [quizTitle, setQuizTitle] = useState('');
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);

  const handleInputChange = (e) => {
    const title = e.target.value;
    setQuizTitle(title);
    onQuizTitleChange(title);
  };

  const toggleIconSelector = () => {
    setIconSelectorOpen(!iconSelectorOpen);
  };

  const handleIconSelect = (iconObj, iconIndex) => {
    setSelectedIcon(iconObj);
    onQuizIconChange(iconIndex);
    setIconSelectorOpen(false);
  };

  return (
    <div className="p-3 flex justify-between border mt-5 border-green-700 rounded-md relative
                bg-white text-gray-900
                dark:bg-gray-800 dark:text-gray-100 dark:border-green-600">
      {/* Left: Quiz Title Input */}
      <div className="flex gap-2 items-center">
        <div className="bg-green-700 px-4 py-2 rounded-md text-white">1</div>
        <span className="font-bold">Quiz Name:</span>
        <input
          className="outline-none border-b-2 pt-1 w-[300px]
                     bg-white text-gray-900 border-gray-300
                     dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600
                     placeholder-gray-400 dark:placeholder-gray-500
                     focus:border-green-500 dark:focus:border-green-400"
          placeholder="Enter the Name Of The Quiz..."
          onChange={handleInputChange}
          value={quizTitle} // Controlled component
        />
      </div>

      {/* Right: Icon picker */}
      <div className="relative">
        <button
          onClick={toggleIconSelector}
          className="flex items-center gap-2 p-2 rounded-md
                     border border-gray-300 bg-gray-50 text-gray-800
                     hover:bg-gray-100
                     dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200
                     dark:hover:bg-gray-600"
        >
          {selectedIcon?.icon || <span>Select Icon</span>}
          <ChevronDown size={16} />
        </button>

        {/* Icon Dropdown */}
        {iconSelectorOpen && (
          <div className="absolute right-0 mt-2 shadow-md rounded-md p-2 z-50 flex flex-col gap-2 max-h-60 overflow-y-auto custom-scrollbar
                          bg-white border border-gray-200
                          dark:bg-gray-700 dark:border-gray-600">
            {ICONS.map((item, idx) => (
              <button
                key={idx}
                className={twMerge(
                  'p-2 border rounded flex gap-4 items-center text-xs',
                  'border-gray-200 bg-white text-gray-900 hover:bg-gray-100', // Light mode defaults
                  'dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-600', // Dark mode overrides
                  selectedIcon?.name === item.name &&
                    'border-green-600 bg-green-50 text-green-800 dark:border-green-500 dark:bg-green-800 dark:text-green-200' // Selected state
                )}
                onClick={() => handleIconSelect(item, idx)}
              >
                {item.icon} :
                <span className='text-xs'>{item.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizBuildTitle;