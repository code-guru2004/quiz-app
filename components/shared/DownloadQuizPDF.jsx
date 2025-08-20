"use client";
import { jsPDF } from "jspdf";
import { useEffect } from "react";
import { FaFilePdf } from "react-icons/fa";
import { Bounce, toast } from "react-toastify";

export default function DownloadQuizPDF({ quiz,isAttendActiveQuiz }) {
  const generatePDF = () => {
    if(!isAttendActiveQuiz){
        toast.error("You can't download pdf untill you attend the contest.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
            });
            return;
    }
    const doc = new jsPDF();
    let y = 30; // Start lower to accommodate header
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const maxLineWidth = pageWidth - margin * 2;
    let currentPage = 1;
    let questionsOnCurrentPage = 0;

    // Add header function
    const addHeader = (doc, pageNum, totalPages) => {
      doc.setFillColor(41, 128, 185); // Nice blue color
      doc.rect(0, 0, pageWidth, 20, 'F');
      
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text(quiz.quizTitle || "Quiz", margin, 12);
      
      doc.setFontSize(10);
      doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, 12, { align: "right" });
      
      // Reset text color
      doc.setTextColor(0, 0, 0);
    };

    // Add footer function
    const addFooter = (doc) => {
      doc.setFillColor(236, 240, 241); // Light gray
      doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      const date = new Date().toLocaleDateString();
      doc.text(`Generated on ${date}`, margin, pageHeight - 7);
      
      doc.text("www.eduprobe-exam.vercel.app", pageWidth - margin, pageHeight - 7, { align: "right" });
    };

    // Helper: Add watermark
    const addWatermark = (doc) => {
      doc.setFontSize(60);
      doc.setTextColor(200, 200, 200);
      doc.text("Eduprobe", pageWidth / 2, pageHeight / 2, {
        align: "center",
        angle: 45,
      });
      doc.setTextColor(0, 0, 0); // reset to black
    };

    // Calculate total pages needed
    const totalPages = Math.ceil(quiz.quizQuestions.length / 3);

    // Add header, footer and watermark to first page
    addHeader(doc, currentPage, totalPages);
    addFooter(doc);
    addWatermark(doc);

    // Quiz content
    quiz.quizQuestions.forEach((q, index) => {
      // Check if we need a new page (after 3 questions or if current question won't fit)
      if (questionsOnCurrentPage >= 3 || y > pageHeight - 100) {
        doc.addPage();
        currentPage++;
        questionsOnCurrentPage = 0;
        y = 30;
        
        // Add header, footer and watermark to new page
        addHeader(doc, currentPage, totalPages);
        addFooter(doc);
        addWatermark(doc);
      }

      // Question text (with wrap) - styled with color
      if (q.mainQuestion) {
        doc.setFontSize(12);
        doc.setTextColor(44, 62, 80); // Dark blue-gray color for questions
        doc.setFont(undefined, 'bold');
        
        let questionText = `${index + 1}. ${q.mainQuestion}`;
        let wrappedText = doc.splitTextToSize(questionText, maxLineWidth);
        doc.text(wrappedText, margin, y);
        y += wrappedText.length * 7; // adjust spacing
        
        // Reset font
        doc.setFont(undefined, 'normal');
      }

      // If there's an image for question
      if (q.mainQuestionImage) {
        try {
          doc.addImage(q.mainQuestionImage, "JPEG", margin, y, 50, 30);
          y += 35;
        } catch (err) {
          doc.text("[Image not available]", margin, y);
          y += 10;
        }
      }

      // Options (with wrap) - styled with different color
      doc.setFontSize(11);
      doc.setTextColor(52, 73, 94); // Dark blue color for options
      
      q.choices.forEach((opt, i) => {
        let optionText = `   ${String.fromCharCode(65 + i)}. ${opt}`;
        let wrappedOpt = doc.splitTextToSize(optionText, maxLineWidth - 10);
        doc.text(wrappedOpt, margin + 5, y);
        y += wrappedOpt.length * 6;
      });

      // Correct answer - styled with green color
      if (q.correctAnswer) {
        y += 5;
        doc.setFontSize(11);
        doc.setTextColor(39, 174, 96); // Green color for correct answer
        doc.setFont(undefined, 'bold');
        
        let wrappedCorrect = doc.splitTextToSize(
          `✓ Correct: ${q.correctAnswer}`,
          maxLineWidth
        );
        doc.text(wrappedCorrect, margin + 5, y);
        y += wrappedCorrect.length * 7;
        
        // Reset font
        doc.setFont(undefined, 'normal');
      }

      // Explanation (with wrap) - styled with gray color
      if (q.explanation) {
        y += 3;
        doc.setFontSize(10);
        doc.setTextColor(127, 140, 141); // Gray color for explanation
        doc.setFont(undefined, 'italic');
        
        let wrappedExp = doc.splitTextToSize(
          `Explanation: ${q.explanation}`,
          maxLineWidth
        );
        doc.text(wrappedExp, margin + 5, y);
        y += wrappedExp.length * 6;
        
        // Reset font
        doc.setFont(undefined, 'normal');
      }

      y += 12; // Add spacing between questions
      questionsOnCurrentPage++;
    });

    doc.save(`${quiz.quizTitle || "quiz"}.pdf`);
  };
  
  return (
    <button
      onClick={generatePDF}
      className="p-1 bg-white rounded-md shadow hover:bg-gray-100 transition-colors"
      title="Download PDF"
    >
      <FaFilePdf className="size-5 text-red-600"/>
    </button>
  );
}