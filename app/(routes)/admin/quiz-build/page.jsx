'use client'
import React, { useEffect, useState } from 'react'
import QuizBuildTitle from '../_components/QuizBuildTitle'
import QuizBuildQuestions from '../_components/QuizBuildQuestions'
import QuizBuildNavbar from '../_components/QuizBuildNavbar'
import { v4 as uuidv4 } from "uuid";
import QuizTimer from '../_components/QuizTimer'
import QuizDescription from '../_components/QuizDescription'

function QuizBuild() {
  const prefixes = ["A", "B", "C", "D", "E"];
    const [quizQuestions, setQuizQuestions] = useState([
      { id: uuidv4(), mainQuestion: "",mainQuestionImage:"", choices: ["A.", "B.", "C."], correctAnswer: "" },
    ]);
    const [newQuiz, setNewQuiz] = useState({
      id : uuidv4(),
      quizTitle:"",
      quizIcon: 0,
      quizDescription:"",
      quizTime: 1,
      quizQuestions:quizQuestions,
      quizMode: 'Live Quiz',
      quizCategory: '',
    });
    // prevent the auto scrolling
    useEffect(() => {
      const x = window.scrollX;
      const y = window.scrollY;
      window.scrollTo(x, y);
    }, []);
    
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
    // handle the description change
    function handleDescriptionChange(text){
      setNewQuiz({
        ...newQuiz,
        quizDescription : text
      })
    }
    // handle the change the quiz timer
    function handleQuizTimerChange(time){
      setNewQuiz({
        ...newQuiz,
        quizTime : time
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
    // useEffect(()=>{
      
    //   console.log(newQuiz);
    // },[newQuiz])
  return (
    <div className='px-3'>
        <QuizBuildNavbar {...quizNavbarProps}/>
        <div className=''>
          <QuizBuildTitle  onQuizTitleChange={(title)=>handleQuizTitleChange(title)} onQuizIconChange={(iconIndex)=>handleQuizIconChange(iconIndex)}/>
            <QuizTimer onTimerChange={(time)=>handleQuizTimerChange(time)}/>
            <QuizDescription onDescriptionChange={(text)=>handleDescriptionChange(text)}/>
          <QuizBuildQuestions {...quizQuestionProps}/>
        </div>
    </div>
  )
}

export default QuizBuild;