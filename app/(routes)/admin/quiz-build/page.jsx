'use client'
import React, { useEffect, useState } from 'react'
import QuizBuildTitle from '../_components/QuizBuildTitle'
import QuizBuildQuestions from '../_components/QuizBuildQuestions'
import QuizBuildNavbar from '../_components/QuizBuildNavbar'
import { v4 as uuidv4 } from "uuid";

function QuizBuild() {
  const prefixes = ["A", "B", "C", "D", "E"];
    const [quizQuestions, setQuizQuestions] = useState([
      { id: uuidv4(), mainQuestion: "", choices: ["A.", "B.", "C."], correctAnswer: "" },
    ]);
    const [newQuiz, setNewQuiz] = useState({
      id : uuidv4(),
      quizTitle:"",
      quizIcon: 0,
      quizQuestions:quizQuestions
    });

    useEffect(() => {
      setNewQuiz({
        ...newQuiz,
        quizQuestions:quizQuestions
      })
    }, [quizQuestions])
    //change the title of the quiz
    function handleQuizTitleChange(title){
      setNewQuiz({
        ...newQuiz,
        quizTitle: title
      })
    }
// change the quiz icons
    function handleQuizIconChange(iconIndex){
      setNewQuiz({
        ...newQuiz,
        quizIcon : iconIndex,
      })
    }
    // 🛑 all props
    const quizNavbarProps={
      newQuiz,
      quizQuestions
    }
    const quizQuestionProps= {
      quizQuestions,
      setQuizQuestions
    }
    console.log(newQuiz);
    
  return (
    <div>
        <QuizBuildNavbar {...quizNavbarProps}/>
        <div className=''>
          <QuizBuildTitle  onQuizTitleChange={(title)=>handleQuizTitleChange(title)} onQuizIconChange={(iconIndex)=>handleQuizIconChange(iconIndex)}/>
          <QuizBuildQuestions {...quizQuestionProps}/>
        </div>
    </div>
  )
}

export default QuizBuild