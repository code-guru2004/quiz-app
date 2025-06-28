"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import React, {
  createRef,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import QuizOptions from "./QuizOptions";

function QuizBuildQuestions({ quizQuestions, setQuizQuestions }) {
  const prefixes = ["A", "B", "C", "D", "E"];
  const endQuestionRef = useRef(null);
  const textAreaRefs = useRef([]);

  const addNewQuestion = () => {
    for (let i = 0; i < quizQuestions.length; i++) {
      const q = quizQuestions[i];
      const isMainEmpty = q.mainQuestion.trim() === "";
      const hasEmptyChoice = q.choices.some((choice) => {
        const content = choice.slice(3).trim();
        return content.length === 0;
      });
      const isInsufficientChoices = q.choices.length < 3;
      const isAnswerEmpty = q.correctAnswer.trim() === "";

      if (isMainEmpty || hasEmptyChoice || isInsufficientChoices) {
        isMainEmpty
          ? toast.error(`Please complete question ${i + 1}.`)
          : toast.error(`Please fill options in question ${i + 1}.`);
        const ref = textAreaRefs.current[i];
        if (ref && ref.current) {
          ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
          ref.current.focus();
        }
        return;
      } else if (isAnswerEmpty) {
        toast.error("Write the answer first");
        return;
      }
    }

    const newQuestion = {
      id: uuidv4(),
      mainQuestion: "",
      choices: ["A. ", "B. ", "C. "],
      correctAnswer: "",
    };
    setQuizQuestions([...quizQuestions, newQuestion]);
    toast.success("New Question added.");
  };

  function delteQuestion(question) {
    const filtered = quizQuestions.filter((q) => q.id !== question.id);
    const updatedRefs = textAreaRefs.current.filter(
      (_, idx) => quizQuestions[idx].id !== question.id
    );
    textAreaRefs.current = updatedRefs;
    setQuizQuestions(filtered);

    toast("Question Deleted", {
      icon: "🧹",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  }

  useEffect(() => {
    textAreaRefs.current = quizQuestions.map(
      (_, i) => textAreaRefs.current[i] || createRef()
    );
  }, [quizQuestions]);

  useEffect(() => {
    if (endQuestionRef.current) {
      endQuestionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [quizQuestions.length]);

  const handleInputChange = (questionIdx, text) => {
    const updated = quizQuestions.map((q, idx) =>
      idx === questionIdx ? { ...q, mainQuestion: text } : q
    );
    setQuizQuestions(updated);
  };

  function updateTheChoicesArray(text, choiceIndex, questionIndex) {
    const updatedQuestions = quizQuestions.map((question, i) => {
      if (questionIndex === i) {
        const updatedChoices = question.choices.map((choice, j) =>
          j === choiceIndex ? prefixes[j] + ". " + text : choice
        );
        return { ...question, choices: updatedChoices };
      }
      return question;
    });
    setQuizQuestions(updatedQuestions);
  }

  function handleFillingAnswer(answer, questionIndex) {
    const updated = quizQuestions.map((q, idx) =>
      idx === questionIndex ? { ...q, correctAnswer: answer } : q
    );
    setQuizQuestions(updated);
  }

  return (
    <div className="w-full p-3 mt-3 flex justify-between border border-green-700 dark:border-green-500 rounded-md bg-white dark:bg-gray-800">
      <div className="flex flex-col w-full gap-3">
        <div className="flex gap-2 items-center">
          <div className="bg-green-700 px-4 py-2 rounded-md text-white">4</div>
          <span className="font-bold text-black dark:text-white">Quiz questions</span>
        </div>

        {quizQuestions.map((question, idx) => (
          <div
            key={idx}
            ref={quizQuestions.length - 1 === idx ? endQuestionRef : null}
            className="border ml-5 p-4 mt-4 flex-col border-green-700 dark:border-green-500 border-opacity-50 rounded-md flex justify-center relative bg-white dark:bg-gray-800"
          >
            <SingleQuestion
              ref={textAreaRefs.current[idx]}
              questionIndex={idx}
              value={question.mainQuestion}
              onChange={(e) => handleInputChange(idx, e.target.value)}
            />
            <QuizOptions
              questionIndex={idx}
              singleQuestion={question}
              quizQuestions={quizQuestions}
              setQuizQuestions={setQuizQuestions}
              value={question.choices}
              onChangeChoice={(text, choiceIndex, questionIndex) => {
                updateTheChoicesArray(text, choiceIndex, questionIndex);
              }}
            />
            <AnswerInputSection
              onAnswerChange={(text) => handleFillingAnswer(text, idx)}
            />
            {idx !== 0 && (
              <Trash
                className="text-red-700 dark:text-red-400 cursor-pointer w-5 right-2 hover:bg-amber-100 dark:hover:bg-amber-800 absolute top-1"
                onClick={() => delteQuestion(question)}
              />
            )}
          </div>
        ))}

        <div className="w-full flex items-center justify-center mt-3">
          <Button
            className="bg-green-700 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500 cursor-pointer"
            onClick={addNewQuestion}
          >
            Add New Question
          </Button>
        </div>
      </div>
    </div>
  );
}

export default QuizBuildQuestions;

// ------------------ Sub Components ------------------

const SingleQuestion = forwardRef(function SingleQuestion(
  { questionIndex, value, onChange },
  ref
) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3">
        <div className="flex gap-2 text-[15px] text-black dark:text-white">
          <span>Question:</span>
          <span>{questionIndex + 1}</span>
        </div>
        <textarea
          ref={ref}
          className="border border-gray-200 dark:border-gray-600 rounded-md p-3 mt-3 w-full h-[50px] resize-none text-[13px] outline-none bg-white dark:bg-gray-800 text-black dark:text-white shadow-2xs"
          placeholder="Your question here..."
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
});

function AnswerInputSection({ onAnswerChange }) {
  const [correctAnswer, setCorrectAnswer] = useState("");

  const handleAnswerChange = (answer) => {
    const upper = answer.toUpperCase();
    if (upper === "" || ["A", "B", "C", "D", "E"].includes(upper)) {
      setCorrectAnswer(upper);
      onAnswerChange(upper);
    } else {
      toast("Invalid Answer", {
        icon: "⚠️",
        style: {
          background: "#333",
          color: "#fff",
          borderRadius: "10px",
        },
      });
    }
  };

  return (
    <div className="flex gap-2 items-center mt-2">
      <h1 className="text-[15px] text-black dark:text-white">Answer</h1>
      <input
        className="text-[12px] border border-gray-200 dark:border-gray-600 p-2 w-full rounded-md outline-none shadow bg-white dark:bg-gray-800 text-black dark:text-white"
        placeholder={`Write correct answer`}
        value={correctAnswer}
        maxLength={1}
        onChange={(e) => handleAnswerChange(e.target.value)}
      />
    </div>
  );
}
