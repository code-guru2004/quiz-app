"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useGlobalContextProvider from "@/app/_context/ContextApi";
import { FaJs, FaPython, FaJava, FaCode, FaDatabase } from "react-icons/fa";
import { SiC, SiCplusplus } from "react-icons/si";
import { TbBrain, TbClock, TbNumber, TbCategory, TbBrandCSharp } from "react-icons/tb";

export default function QuizInputPage() {
    const [formData, setFormData] = useState({
        topic: "",
        difficulty: "easy",
        totalQuestions: 5,
        timePerQuestion: 1,
        languageGuess: "javascript",
    });
    const { aiQuiz, setAiQuiz } = useGlobalContextProvider()
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/ai-quiz/get-ai-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data?.quiz) {
                setAiQuiz(data?.quiz);
                router.push("/coding-test/exam");
            }
        } catch (error) {
            console.error("Error fetching quiz:", error);
        } finally {
            setLoading(false);
        }
    };

    const languageOptions = [
        { value: "javascript", label: "JavaScript", icon: <FaJs className="text-yellow-400 size-5" /> },
        { value: "python", label: "Python", icon: <FaPython className="text-blue-500 size-5"  /> },
        { value: "java", label: "Java", icon: <FaJava className="text-orange-500 size-5" /> },
        { value: "c++", label: "C++", icon: <SiCplusplus className="text-blue-600 size-5" /> },
        { value: "csharp", label: "C#", icon: <TbBrandCSharp className="text-purple-600 size-5" /> },
        { value: "sql", label: "SQL", icon: <FaDatabase className="text-gray-600 size-5" /> },
    ];

    const difficultyOptions = [
        { value: "easy", label: "Easy", color: "text-green-500" },
        { value: "medium", label: "Medium", color: "text-yellow-500" },
        { value: "hard", label: "Hard", color: "text-red-500" },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8 w-full" >
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                        Code Quiz Generator
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Create a customized coding quiz to test your skills
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 space-y-6 border border-gray-200 dark:border-gray-700"
                >
                    {/* Topic Input */}
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                            <TbCategory className="mr-2" />
                            Quiz Topic
                        </label>
                        <input
                            type="text"
                            name="topic"
                            placeholder="e.g., Data Structures, React Hooks, Algorithms"
                            value={formData.topic}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>

                    {/* Difficulty Selection */}
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                            <TbBrain className="mr-2" />
                            Difficulty Level
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {difficultyOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setFormData({...formData, difficulty: option.value})}
                                    className={`p-2 rounded-lg border flex items-center justify-center transition-all ${formData.difficulty === option.value 
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    <span className={`font-medium ${option.color}`}>{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Total Questions */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                <TbNumber className="mr-2" />
                                Questions
                            </label>
                            <input
                                type="number"
                                name="totalQuestions"
                                value={formData.totalQuestions}
                                onChange={handleChange}
                                min="1"
                                max="20"
                                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Time per Question */}
                        <div className="space-y-2">
    <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
        <TbClock className="mr-2" />
        Time Per Question
    </label>
    <select
        name="timePerQuestion"
        value={formData.timePerQuestion}
        onChange={handleChange}
        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    >
        <option value="0.5">30 seconds</option>
        <option value="1">60 seconds</option>
        <option value="1.5">90 seconds</option>
        <option value="2">120 seconds</option>
        <option value="3">180 seconds</option>

    </select>
</div>
                    </div>

                    {/* Language Selection */}
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                            <FaCode className="mr-2" />
                            Programming Language
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {languageOptions.map((language) => (
                                <button
                                    key={language.value}
                                    type="button"
                                    onClick={() => setFormData({...formData, languageGuess: language.value})}
                                    className={`p-3 rounded-lg border flex items-center justify-center space-x-2 transition-all ${formData.languageGuess === language.value 
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    {language.icon}
                                    <span className="font-medium">{language.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating Quiz...
                            </>
                        ) : (
                            "Generate Quiz"
                        )}
                    </button>
                </form>

                <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                    <p>Your quiz will be AI-generated based on your preferences</p>
                </div>
            </div>
        </div>
    );
}