"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import toast from "react-hot-toast";

export default function QuizOptions({
  questionIndex,
  singleQuestion,
  quizQuestions,
  setQuizQuestions,
  onChangeChoice,
}) {
  const choice = ["A", "B", "C", "D", "E"];
  const positions = ["First", "Second", "Third", "Fourth", "Fifth"];
  const { choices } = singleQuestion;

  const addNewOption = () => {
    const currentChoices = quizQuestions[questionIndex].choices;

    for (let i = 0; i < choices.length; i++) {
      let isEmptyChoice = choices[i].slice(3).trim() === "";
      if (isEmptyChoice) {
        toast(`Fill option ${choice[i]} before adding more`, {
          icon: "⚠️",
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "10px",
          },
        });
        return;
      }
    }

    if (currentChoices.length >= choice.length) {
      toast.error("Maximum number of options reached.", {
        icon: "🚫",
        style: {
          background: "#333",
          color: "#fff",
          borderRadius: "10px",
        },
      });
      return;
    }

    const newChoicePrefix = choice[currentChoices.length] + ". ";
    const updatedQuestions = quizQuestions.map((question, idx) => {
      if (idx === questionIndex) {
        return {
          ...question,
          choices: [...question.choices, newChoicePrefix],
        };
      }
      return question;
    });

    setQuizQuestions(updatedQuestions);
  };

  const deleteLastOption = () => {
    const currentChoices = quizQuestions[questionIndex].choices;
    const currentLength = currentChoices.length;

    if (currentLength <= 3) return;

    const updatedQuestions = quizQuestions.map((question, idx) => {
      if (idx === questionIndex) {
        let newChoices = [...question.choices];
        if (currentLength === 5) {
          newChoices[3] = newChoices[4].replace(/^E\./, "D.");
          newChoices.pop();
        } else if (currentLength === 4) {
          newChoices.pop();
        }

        return {
          ...question,
          choices: newChoices,
        };
      }
      return question;
    });

    setQuizQuestions(updatedQuestions);

    toast("Option removed", {
      icon: "🗑",
      style: {
        background: "#333",
        color: "#fff",
        borderRadius: "10px",
      },
    });
  };

  const handleChoiceChangeInput = (text, choiceIndex, questionIndex) => {
    onChangeChoice(text, choiceIndex, questionIndex);
  };

  return (
    <div className="flex gap-3 items-center mt-3">
      <div className="text-[15px] text-black dark:text-white">Choices</div>
      <div className="flex flex-col gap-3 w-full items-center">
        <div className="border border-gray-300 dark:border-gray-600 shadow-2xs rounded-md p-4 w-full bg-white dark:bg-gray-800">
          {choices.map((singleChoice, idx) => (
            <div className="flex gap-2 items-center mt-3" key={idx}>
              <span className="text-black dark:text-white">{choice[idx]}:</span>
              <input
                className="text-[12px] border border-gray-200 dark:border-gray-700 p-2 w-full rounded-md outline-none shadow bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                placeholder={`Write ${positions[idx]} Option`}
                value={singleChoice.slice(3)}
                onChange={(e) =>
                  handleChoiceChangeInput(e.target.value, idx, questionIndex)
                }
              />
              {(choice[idx] === "D" || choice[idx] === "E") && (
                <button
                  onClick={deleteLastOption}
                  className="ml-0.5 px-1 py-1 text-xs text-red-600 border border-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900"
                >
                  ❌
                </button>
              )}
            </div>
          ))}
        </div>

        <div>
          <Button
            className="text-white bg-sky-500 hover:bg-sky-600 hover:shadow-xs cursor-pointer"
            onClick={addNewOption}
          >
            Add Option
          </Button>
        </div>
      </div>
    </div>
  );
}
