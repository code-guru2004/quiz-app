'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { ICONS } from '@/app/Icon';



function QuizBuildTitle({ onQuizTitleChange,onQuizIconChange }) {
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

  const handleIconSelect = (iconObj,iconIndex) => {
    setSelectedIcon(iconObj);
    onQuizIconChange(iconIndex)
    setIconSelectorOpen(false);
  };
//console.log(selectedIcon.name);

  return (
    <div className="p-3 flex justify-between border mt-5 border-green-700 rounded-md relative">
      {/* Left: Quiz Title Input */}
      <div className="flex gap-2 items-center">
        <div className="bg-green-700 px-4 py-2 rounded-md text-white">1</div>
        <span className="font-bold">Quiz Name:</span>
        <input
          className="outline-none border-b-2 pt-1 w-[300px] text-[13px]"
          placeholder="Enter the Name Of The Quiz..."
          onChange={handleInputChange}
        />
      </div>

      {/* Right: Icon picker */}
      <div className="relative">
        <button
          onClick={toggleIconSelector}
          className="flex items-center gap-2 p-2 border border-gray-300 rounded-md hover:bg-gray-100"
        >
          {selectedIcon?.icon || <span>Select Icon</span>}
          <ChevronDown size={16} />
        </button>

        {/* Icon Dropdown */}
        {iconSelectorOpen && (
          <div className="absolute right-0 mt-2 bg-white border border-gray-200 shadow-md rounded-md p-2 z-50 flex flex-col gap-2 max-h-60 overflow-y-auto custom-scrollbar">
            {ICONS.map((item,idx) => (
              <button
                key={idx}
                className={twMerge(
                  'p-2 border rounded hover:bg-gray-100 flex gap-4 items-center text-xs',
                  selectedIcon?.name === item.name && 'border-green-600 bg-green-50'
                )}
                onClick={() => handleIconSelect(item,idx)}
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
