// components/Watermark.tsx
'use client'
import { useEffect, useState } from "react";



export default function Watermark({ email }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({
        x: Math.random() * window.innerWidth * 0.8, // random X
        y: Math.random() * window.innerHeight * 0.8, // random Y
      });
    }, 5000); // moves every 5s

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        pointerEvents: "none",
        color: "rgb(255,255,255)",
        fontSize: "10px",
        
        zIndex: 9999,
        userSelect: "none",
        whiteSpace: "nowrap",
        transition: "top 2s linear, left 2s linear",
      }}
      className="font-extralight"
    >
      {email}
    </div>
  );
}
