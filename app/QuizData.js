'use client';
//import { faCode } from '@fortawesome/free-solid-svg-icons';

export const quizzesData = [
  {
    id: 1,
    quizTitle: 'Javascript Quiz',
    quizIcon : 4,
    quizQuestions: [
      {
        id: 1,
        mainQuestion: 'What is the purpose of JavaScript?',
        choices: [
          'A. To style HTML elements',
          'B. To add interactivity to web pages',
          'C. To define the structure of a web page',
          'D. To perform server-side operations',
        ],
        correctAnswer: 'B',
        answeredResult: -1,
        statistics: {
          totalAttempts: 0,
          correctAttempts: 0,
          incorrectAttempts: 0,
        },
      },
      {
        id: 2,
        mainQuestion:
          'Which keyword is used to declare variables in JavaScript?',
        choices: ['A. var', 'B. let', 'C. const', 'D. variable'],
        correctAnswer: 'B',
        answeredResult: -1,
        statistics: {
          totalAttempts: 0,
          correctAttempts: 0,
          incorrectAttempts: 0,
        },
      },
      {
        id: 3,
        mainQuestion: "What does 'this' keyword refer to in JavaScript?",
        choices: [
          'A. The current function',
          'B. The global object',
          'C. The object that invoked the function',
          'D. None of the above',
        ],
        correctAnswer: 'B',
        answeredResult: -1,
        statistics: {
          totalAttempts: 0,
          correctAttempts: 0,
          incorrectAttempts: 0,
        },
      },
      {
        id: 4,
        mainQuestion:
          "What is the use of the Array method 'map' in JavaScript?",
        choices: [
          'A. To loop over the array',
          'B. To modify each item in the array and create a new array',
          'C. To check if a particular element exists in the array',
          'D. To add a new element to the array',
        ],
        correctAnswer: 'B',
        answeredResult: -1,
        statistics: {
          totalAttempts: 0,
          correctAttempts: 0,
          incorrectAttempts: 0,
        },
      },
      {
        id: 5,
        mainQuestion: 'How do you declare a function in JavaScript?',
        choices: [
          'A. function = myFunction()',
          'B. function myFunction()',
          'C. var myFunction = function()',
          'D. Both B and C',
        ],
        correctAnswer: 'B',
        answeredResult: -1,
        statistics: {
          totalAttempts: 0,
          correctAttempts: 0,
          incorrectAttempts: 0,
        },
      },
    ],
  },
  {
    id: 2,
    icon: '🛑',
    quizTitle: 'React Quiz',
    quizIcon : 3,
    quizQuestions: [
      {
        id: 1,
        mainQuestion: 'What is React?',
        choices: [
          'A. A back-end framework',
          'B. A front-end framework',
          'C. A database management system',
          'D. A programming language',
        ],
        correctAnswer: 'B',
        // B. A front-end framework
        answeredResult: -1,
        statistics: {
          totalAttempts: 0,
          correctAttempts: 0,
          incorrectAttempts: 0,
        },
      },
      {
        id: 2,
        mainQuestion: 'What is JSX?',
        choices: [
          'A. JavaScript XML',
          'B. JavaScript Extended',
          'C. JavaScript Execution',
          'D. JavaScript XSLT',
        ],
        correctAnswer: 'B',
        // A. JavaScript XML
        answeredResult: -1,
        statistics: {
          totalAttempts: 0,
          correctAttempts: 0,
          incorrectAttempts: 0,
        },
      },
    ],
  },
  {
    id: 3,
    icon: '🛑',
    quizTitle: 'React Quiz',
    quizIcon : 5,
    quizQuestions: [
      {
        id: 1,
        mainQuestion: 'What is React?',
        choices: [
          'A. A back-end framework',
          'B. A front-end framework',
          'C. A database management system',
          'D. A programming language',
        ],
        correctAnswer: 'B',
        // B. A front-end framework
        answeredResult: -1,
        statistics: {
          totalAttempts: 0,
          correctAttempts: 0,
          incorrectAttempts: 0,
        },
      },
      {
        id: 2,
        mainQuestion: 'What is JSX?',
        choices: [
          'A. JavaScript XML',
          'B. JavaScript Extended',
          'C. JavaScript Execution',
          'D. JavaScript XSLT',
        ],
        correctAnswer: 'B',
        // A. JavaScript XML
        answeredResult: -1,
        statistics: {
          totalAttempts: 0,
          correctAttempts: 0,
          incorrectAttempts: 0,
        },
      },
    ],
  },
];
