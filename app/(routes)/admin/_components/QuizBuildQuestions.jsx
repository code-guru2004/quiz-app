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
import Lottie from "lottie-react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { GrView } from "react-icons/gr";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { FiLoader } from "react-icons/fi";

function QuizBuildQuestions({ quizQuestions, setQuizQuestions }) {
  const prefixes = ["A", "B", "C", "D", "E"];
  const endQuestionRef = useRef(null);
  const textAreaRefs = useRef([]);
  useEffect(() => {
    console.log(quizQuestions);

  }, [quizQuestions])
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
      mainQuestionImage: "",
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

  const handleImageUpload = (url, questionIdx) => {
    const updated = quizQuestions.map((q, idx) =>
      idx === questionIdx ? { ...q, mainQuestionImage: url } : q
    );
    setQuizQuestions(updated);
  };

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
              onImageUpload={(url) => handleImageUpload(url, idx)}
              imageUrl={question.mainQuestionImage}
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
  { questionIndex, value, onChange, onImageUpload, imageUrl },
  ref
) {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [animationImage, setAnimationImage] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImageChanged, setIsImageChanged] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const animate = await fetch("/assets/upload-image.json");
        const data = await animate.json();
        setAnimationImage(data);
      } catch (error) {
        console.error("Failed to load Lottie animations:", error);
      }
    }
    loadAnimation()
  }, [])
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setIsImageChanged(true)
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    setIsLoading(true)
    if (!image) return;

    const formData = new FormData();
    formData.append("file", image);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploadedUrl(data.data.url);
    setIsImageChanged(false); // ✅ Image is no longer changed, upload is done
    if (data.data.url) {
      onImageUpload(data.data.url);
      setIsLoading(false)
    }
  };


  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-3">
        <div className="text-[15px] font-medium text-black dark:text-white">
          Question {questionIndex + 1}
        </div>
      </div>

      <div className="flex">
        <textarea
          ref={ref}
          className="border border-gray-300 dark:border-gray-600 rounded-md p-3 w-full min-h-[60px] resize-none text-sm outline-none bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm"
          placeholder="Type your question here..."
          value={value}
          onChange={onChange}
        />

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              id={`upload-${questionIndex}`}
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Clickable image preview or default icon */}
            <label htmlFor={`upload-${questionIndex}`} className="cursor-pointer ml-2">
              {previewUrl || imageUrl ? (
                <img
                  src={previewUrl || imageUrl}
                  alt="Question"
                  className="w-16 h-16 object-cover rounded-md border border-gray-300 dark:border-gray-600"
                />
              ) : (
                <div className="">
                  <Lottie
                    animationData={animationImage}
                    loop
                    autoplay
                    // Responsive sizing for Lottie animation
                    className="w-20 h-20  drop-shadow-2xl"
                  />
                </div>
              )}
            </label>

            {/* Upload Button */}
            {/* Upload Button */}
            {image && isImageChanged && (
              <Button
                type="button"
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-md text-xs"
                onClick={handleUpload}
              >
                {
                  isLoading?(
                      <FiLoader className="size-6 custom-spinner" />
                  ):(
                    <IoCloudUploadOutline className="size-4" />
                  )
                }
              </Button>
            )}

            {/* View Button */}
            {!isImageChanged && (uploadedUrl || imageUrl) && (
              <Button
                type="button"
                onClick={() => setIsDialogOpen(true)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-xs"
              >
                View
              </Button>
            )}


            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="sm:max-w-md">
                {/* Remove DialogHeader if you don't want the X icon */}
                <div>
                  <h2 className="text-lg font-semibold mb-2 text-black dark:text-white">
                    Uploaded Image
                  </h2>
                  <img
                    src={uploadedUrl || imageUrl || previewUrl}
                    alt="Uploaded"
                    className="w-full h-auto object-contain rounded"
                  />
                  <div className="flex justify-end mt-4">
                    <Button
                      type="button"
                      onClick={() => setIsDialogOpen(false)}
                      className="bg-red-600 hover:bg-red-500 text-white px-4 py-1 rounded-md text-sm"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
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
