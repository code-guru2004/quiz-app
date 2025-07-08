
![Logo](https://github.com/user-attachments/assets/e7378701-ce02-40b3-a3f9-e6037d2eb6b0)


# Project Title

Quizo

# Description
Welcome to the ultimate quiz experience! Our application Quizo lets you attend quizzes across diverse categories. Easily view your score after each quiz and monitor your performance. Compete with others to climb the ranks and show off your expertise. Get ready to quiz, learn, and win!
## Tech Stack

**Client:** React, ContextApi, TailwindCSS

**Server:** Node, Express


## Demo

www.quizo-eta.vercel.app
## Installation

Install my-project with npm

```bash
  npm install quiz-app
  cd quiz-app
```
    
## License


[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)



## Authors

- [@nayan](https://github.com/code-guru2004)


## Feedback

If you have any feedback, please reach out to us at https://letterbox-beta.vercel.app/send-message/quizo


## Environment Variables

To run this project, you will need to add the following environment variables to your .env or .evn.local file


`ADMIN_USERNAME=`


`HASHED_ADMIN_PASSWORD=`


`MONGODB_URI=`


`JWT_SECRET=`

## License

[MIT](https://choosealicense.com/licenses/mit/)

## File Structure
app/
    ├── _context/
        └── ContextApi.js
    ├── (routes)/
        ├── (auth)/
            ├── sign-in/
                └── page.js
            └── sign-up/
                └── page.js
        ├── admin/
            ├── _components/
                ├── Navbar.jsx
                ├── QuizAdminDashboard.jsx
                ├── QuizBuildNavbar.jsx
                ├── QuizBuildQuestions.jsx
                ├── QuizBuildTitle.jsx
                ├── QuizDescription.jsx
                ├── QuizOptions.jsx
                ├── QuizTimer.jsx
                ├── Sidebar.jsx
                └── Statsbar.jsx
            ├── preparation/
                └── page.jsx
            ├── quiz-build/
                └── page.jsx
            ├── layout.jsx
            └── page.jsx
        ├── ai-quiz-attend/
            └── page.jsx
        ├── challenge-quiz/
            └── [challengeId]/
                └── page.jsx
        ├── dashboard/
            ├── _component/
                ├── Footer.jsx
                ├── Header.jsx
                ├── Placeholder.jsx
                ├── PracticeProgressChart .jsx
                ├── QuizArea.jsx
                ├── QuizCard.jsx
                ├── QuizCard1.jsx
                ├── SearchFriends.jsx
                └── Sidebar.jsx
            ├── 1vs1-quiz/
                └── page.jsx
            ├── ai-quiz/
                └── page.jsx
            ├── all-quizzes/
                └── page.jsx
            ├── Challenge/
                └── [challengeId]/
                    └── page.jsx
            ├── live-quizzes/
                └── page.jsx
            ├── practice-quizzes/
                ├── _componenets/
                    ├── ProgrammingQuiz.jsx
                    └── QuizCard.jsx
                └── page.jsx
            ├── preparation/
                └── page.jsx
            ├── layout.jsx
            └── page.jsx
        ├── profile/
            └── [username]/
                └── page.jsx
        ├── quiz-start/
            └── [id]/
                ├── _component/
                    ├── LikeDislike.jsx
                    ├── QuizHeader.jsx
                    └── QuizStartQuestions.jsx
                ├── about/
                    └── page.jsx
                ├── leaderboard/
                    └── page.jsx
                ├── quiz-answers/
                    └── page.jsx
                ├── result/
                    └── page.jsx
                ├── start/
                    └── page.jsx
                └── page.jsx
        └── test/
            └── page.jsx
    ├── api/
        ├── add-friend/
            └── route.js
        ├── add-quiz/
            └── route.js
        ├── add-response/
            └── route.js
        ├── challenge/
            └── [id]/
                ├── accept/
                    └── route.js
                ├── submit/
                    └── route.js
                └── route.js
        ├── delete-quiz/
            └── route.js
        ├── find-friend/
            └── route.js
        ├── get-ai-quiz/
            └── route.js
        ├── get-notifications/
            └── [username]/
                └── route.js
        ├── get-practice-quiz/
            └── route.js
        ├── get-quiz/
            └── route.js
        ├── get-quiz-id/
            └── [id]/
                └── route.js
        ├── get-user/
            └── route.js
        ├── login/
            └── route.js
        ├── mark-notification-read/
            └── route.js
        ├── notify-opponent/
            └── route.js
        ├── preparation/
            ├── add/
                └── route.js
            ├── delete-topic/
                └── route.js
            └── get/
                └── route.js
        ├── save-rank/
            └── route.js
        ├── signup/
            └── route.js
        ├── submissions/
            └── route.js
        ├── submit-ai-quiz/
            └── route.js
        └── submit-quiz/
            └── route.js
    ├── favicon.ico
    ├── globals.css
    ├── Icon.js
    ├── layout.js
    ├── not-found.jsx
    ├── page.js
    └── QuizData.js
components/
    ├── shared/
        ├── Card.jsx
        ├── Loader.jsx
        ├── ModeToggle.jsx
        └── NotificationDropdown.jsx
    └── ui/
        ├── accordion.jsx
        ├── button.jsx
        ├── dialog.jsx
        ├── dropdown-menu.jsx
        ├── input.jsx
        ├── sonner.jsx
        ├── textarea.jsx
        └── theme-provider.jsx
db/
    ├── schema/
        ├── Challenge.js
        ├── practiceQuizSchema.js
        ├── PreparationSchema.js
        ├── quizSchema.js
        └── User.js
    └── dbConnect.js
lib/
    ├── GenAi.js
    ├── isValidPassword.js
    ├── notifyAllUsersAboutNewQuiz.js
    └── utils.js
public/
    ├── add-quiz.png
    ├── cloudImage.png
    ├── confused-emoji.png
    ├── correct-answer.png
    ├── emptyBox.png
    ├── errorIcon.png
    ├── file.svg
    ├── globe.svg
    ├── happy-emoji.png
    ├── incorrect-answer.png
    ├── next.svg
    ├── no-select.png
    ├── OIG3.jpg
    ├── placeholder.png
    ├── question-1149.png
    ├── quiz-builder-icon.png
    ├── quizSpark_icon.png
    ├── target-777.png
    ├── target-icon.png
    ├── trophy.png
    ├── vercel.svg
    ├── very-happy-emoji.png
    └── window.svg
.gitignore
components.json
jsconfig.json
middleware.js
next.config.mjs
package-lock.json
package.json
postcss.config.mjs
README.md
tailwind.config.js
