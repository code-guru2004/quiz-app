"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import "mathlive";

export default function MathLiveEditor({ onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Type your question here and insert math…",
      }),
    ],
    content: `<p>Sample: The result of <math-field virtual-keyboard-mode="onfocus">\\frac{1}{2} + \\frac{1}{4}</math-field></p>`,
    onUpdate({ editor }) {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Ensure math fields load with keyboard
  useEffect(() => {
    const interval = setInterval(() => {
      document.querySelectorAll("math-field").forEach((mf) => {
        mf.setOptions?.({ virtualKeyboardMode: "onfocus" });
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border rounded p-4 ">
      <EditorContent editor={editor} />
    </div>
  );
}
