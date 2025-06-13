"use client";

import { Button } from "@/components/ui/button";

import { Cross, Trash } from "lucide-react";
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

function QuizBuildQuestions({quizQuestions,setQuizQuestions}) {
  const prefixes = ["A", "B", "C", "D", "E"];
  // const [quizQuestions, setQuizQuestions] = useState([
  //   { id: uuidv4(), 
  //     mainQuestion: "", 
  //     choices: ["A.", "B.", "C."], 
  //     answer: "" },
  // ]);

  const endQuestionRef = useRef(null);
  const textAreaRefs = useRef([]);

  const addNewQuestion = () => {
    // Check validation
    for (let i = 0; i < quizQuestions.length; i++) {
      const q = quizQuestions[i];
      const isMainEmpty = q.mainQuestion.trim() === "";
      const hasEmptyChoice = q.choices.some((choice) => {
        const content = choice.slice(3).trim(); // Remove "A. ", "B. ", etc.
        return content.length === 0;
      });

      const isInsufficientChoices = q.choices.length < 3;
      const isAnswerEmpty = q.correctAnswer.trim()===""; //🟡 check the answser is empty or not i.e. validation is already done in the AnswerInputSection section
      if (isMainEmpty || hasEmptyChoice || isInsufficientChoices) {
        isMainEmpty
          ? toast.error(`Please complete question ${i + 1}.`)
          : toast.error(`Please fill options in question ${i + 1}.`);

        // Scroll to unfilled question
        const ref = textAreaRefs.current[i];
        //console.log(ref);

        if (ref && ref.current) {
          ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
          ref.current.focus();
        }
        return; // Block adding
      }
      else if(isAnswerEmpty){
        toast.error("Write the answer first")
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
    //console.log(question);

    const filterQuestionToDelete = quizQuestions.filter(
      (ques) => question.id != ques.id
    );
    const updatesRef = textAreaRefs.current.filter((ref, idx) => {
      return quizQuestions[idx].id != question.id;
    });
    textAreaRefs.current = updatesRef;
    setQuizQuestions(filterQuestionToDelete);
    // toast notification
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

  // Scroll To the last Question
  useEffect(() => {
    if (endQuestionRef.current) {
      endQuestionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [quizQuestions.length]);

  // Input questions
  const handleInputChange = (questionIdx, text) => {
    const updatedQuestionList = quizQuestions.map((question, idx) => {
      if (questionIdx === idx) {
        return { ...question, mainQuestion: text };
      }
      return question;
    });
    setQuizQuestions(updatedQuestionList);
  };

  useEffect(() => {
    // Focus the last textarea if it exists
    const lastTextAreaIndex = quizQuestions.length - 1;
    if (lastTextAreaIndex >= 0) {
      //const lastTextArea = textAreaRefs.current[lastTextAreaIndex].current;
      // if (lastTextArea) {
      //   lastTextArea.focus();
      // }
    }
  }, [quizQuestions.length]);

  // Update the choices of a particuler question
  function updateTheChoicesArray(text, choiceIndex, questionIndex) {
    const updatedQuestions = quizQuestions.map((question, i) => {
      if (questionIndex === i) {
        const updatedChoices = question.choices.map((choice, j) => {
          if (choiceIndex === j) {
            return prefixes[j] + ". " + text;
          } else {
            return choice;
          }
        });

        return { ...question, choices: updatedChoices };
      }

      return question;
    });

    setQuizQuestions(updatedQuestions);
  }
  // Update the correct answer
  function handleFillingAnswer(answer,questionIndex){
    const updatedQuestionList = quizQuestions.map((question, idx) => {
      if (questionIndex === idx) {
        return { ...question, correctAnswer: answer };
      }
      return question;
    });
    setQuizQuestions(updatedQuestionList);
  }

 // console.log(quizQuestions);
  return (
    <div className="w-full p-3  mt-3 flex justify-between border border-green-700 rounded-md">
      <div className="flex flex-col w-full gap-3">
        <div className="flex gap-2 items-center">
          <div className="bg-green-700 px-4 py-2 rounded-md text-white">4</div>
          <span className="font-bold">Quiz questions</span>
        </div>
        {quizQuestions.map((question, idx) => (
          <div
            key={idx}
            className="border ml-5 p-4 mt-4 flex-col  border-green-700 
        border-opacity-50 rounded-md flex justify-center relative"
            ref={quizQuestions.length - 1 === idx ? endQuestionRef : null}
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
              onAnswerChange={(text)=>{
                handleFillingAnswer(text,idx)
              }}
            />
            {/* Delete Question Btn */}
            {idx != 0 && (
              <Trash
                className="text-red-700 cursor-pointer w-5 right-2 hover:bg-amber-100 absolute top-1"
                onClick={() => {
                  delteQuestion(question);
                }}
              />
            )}
          </div>
        ))}

        {/* Button add */}
        <div className="w-full flex items-center justify-center mt-3">
          <Button
            className="bg-green-700 hover:bg-green-600 cursor-pointer "
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

const SingleQuestion = forwardRef(function SingleQuestion(
  { questionIndex, value, onChange },
  ref
) {
  //console.log(questionIndex);

  return (
    <div className="w-full">
      <div className="flex items-center gap-3">
        <div className="flex gap-2 text-[15px] border-gray-200">
          <span>Question:</span>
          <span>{questionIndex + 1}</span>
        </div>
        <textarea
          ref={ref} // 👈 Attach ref here
          className={
            "border border-gray-200 rounded-md p-3 mt-3 w-full h[50px] resize-none text-[13px] outline-none  shadow-2xs"
          }
          placeholder="Your question here..."
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
});


function AnswerInputSection({onAnswerChange}) {
  const [correctAnswer, setCorrectAnswer] = useState("");

  // 🛑 handle the change of input in correct answer section
  const handleAnswerChange=(answer)=>{
    const upperTextAnswer = answer.toUpperCase(); // always answer stored in Uppercase "A", "B", "C","D","E"
    if(upperTextAnswer===""||["A", "B", "C","D","E"].includes(upperTextAnswer)){
      setCorrectAnswer(upperTextAnswer)
      onAnswerChange(upperTextAnswer)
    }else{
      toast(`Invalid Answer`, { //🟢 toast notification
        icon: "⚠️",
        style: {
            background: "#333",
            color: "#fff",
            borderRadius: "10px",
        },
      });
    }
  }

  return (
    <div className="flex gap-2 items-center">
      <h1 className="text-[15px]">Answer</h1>
      <input
        className="text-[12px] border border-gray-200 p-2 w-full rounded-md outline-none shadow"
        placeholder={`Write correct answer`}
        value={correctAnswer}
        maxLength={1}
        onChange={(e)=>handleAnswerChange(e.target.value)}
      />
    </div>
  );
}
