import React, { useState } from 'react'

function QuizTimer({onTimerChange}) {
  const [timer, setTimer] = useState(0);
  function handleChange(time){
    setTimer(time);
    onTimerChange(time);
  }
  return (
    <div className="p-3 flex justify-between border mt-5 border-green-700 rounded-md relative">
      {/* Left: Quiz Title Input */}
      <div className="flex gap-2 items-center">
        <div className="bg-green-700 px-4 py-2 rounded-md text-white">2</div>
        <span className="font-bold">Quiz Time:</span>
        <input
        className="outline-none border-b-2 pt-1 w-[300px] text-[13px]"
        placeholder="Enter time duration in minutes"
        type='number'
        value={timer}
        onChange={(e)=>handleChange(e.target.value)}
      />
    </div>
  </div>
  )
}

export default QuizTimer