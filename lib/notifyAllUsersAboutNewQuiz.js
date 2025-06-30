import { dbConnect } from '@/db/dbConnect';
import User from '@/db/schema/User';


import { v4 as uuidv4 } from 'uuid';

export async function notifyAllUsersAboutNewQuiz(title, quizMode) {
  await dbConnect();
  function getLink(){
    if(quizMode==='Live Quiz'){
      return `/dashboard/live-quizzes`
    }else{
      return `/dashboard/practice-quizzes`
    }
  }
  const notification = {
    id: uuidv4(),
    message: `📢 A new quiz "${title}" has been added. Try it now!`,
    title: 'New Quiz',
    read: false,
    link: getLink()
  };

  await User.updateMany({}, { $push: { notifications: { $each: [notification], $position: 0 } } });
}
