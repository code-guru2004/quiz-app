// components/FloatingEmail.jsx
"use client";
import React from "react";

export default function FloatingEmail({ email }) {
  return (
    <div className="floating-email text-xs font-thin z-0">
      {email}
    </div>
  );
}
