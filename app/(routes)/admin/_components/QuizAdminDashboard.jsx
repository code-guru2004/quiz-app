"use client";
import useGlobalContextProvider from "@/app/_context/ContextApi";
import { ICONS } from "@/app/Icon";
import React, { useState } from "react";
import { MoreVertical, NotebookPen, Trash2 } from "lucide-react";
import { MdUpdate } from "react-icons/md";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

function QuizAdminDashboard() {
    const route = useRouter();
    const { allQuiz, setAllQuiz } = useGlobalContextProvider();
    const [openMenuIndex, setOpenMenuIndex] = useState(null);

    const handleDelete = async (id) => {
        // console.log(id);

        try {
            const response = await axios.post("/api/delete-quiz", { id });
            const filtered = allQuiz.filter((q, i) => q._id !== id);
            setAllQuiz(filtered);
            toast.success(response?.data.message);
            setOpenMenuIndex(null)
            route.refresh()
        } catch (error) {
            toast.error(response?.data.message)
        }
        // setOpenMenuIndex(null);
    };

    return (
        <div className="my-5 px-4">
            <h1 className="text-2xl font-mono flex items-center gap-2">
                <span className="relative flex size-4">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex size-4 rounded-full bg-red-500"></span>
                </span>
                All Quizzes
            </h1>

            <div className="p-4">
                <div className="overflow-x-auto bg-white shadow-md rounded-md border">
                    <table className="min-w-full table-auto text-sm">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="text-left p-3">Icon</th>
                                <th className="text-left p-3">Quiz Title</th>
                                <th className="text-left p-3">Questions</th>
                                <th className="text-left p-3">Duration</th>
                                <th className="text-left p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allQuiz.map((quiz, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50 transition-all relative">
                                    <td className="p-3">{ICONS[quiz?.quizIcon]?.icon}</td>
                                    <td className="p-3">{quiz?.quizTitle}</td>
                                    <td className="p-3">{quiz?.quizQuestions?.length}</td>
                                    <td className="p-3">60 sec</td>
                                    <td className="p-3 relative">
                                        <button
                                            onClick={() =>
                                                setOpenMenuIndex(index === openMenuIndex ? null : index)
                                            }
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>

                                        {openMenuIndex === index && (
                                            <div className="absolute top-0 z-10 right-14 bg-white border rounded shadow-md w-28">
                                                <button
                                                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                                    onClick={() => handleDelete(quiz._id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </button>
                                                <button
                                                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-green-600 hover:bg-green-100"
                                                    onClick={() => handleDelete(index)}
                                                >
                                                    <NotebookPen className="w-4 h-4" />
                                                    Modify
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {allQuiz.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-6 text-gray-400">
                                        No quizzes found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default QuizAdminDashboard;
