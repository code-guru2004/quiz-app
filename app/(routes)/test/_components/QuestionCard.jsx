// components/QuestionCard.jsx
import { useState } from "react";
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function QuestionCard({ question }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelect = (opt) => {
    if (!submitted) setSelected(opt);
  };

  const handleSubmit = () => {
    if (selected) {
      setSubmitted(true);
      setShowExplanation(true);
    }
  };

  const toggleExplanation = () => {
    setShowExplanation(!showExplanation);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl">
      {/* Question Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            <span className="text-blue-600 dark:text-blue-400 mr-2">
              {question.id}.
            </span>
            {question.question}
          </h2>
        </div>
      </div>

      {/* Options */}
      <div className="px-6 pb-4 space-y-3">
        {question.options.map((opt, idx) => {
          const isCorrect = opt === question.correctAnswer;
          const isSelected = opt === selected;
          const isSubmittedAndCorrect = submitted && isCorrect;
          const isSubmittedAndWrong = submitted && isSelected && !isCorrect;

          let optionStyle = "border-gray-200 dark:border-gray-600";
          if (isSelected && !submitted) {
            optionStyle = "border-blue-500 bg-blue-50 dark:bg-blue-900/30";
          } else if (isSubmittedAndCorrect) {
            optionStyle = "border-green-500 bg-green-50 dark:bg-green-900/20";
          } else if (isSubmittedAndWrong) {
            optionStyle = "border-red-500 bg-red-50 dark:bg-red-900/20";
          }

          return (
            <label
              key={idx}
              className={`flex items-center justify-between p-4 rounded-lg cursor-pointer border transition-all duration-200 ${optionStyle} ${
                !submitted && "hover:border-blue-400"
              }`}
            >
              <div className="flex items-center gap-3 w-full">
                <div
                  className={`flex items-center justify-center w-5 h-5 rounded-full border flex-shrink-0 transition-all ${
                    isSelected || isSubmittedAndCorrect
                      ? "border-transparent"
                      : "border-gray-400"
                  } ${
                    isSelected && !submitted
                      ? "bg-blue-500"
                      : isSubmittedAndCorrect
                      ? "bg-green-500"
                      : isSubmittedAndWrong
                      ? "bg-red-500"
                      : "bg-transparent"
                  }`}
                >
                  {isSelected && !submitted && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="text-gray-800 dark:text-gray-200">{opt}</span>
              </div>

              {/* Feedback Icons */}
              {submitted && (isSelected || isCorrect) && (
                <div className="ml-3 flex-shrink-0">
                  {isCorrect ? (
                    <CheckCircle className="text-green-500 w-5 h-5" />
                  ) : isSelected ? (
                    <XCircle className="text-red-500 w-5 h-5" />
                  ) : null}
                </div>
              )}
              <input
                type="radio"
                name={`q-${question.id}`}
                value={opt}
                checked={isSelected}
                onChange={() => handleSelect(opt)}
                disabled={submitted}
                className="hidden"
              />
            </label>
          );
        })}
      </div>

      {/* Submit Button */}
      {!submitted && (
        <div className="px-6 pb-6">
          <button
            onClick={handleSubmit}
            disabled={!selected}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              selected
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            }`}
          >
            Submit Answer
          </button>
        </div>
      )}

      {/* Explanation */}
      {submitted && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div
            className="px-6 py-4 flex justify-between items-center cursor-pointer"
            onClick={toggleExplanation}
          >
            <div className="flex items-center">
              <span
                className={`font-semibold ${
                  selected === question.correctAnswer
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {selected === question.correctAnswer ? "Correct!" : "Incorrect"}
              </span>
              <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">
                {showExplanation ? "Hide explanation" : "Show explanation"}
              </span>
            </div>
            {showExplanation ? (
              <ChevronUp className="text-gray-500 w-5 h-5" />
            ) : (
              <ChevronDown className="text-gray-500 w-5 h-5" />
            )}
          </div>

          {showExplanation && (
            <div className="px-6 pb-6 pt-2 bg-gray-50 dark:bg-gray-700/30">
              <div className="mb-3">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  Correct answer:{" "}
                </span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {question.correctAnswer}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {question.explanation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}