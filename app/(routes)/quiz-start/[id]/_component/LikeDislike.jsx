"use client";

import axios from "axios";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";

const LikeDislike = ({ quizId, initialLikes, initialDislikes, email }) => {
  const [likes, setLikes] = useState(initialLikes.length);
  const [dislikes, setDislikes] = useState(initialDislikes.length);
  const [userAction, setUserAction] = useState(null); // 'like' | 'dislike' | null
  const [animateLike, setAnimateLike] = useState(false);
  const [animateDislike, setAnimateDislike] = useState(false);
  const likeTimeoutRef = useRef(null);
  const dislikeTimeoutRef = useRef(null);

  // Detect if user has already voted
  useEffect(() => {
    if (initialLikes.includes(email)) {
      setUserAction("like");
    } else if (initialDislikes.includes(email)) {
      setUserAction("dislike");
    }

    return () => {
      clearTimeout(likeTimeoutRef.current);
      clearTimeout(dislikeTimeoutRef.current);
    };
  }, [email, initialLikes, initialDislikes]);

  const handleVote = useCallback(async (action) => {
    clearTimeout(likeTimeoutRef.current);
    clearTimeout(dislikeTimeoutRef.current);
    setAnimateLike(false);
    setAnimateDislike(false);

    try {
      const res = await axios.post("/api/add-response", { quizId, email, action });
      setLikes(res.data.likes);
      setDislikes(res.data.dislikes);
      setUserAction(action);

      if (action === "like") {
        setAnimateLike(true);
        likeTimeoutRef.current = setTimeout(() => setAnimateLike(false), 300);
      } else {
        setAnimateDislike(true);
        dislikeTimeoutRef.current = setTimeout(() => setAnimateDislike(false), 300);
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  }, [quizId, email]);

  return (
    <div className="flex gap-4 items-center mt-4">
      <button
        onClick={() => handleVote("like")}
        className={`flex items-center gap-1 px-3 py-1 rounded-full font-medium transition-all duration-200
          ${userAction === "like" ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700"}
          ${animateLike ? "animate-like-bounce" : ""}
        `}
      >
        <ThumbsUp
          size={20}
          className={`${userAction === "like" ? "fill-current" : "stroke-current"}`}
        />
        {likes}
      </button>

      <button
        onClick={() => handleVote("dislike")}
        className={`flex items-center justify-center gap-2 px-3 py-1 rounded-full font-medium transition-all duration-200
          ${userAction === "dislike" ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-red-100 hover:text-red-700"}
          ${animateDislike ? "animate-dislike-bounce" : ""}
        `}
      >
        <ThumbsDown
          size={20}
          className={`${userAction === "dislike" ? "fill-current" : "stroke-current"}`}
        />
        {dislikes}
      </button>
    </div>
  );
};

export default LikeDislike;
