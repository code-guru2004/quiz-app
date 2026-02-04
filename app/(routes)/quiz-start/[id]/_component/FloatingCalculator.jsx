"use client";
import React, { useState, useRef, useEffect } from "react";
import { Calculator, Move, Minus, X } from "lucide-react";

const FloatingCalculator = () => {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const calculatorRef = useRef(null);

  const handleButtonClick = (value) => {
    if (value === "C") {
      setDisplay("0");
      setExpression("");
    } else if (value === "=") {
      try {
        // Safely evaluate the expression
        const result = eval(expression.replace(/×/g, "*").replace(/÷/g, "/"));
        setDisplay(result.toString());
        setExpression(result.toString());
      } catch (error) {
        setDisplay("Error");
        setTimeout(() => {
          setDisplay("0");
          setExpression("");
        }, 1000);
      }
    } else if (value === "⌫") {
      if (expression.length > 0) {
        const newExpression = expression.slice(0, -1);
        setExpression(newExpression);
        setDisplay(newExpression || "0");
      }
    } else {
      const newExpression = expression + value;
      setExpression(newExpression);
      setDisplay(newExpression);
    }
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('.calculator-header')) {
      setIsDragging(true);
      const rect = calculatorRef.current.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;
      
      // Keep calculator within viewport bounds
      const maxX = window.innerWidth - (calculatorRef.current?.offsetWidth || 300);
      const maxY = window.innerHeight - 50; // Minimum space at bottom
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  const buttons = [
    ["C", "⌫", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["00", "0", ".", "="],
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed z-50 bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110"
        aria-label="Open calculator"
      >
        <Calculator size={24} />
      </button>
    );
  }

  return (
    <div
      ref={calculatorRef}
      className={`fixed z-50 shadow-2xl border border-gray-300 rounded-lg overflow-hidden bg-white dark:bg-gray-800 transition-all duration-200 ${
        isDragging ? "cursor-grabbing" : "cursor-default"
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "300px",
        minHeight: isMinimized ? "auto" : "400px",
        userSelect: "none",
      }}
    >
      {/* Header */}
      <div 
        className="calculator-header flex items-center justify-between p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <Calculator size={20} />
          <span className="font-semibold">Calculator</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-blue-700 rounded transition-colors"
            aria-label={isMinimized ? "Expand" : "Minimize"}
          >
            <Minus size={18} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-red-500 rounded transition-colors"
            aria-label="Close calculator"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Calculator Body */}
      {!isMinimized && (
        <div className="p-4">
          {/* Display */}
          <div className="mb-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 h-5 overflow-hidden">
              {expression}
            </div>
            <div className="text-3xl font-bold text-right p-3 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-x-auto overflow-y-hidden whitespace-nowrap">
              {display}
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {buttons.flat().map((btn) => (
              <button
                key={btn}
                onClick={() => handleButtonClick(btn)}
                className={`p-4 rounded-lg text-lg font-medium transition-all hover:scale-95 active:scale-90 ${
                  ["÷", "×", "-", "+", "="].includes(btn)
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : ["C", "⌫", "%"].includes(btn)
                    ? "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                }`}
              >
                {btn === "⌫" ? "⌫" : btn}
              </button>
            ))}
          </div>

          {/* Dragging Hint */}
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center flex items-center justify-center gap-1">
            <Move size={12} />
            Drag from header to move
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingCalculator;