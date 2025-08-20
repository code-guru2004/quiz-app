// app/quiz/page.jsx
"use client";

import { useState } from "react";
import QuestionCard from "./_components/QuestionCard";
import { questions } from "@/app/QuizData"; 

export default function QuizPage() {
  const [page, setPage] = useState(1);
  const questionsPerPage = 5;

  const startIndex = (page - 1) * questionsPerPage;
  const currentQuestions = questions.slice(startIndex, startIndex + questionsPerPage);

  const totalPages = Math.ceil(questions.length / questionsPerPage);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {currentQuestions.map((q) => (
        <QuestionCard key={q.id} question={q} />
      ))}

      {/* Pagination */}
      <div className="flex justify-between mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 rounded-lg bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>
        <p className="text-gray-700 dark:text-gray-300">
          Page {page} of {totalPages}
        </p>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
