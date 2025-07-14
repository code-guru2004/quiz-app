"use client";
import { useState } from "react";
import MathLiveEditor from "./_components/MathLiveEditor";

export default function MathTestPage() {
  const [questionHTML, setQuestionHTML] = useState("");

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">MathLive + TipTap Test</h1>

      <MathLiveEditor onChange={setQuestionHTML} />

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Raw Output (for MongoDB):</h2>
        <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
          {questionHTML}
        </pre>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Rendered Preview:</h2>
        <div
          className="prose max-w-none border p-4 rounded "
          dangerouslySetInnerHTML={{ __html: questionHTML }}
        />
      </div>
    </div>
  );
}
