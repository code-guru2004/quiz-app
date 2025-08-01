'use client'
import { useState, useEffect } from 'react';

export default function MCQQuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [showMobileNav, setShowMobileNav] = useState(false);
  // Quiz details - customizable
  const quizDetails = {
    title: "Frontend Development Quiz",
    logo: "🧑‍💻", // Can replace with an actual image URL
    duration: 10, // minutes
    totalQuestions: 5
  };

  useEffect(() => {
    // Handle mobile detection
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);


    // Handle timer
    const timer = timeLeft > 0 && !submitted && setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    // Auto submit when time expires
    if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(timer);
    };
  }, [timeLeft, submitted]);

  const questions = [
    {
      id: 1,
      question: "What is the primary purpose of React's virtual DOM?",
      options: {
        a: "To directly manipulate the browser's DOM for better performance",
        b: "To provide a virtual representation of the UI in memory",
        c: "To replace the need for HTML in web applications",
        d: "To enable server-side rendering of components"
      },
      correctAnswer: "b"
    },
    {
      id: 2,
      question: "Which of the following is NOT a valid React hook?",
      options: {
        a: "useState",
        b: "useEffect",
        c: "useReducer",
        d: "useComponent"
      },
      correctAnswer: "d"
    },
    {
      id: 3,
      question: "In Next.js, what is the purpose of the 'getStaticProps' function?",
      options: {
        a: "To fetch data at request time",
        b: "To fetch data at build time",
        c: "To handle form submissions",
        d: "To configure API routes"
      },
      correctAnswer: "b"
    },
    {
      id: 4,
      question: "What does Tailwind CSS use to generate utility classes?",
      options: {
        a: "Sass preprocessing",
        b: "PostCSS with JavaScript configuration",
        c: "CSS custom properties",
        d: "Babel transformation"
      },
      correctAnswer: "b"
    },
    {
      id: 5,
      question: "Which of these is a benefit of using Next.js?",
      options: {
        a: "Built-in routing system",
        b: "Automatic code splitting",
        c: "Server-side rendering support",
        d: "All of the above"
      },
      correctAnswer: "d"
    }
  ];

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (optionKey) => {
    setSelectedOptions({
      ...selectedOptions,
      [currentQuestionIndex]: optionKey
    });
  };

  const handleMarkForReview = () => {
    setMarkedForReview({
      ...markedForReview,
      [currentQuestionIndex]: !markedForReview[currentQuestionIndex]
    });
  };

  const navigateToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    // Clear the timer when submitted
    clearInterval();
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((question, index) => {
      if (selectedOptions[index] === question.correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
<div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
  <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
    <div className="p-4 sm:p-6 md:p-8">
      {!submitted ? (
        <div className="flex flex-col-reverse lg:flex-row gap-4 sm:gap-6">
          <div className="lg:w-2/3">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-sm sm:text-base font-medium text-gray-500 dark:text-gray-400">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h2>
              <button
                onClick={handleMarkForReview}
                className={`px-2 py-1 text-xs sm:text-sm rounded-md ${markedForReview[currentQuestionIndex]
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-300 dark:bg-yellow-700 dark:text-yellow-100 dark:border-yellow-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {isMobile
                  ? (markedForReview[currentQuestionIndex] ? '✓ Review' : 'Review')
                  : (markedForReview[currentQuestionIndex] ? 'Marked for Review' : 'Mark for Review')
                }
              </button>
            </div>

            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3 sm:mb-4">
                {currentQuestion.question}
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {Object.entries(currentQuestion.options).map(([key, value]) => (
                  <div
                    key={key}
                    className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-colors ${selectedOptions[currentQuestionIndex] === key
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-700'
                      : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => handleOptionSelect(key)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center mr-2 sm:mr-3 ${selectedOptions[currentQuestionIndex] === key
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-400 dark:border-gray-500'
                        }`}
                      >
                        {selectedOptions[currentQuestionIndex] === key && (
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className="text-sm sm:text-base text-gray-700 dark:text-gray-200">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm rounded-md ${currentQuestionIndex === 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {isMobile ? '← Prev' : 'Previous'}
              </button>
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  {isMobile ? 'Next →' : 'Next'}
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-md bg-green-600 text-white hover:bg-green-700"
                >
                  {isMobile ? 'Submit' : 'Submit Quiz'}
                </button>
              )}
            </div>
          </div>
          {isMobile && showMobileNav && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
              <div className="fixed top-0 left-0 w-3/4 max-w-xs h-full bg-white dark:bg-gray-800 shadow-lg p-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Question Navigation</h2>
                  <button
                    onClick={() => setShowMobileNav(false)}
                    className="text-gray-500 dark:text-gray-400 text-xl font-bold"
                    aria-label="Close Navigation"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2 mb-4">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        navigateToQuestion(index);
                        setShowMobileNav(false);
                      }}
                      className={`w-8 h-8 rounded-md flex items-center justify-center text-sm ${currentQuestionIndex === index
                        ? 'bg-blue-600 text-white'
                        : markedForReview[index]
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-300 dark:bg-yellow-700 dark:text-yellow-100 dark:border-yellow-600'
                          : selectedOptions[index]
                            ? 'bg-green-100 text-green-800 border border-green-300 dark:bg-green-700 dark:text-green-100 dark:border-green-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-blue-600 mr-2"></div> Current
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-green-100 border border-green-300 dark:bg-green-700 dark:border-green-600 mr-2"></div> Answered
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-300 dark:bg-yellow-700 dark:border-yellow-600 mr-2"></div> Marked
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-700 mr-2"></div> Unanswered
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="lg:w-1/3">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <h3 className="font-medium text-sm sm:text-base text-gray-700 dark:text-gray-200 mb-2 sm:mb-3">
                {isMobile ? 'Navigate:' : 'Question Navigation'}
              </h3>
              <div className="grid grid-cols-5 gap-1 sm:gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => navigateToQuestion(index)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md flex items-center justify-center text-xs sm:text-sm ${currentQuestionIndex === index
                      ? 'bg-blue-600 text-white'
                      : markedForReview[index]
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-300 dark:bg-yellow-700 dark:text-yellow-100 dark:border-yellow-600'
                        : selectedOptions[index]
                          ? 'bg-green-100 text-green-800 border border-green-300 dark:bg-green-700 dark:text-green-100 dark:border-green-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              {!isMobile && (
                <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-blue-600 mr-2"></div>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Current</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-green-100 border border-green-300 dark:bg-green-700 dark:border-green-600 mr-2"></div>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Answered</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-yellow-100 border border-yellow-300 dark:bg-yellow-700 dark:border-yellow-600 mr-2"></div>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Marked</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-gray-100 dark:bg-gray-800 mr-2"></div>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Unanswered</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 sm:py-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 dark:text-green-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-1 sm:mb-2">Quiz Completed!</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-2">
            Time Taken: {formatTime(quizDetails.duration * 60 - timeLeft)}
          </p>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
            Your Score: <span className="font-bold">{calculateScore()}/{questions.length}</span> (
            {Math.round((calculateScore() / questions.length) * 100)}%)
          </p>
          <div className="space-y-3 sm:space-y-4 max-w-md mx-auto">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className={`p-3 sm:p-4 border rounded-lg ${selectedOptions[index] === question.correctAnswer
                  ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900'
                  : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900'
                }`}
              >
                <p className="font-medium text-sm sm:text-base text-gray-800 dark:text-white">{question.question}</p>
                <p className="text-xs sm:text-sm mt-1 text-gray-600 dark:text-gray-300">
                  Your answer: <span className="font-medium">{selectedOptions[index] ? question.options[selectedOptions[index]] : 'Not answered'}</span>
                </p>
                {selectedOptions[index] !== question.correctAnswer && (
                  <p className="text-xs sm:text-sm mt-1 text-gray-600 dark:text-gray-300">
                    Correct answer: <span className="font-medium">{question.options[question.correctAnswer]}</span>
                  </p>
                )}
                {markedForReview[index] && (
                  <p className="text-xs mt-1 text-yellow-700 dark:text-yellow-400">(Marked for review)</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
</div>
  );
}