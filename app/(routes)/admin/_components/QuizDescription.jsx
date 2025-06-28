import React, { useState } from "react";
import toast from "react-hot-toast";

function QuizDescription({ onDescriptionChange }) {
  const [description, setDescription] = useState("");

  function handleChange(text) {
    if (text.length < 1000) {
      setDescription(text);
      onDescriptionChange(text);
    } else {
      toast.error("Description must be within 1000 letters");
    }
  }

  return (
    <div className="p-3 flex justify-between border mt-5 border-green-700 dark:border-green-500 rounded-md relative bg-white dark:bg-gray-800">
      {/* Left: Quiz Title Input */}
      <div className="flex gap-2 w-full">
        <div className="bg-green-700 px-4 py-2 h-10 rounded-md text-white">3</div>
        <span className="font-bold text-black dark:text-white">Quiz Description:</span>
        <textarea
          className="outline-none border-b-2 border-gray-300 dark:border-gray-600 pt-1 w-full text-[13px] bg-gray-200 dark:bg-gray-800 p-2 rounded-md text-black dark:text-white resize-none"
          placeholder="Enter quiz description here"
          value={description}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
    </div>
  );
}

export default QuizDescription;
