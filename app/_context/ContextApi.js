"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { quizzesData } from "../QuizData";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const GlobalContext = createContext();

export function ContextProvider({ children }) {
  const route = useRouter();
  const defaultUser = {
    id: 1,
    name: "quizUser",
    isLogged: false,
    experience: 0,
  };
  const [allQuiz, setAllQuiz] = useState([]);
  const [selectQuizToStart, setSelectQuizToStart] = useState(null);
  const [email, setEmail] = useState(null);
  // const [user, setUser] = useState(() => {
  //   const saveUserData = localStorage.getItem("user");
  //   return saveUserData ? JSON.parse(saveUserData) : defaultUser;
  // });

  // useEffect(() => {
  //   localStorage.setItem("user", JSON.stringify(user));
  // }, [user]);

  useEffect(() => {
    const fetchUser = async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        //console.log("saved token context", token);

        if (!token) {
          route.push('/sign-in');
          return;
        }

        try {
          const decoded = jwtDecode(token);
          //console.log("decode",decoded);

          setEmail(decoded.email);
        } catch (err) {
          //localStorage.removeItem('token');
          route.push('/sign-in');
        } finally {
          
        }
      }
    }
    const fetchQuizData = async () => {
      try {
        const response = await axios.get("/api/get-quiz");
        //console.log(response?.data.quiz);
        if (response?.data.successs === false) {
          toast.error("Failed to get quiz");
          throw new Error('Fetching failed...')
        }
        setAllQuiz(response?.data.quiz); // ✅ usually you want response.data
      } catch (error) {
        toast.error("Failed to get quiz");
        //console.error(error);
      }

    };

    fetchQuizData();
    fetchUser();
  }, []);


  return (
    <GlobalContext.Provider
      value={{
        allQuiz,
        setAllQuiz,
        email,
        setEmail,
        quizToStartObject: { selectQuizToStart, setSelectQuizToStart },
        // userObject: {user,setUser},
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export default function useGlobalContextProvider() {
  return useContext(GlobalContext);
}
