"use client";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image, Font } from "@react-pdf/renderer";
import { useState, useEffect } from "react";
import { FaFilePdf } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";

// ✅ Register fonts
Font.register({
    family: "Helvetica",
    fonts: [
        { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf", fontWeight: 300 },
        { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf", fontWeight: 400 },
        { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf", fontWeight: 500 },
        { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf", fontWeight: 700 },
    ],
});

// ✅ Enhanced Styles for PDF with safe numerical values
const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: "#ffffff",
        fontSize: 12,
        fontFamily: "Helvetica",
        lineHeight: 1.4,
        position: "relative",
    },
    header: {
        fontSize: 24,
        textAlign: "center",
        marginBottom: 15,
        color: "#2C3E50",
        fontWeight: 700,
    },
    subtitle: {
        fontSize: 14,
        textAlign: "center",
        marginBottom: 6,
        color: "#7f8c8d",
        fontWeight: 500,
    },
    quizMeta: {
        fontSize: 11,
        marginBottom: 12,
        textAlign: "center",
        color: "#95a5a6",
        fontWeight: 400,
    },
    description: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: "#f8f9fa",
        borderRadius: 8,
        borderLeft: "4px solid #3498db",
    },
    descriptionText: {
        fontSize: 11,
        color: "#34495e",
        textAlign: "center",
        fontStyle: "italic",
    },
    questionBox: {
        marginBottom: 20,
        padding: 15,
        borderRadius: 8,
        backgroundColor: "#f8f9fa",
        border: "1px solid #e9ecef",
        position: "relative",
        zIndex: 2,
    },
    questionNumber: {
        fontSize: 11,
        color: "#6c757d",
        marginBottom: 4,
        fontWeight: 500,
    },
    question: {
        fontSize: 14,
        marginBottom: 10,
        color: "#2c3e50",
        fontWeight: 600,
    },
    image: {
        width: "100%",
        maxHeight: 150,
        marginBottom: 10,
        borderRadius: 4,
        objectFit: "contain",
    },
    choicesContainer: {
        marginTop: 8,
    },
    choice: {
        fontSize: 12,
        marginBottom: 4,
        color: "#495057",
        paddingLeft: 8,
    },
    correctChoice: {
        fontSize: 12,
        marginBottom: 4,
        color: "#42f54b",
        fontWeight: 600,
        paddingLeft: 8,
    },
    choiceBullet: {
        fontWeight: 600,
        marginRight: 4,
    },
    explanationBox: {
        marginTop: 12,
        padding: 10,
        borderLeft: "4px solid #2980b9",
        backgroundColor: "#e3f2fd",
        borderRadius: 6,
    },
    explanationLabel: {
        fontSize: 11,
        color: "#2980b9",
        fontWeight: 600,
        marginBottom: 4,
    },
    explanation: {
        fontSize: 11,
        color: "#2d3436",
        lineHeight: 1.3,
    },
    footer: {
        position: "absolute",
        bottom: 25,
        left: 40,
        right: 40,
        textAlign: "center",
        fontSize: 10,
        color: "#adb5bd",
        borderTop: "1px solid #dee2e6",
        paddingTop: 10,
        zIndex: 2,
    },
    pageNumber: {
        position: "absolute",
        bottom: 25,
        right: 40,
        fontSize: 10,
        color: "#adb5bd",
        zIndex: 2,
    },
    watermark: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        opacity: 0.1,
    },
    watermarkText: {
        position: "absolute",
        fontSize: 48,
        color: "#cccccc",
        fontWeight: "bold",
        fontFamily: "Helvetica",
        opacity: 0.3,
    },
    correctAnswerBox: {
        marginTop: 8,
        padding: 10,
        backgroundColor: "#E8F5E9",
        borderLeft: "4px solid #4CAF50",
        borderRadius: 6,
    },
    correctAnswerLabel: {
        fontSize: 11,
        color: "#0b4a03",
        fontWeight: 600,
        marginBottom: 4,
    },
    correctAnswerText:{
        fontSize:11,
        color:'#3a8511',
        fontWeight:400
    },
    errorText: {
        color: "#ff0000",
        fontSize: 10,
        marginBottom: 5,
    }
});

// ✅ Utility functions for validation
const validateNumber = (value, defaultValue = 0) => {
    if (typeof value !== 'number' || 
        isNaN(value) || 
        !isFinite(value) || 
        Math.abs(value) > 1000000) {
        return defaultValue;
    }
    return value;
};

const getCleanChoiceValue = (choiceText) => {
    if (typeof choiceText !== 'string') return '';
    return choiceText.replace(/^[A-F]\.\s*/i, '').replace(/^[A-F]\.[A-F]\.\s*/i, '');
};

const isValidImageUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
};

// ✅ Watermark Component
const Watermark = () => {
    return (
        <View style={styles.watermark} fixed>
            <Text style={[styles.watermarkText, { top: '30%', left: '25%', transform: 'rotate(-45deg)' }]}>
                Eduprobe
            </Text>
            <Text style={[styles.watermarkText, { top: '70%', left: '60%', transform: 'rotate(-45deg)' }]}>
                Eduprobe
            </Text>
        </View>
    );
};

