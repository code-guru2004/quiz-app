'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { ICONS } from '@/app/Icon';

// const ICONS = [
//   { name: 'Quiz', icon: <MdQuiz  className="text-cyan-700 text-xl" /> },
//   { name: 'Java', icon: <FaJava className="text-orange-700 text-xl" /> },
//   { name: 'Python', icon: <FaPython className="text-blue-600 text-xl" /> },
//   { name: 'HTML', icon: <FaHtml5 className="text-orange-500 text-xl" /> },
//   { name: 'JavaScript', icon: <IoLogoJavascript className="text-yellow-500 text-xl" /> },
//   { name: 'C++', icon: <TbBrandCpp className="text-indigo-600 text-xl" /> },
//   { name: 'React', icon: <FaReact className="text-cyan-500 text-xl" /> },
//   { name: 'CSS', icon: <FaCss3  className="text-purple-500 text-xl" /> },
//   { name: 'Nextjs', icon: <RiNextjsFill  className="text-gray-900 text-xl" /> },
//   { name: 'Typescript ', icon: <SiTypescript  className="text-blue-500 text-xl" /> },
//   { name: 'SQL ', icon: <SiMysql className="text-blue-500 text-xl" /> },
//   { name: 'Mongodb  ', icon: <SiMongodb  className="text-green-600 text-xl" /> },
//   { name: 'Aptitude ', icon: <PiMathOperationsFill  className="text-gray-700 text-xl" /> },
// ];

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
