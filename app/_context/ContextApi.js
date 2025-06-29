"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { quizzesData } from "../QuizData";
import axios from "axios";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const GlobalContext = createContext();

export function ContextProvider({ children }) {
  const route = useRouter();
  const pathname = usePathname();
  const defaultUser = {
    id: 1,
    name: "quizUser",
    isLogged: false,
    experience: 0,
  };
  const [allQuiz, setAllQuiz] = useState([]);
  const [selectQuizToStart, setSelectQuizToStart] = useState(null);
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [practiceQuiz, setPracticeQuiz] = useState([]);
  const [aiQuiz, setAiQuiz] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");

        const publicRoutes = ["/sign-in", "/sign-up"];

        if (!token) {
          // Allow access to public routes
          if (!publicRoutes.includes(pathname)) {
            route.push("/sign-in");
          }
          return;
        }

        try {
          const decoded = jwtDecode(token);
          setEmail(decoded.email);
          setUsername(decoded.username);
        } catch (err) {
          localStorage.removeItem("token");
          route.push("/sign-in");
        }
      }
    };

    const fetchQuizData = async () => {
      try {
        const response = await axios.get("/api/get-quiz");
        if (response?.data.successs === false) {
          toast.error("Failed to get quiz");
          throw new Error("Fetching failed...");
        }
        setAllQuiz(response?.data.quiz);
      } catch (error) {
        toast.error("Failed to get quiz");
      }
    };
    
    fetchQuizData();
    fetchUser();
  }, [pathname]);

  return (
    <GlobalContext.Provider
      value={{
        allQuiz,
        setAllQuiz,
        practiceQuiz,
        setPracticeQuiz,
        email,
        setEmail,
        username,
        setUsername,
        isLoading,
        setIsLoading,
        aiQuiz,
        setAiQuiz,
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
