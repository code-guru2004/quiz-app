import React, { useState } from 'react'

function QuizDescription({onDescriptionChange}) {
    const [description, setDescription] = useState('');
    function handleChange(text){
        setDescription(text)
        onDescriptionChange(text);
    }
    return (
        <div className="p-3 flex justify-between border mt-5 border-green-700 rounded-md relative ">
            {/* Left: Quiz Title Input */}
            <div className="flex gap-2 ">
                <div className="bg-green-700 px-4 py-2 h-10 rounded-md text-white">3</div>
                <span className="font-bold">Quiz Description:</span>
                <textarea
                    className="outline-none border-b-2 pt-1 w-[65vw] text-[13px] bg-gray-200 p-2"
                    placeholder="Enter time duration in minutes"
                    type='text'
                    value={description}
                    onChange={(e) => handleChange(e.target.value)}
                />
            </div>
        </div>
    )
}

export default QuizDescription