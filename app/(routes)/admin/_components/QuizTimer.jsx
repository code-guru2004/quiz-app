import React, { useState } from 'react';

function QuizTimer({onTimerChange}) {
  const [timer, setTimer] = useState(1);

  function handleChange(time){
    // Ensure time is a number and handle empty input gracefully
    const numericTime = Number(time);
    if (!isNaN(numericTime) && numericTime >= 0) { // Assuming timer shouldn't be negative
      setTimer(numericTime);
      onTimerChange(numericTime);
    } else if (time === '') {
      setTimer(''); // Allow input to be cleared
      onTimerChange(0); // Or handle as appropriate for your application, e.g., 0 or null
    }
  }

  return (
    <div className="p-3 flex justify-between border mt-5 border-green-700 rounded-md relative
                bg-white text-gray-900
                dark:bg-gray-800 dark:text-gray-100 dark:border-green-600">
      {/* Left: Quiz Title Input */}
      <div className="flex gap-2 items-center">
        <div className="bg-green-700 px-4 py-2 rounded-md text-white">2</div>
        <span className="font-bold">Quiz Time:</span>
        <input
          className="outline-none border-b-2 pt-1 w-[300px] text-[13px]
                     bg-white text-gray-900 border-gray-300
                     dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600
                     placeholder-gray-400 dark:placeholder-gray-500
                     focus:border-green-500 dark:focus:border-green-400"
          placeholder="Enter time duration in minutes"
          type='number'
          value={timer}
          onChange={(e)=>handleChange(e.target.value)}
          min="0" // Added min attribute for number input
        />
      </div>
    </div>
  );
}

export default QuizTimer;