// ✅ Safe Question Component with Error Boundary
const SafeQuestion = ({ q, index, totalQuestions }) => {
    try {
        // Validate question data
        if (!q || typeof q !== 'object') {
            return (
                <View style={styles.questionBox}>
                    <Text style={styles.errorText}>Error: Invalid question data at index {index}</Text>
                </View>
            );
        }

        const validChoices = Array.isArray(q.choices) ? q.choices : [];
        const cleanCorrectAnswer = getCleanChoiceValue(q.correctAnswer || '');

        return (
            <View style={styles.questionBox} wrap={false}>
                <Text style={styles.questionNumber}>Question {index + 1} of {totalQuestions}</Text>
                <Text style={styles.question}>{q.mainQuestion || 'No question text provided'}</Text>

                {/* Safe image rendering with validation */}
                {q.mainQuestionImage && isValidImageUrl(q.mainQuestionImage) && (
                    <Image
                        style={styles.image}
                        src={q.mainQuestionImage}
                        onError={(e) => console.log('Failed to load image:', q.mainQuestionImage)}
                    />
                )}

                <View style={styles.choicesContainer}>
                    {validChoices.map((choice, idx) => {
                        const cleanChoice = getCleanChoiceValue(choice);
                        const isCorrect = cleanChoice === cleanCorrectAnswer;

                        return (
                            <View key={idx} style={isCorrect ? styles.correctAnswerBox : {}}>
                                <Text style={isCorrect ? styles.correctChoice : styles.choice}>
                                    <Text style={styles.choiceBullet}>
                                        {String.fromCharCode(65 + idx)}.
                                    </Text>
                                    {cleanChoice || `Choice ${idx + 1}`}
                                </Text>
                            </View>
                        );
                    })}
                </View>
                
                {/* Correct answer */}
                {q.correctAnswer && (
                    <View style={styles.correctAnswerBox}>
                        <Text style={styles.correctAnswerLabel}>Correct answer:</Text>
                        <Text style={styles.correctAnswerText}>{q.correctAnswer}</Text>
                    </View>
                )}
                
                {/* Explanation */}
                {q.explanation && (
                    <View style={styles.explanationBox}>
                        <Text style={styles.explanationLabel}>Explanation:</Text>
                        <Text style={styles.explanation}>{q.explanation}</Text>
                    </View>
                )}
            </View>
        );
    } catch (error) {
        console.error('Error rendering question:', error, q);
        return (
            <View style={styles.questionBox}>
                <Text style={styles.errorText}>Error rendering question {index + 1}: {error.message}</Text>
            </View>
        );
    }
};

// ✅ PDF Document Component with Watermark
const QuizPDF = ({ quiz }) => {
    // Validate quiz data
    if (!quiz || typeof quiz !== 'object') {
        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <Text style={styles.errorText}>Error: Invalid quiz data provided</Text>
                </Page>
            </Document>
        );
    }

    const validQuestions = Array.isArray(quiz.quizQuestions) ? quiz.quizQuestions : [];
    
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Watermark */}
                <Watermark />

                {/* Header */}
                <Text style={styles.header}>{quiz.quizTitle || 'Untitled Quiz'}</Text>
                {quiz.quizSubtitle && <Text style={styles.subtitle}>{quiz.quizSubtitle}</Text>}

                <Text style={styles.quizMeta}>
                    Topic: {quiz.quizCategory || 'Uncategorized'} | 
                    Total Questions: {validQuestions.length} | 
                    Time: {quiz.quizTime || 'N/A'} minutes
                </Text>

                {/* Description */}
                {quiz.quizDescription && (
                    <View style={styles.description}>
                        <Text style={styles.descriptionText}>{quiz.quizDescription}</Text>
                    </View>
                )}

                {/* Questions with error boundaries */}
                {validQuestions.map((q, index) => (
                    <SafeQuestion 
                        key={q.id || index} 
                        q={q} 
                        index={index} 
                        totalQuestions={validQuestions.length} 
                    />
                ))}

                {/* Footer */}
                <Text style={styles.footer}>
                    Generated on  | www.eduprobe-exam.vercel.app
                </Text>

                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                    `Page ${pageNumber} of ${totalPages}`
                )} fixed />
            </Page>
        </Document>
    );
};

// ✅ Enhanced Download Component
export default function DownloadPdf({ quiz, isAttendActiveQuiz }) {
    const [isClient, setIsClient] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <div className="flex flex-col items-center gap-3">
                <button className="px-6 py-3 bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed opacity-75">
                    Loading PDF Generator...
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
            {/* Download Button */}
            <PDFDownloadLink
                document={<QuizPDF quiz={quiz} />}
                fileName={`${(quiz.quizTitle || 'quiz').replace(/[^a-zA-Z0-9]/g, "_")}_Q&A.pdf`}
                className="w-full"
            >
                {({ loading, error: pdfError }) => (
                    <button
                        className={`w-full rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer ${
                            loading ? "cursor-not-allowed opacity-90" : "bg-gradient-to-r shadow-md"
                        }`}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <FiLoader className="size-5 animate-spin"/>
                            </div>
                        ) : pdfError ? (
                            <div className="flex items-center justify-center gap-2">
                                <span>⚠️ Error generating PDF</span>
                            </div>
                        ) : (
                            <div className="p-1 bg-white rounded-md shadow hover:bg-gray-100 transition-colors"
                            title="Download PDF">
                                <FaFilePdf className="size-5 text-red-600"/>
                            </div>
                        )}
                    </button>
                )}
            </PDFDownloadLink>
            
            {error && (
                <div className="text-red-500 text-sm mt-2">
                    Error: {error.message}
                </div>
            )}
        </div>
    );
}