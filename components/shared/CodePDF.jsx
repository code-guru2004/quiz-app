"use client";
import React from "react";
import {
    Document,
    Page,
    StyleSheet,
    PDFDownloadLink,
    Text,
    View,
} from "@react-pdf/renderer";
import Html from "react-pdf-html";

// ✅ Styles
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 11,
        fontFamily: "Helvetica",
    },
    header: {
        fontSize: 18,
        textAlign: "center",
        marginBottom: 10,
        fontWeight: "bold",
        color: "#1E40AF",
    },
    subHeader: {
        fontSize: 12,
        marginBottom: 20,
        textAlign: "center",
    },
    questionBlock: {
        marginBottom: 20,
        padding: 10,
        border: "1px solid #e5e7eb",
        borderRadius: 6,
        backgroundColor: "#f9fafb",
    },
    questionTitle: {
        fontSize: 13,
        marginBottom: 5,
        fontWeight: "bold",
        color: "#111827",
    },
    choice: {
        marginBottom: 5,
    },
    correct: {
        color: "green",
        fontWeight: "bold",
    },
    explanation: {
        marginTop: 5,
        fontSize: 11,
        color: "#374151",
        backgroundColor:"#c1f5cf",
        padding:3,
        
    },
});

// ✅ Convert quiz data into HTML sections
const QuizPDF = ({ quiz }) => {
    return (
        <Document>
            <Page style={styles.page}>
                {/* Title */}
                <Text style={styles.header}>Quiz: {quiz.Topic}</Text>
                <Text style={styles.subHeader}>
                    Level: {quiz.level} | Total Questions: {quiz.totalQuestions} | Time:{" "}
                    {quiz.totalTime} mins
                </Text>

                {/* Description */}
                <View style={{ marginBottom: 20 }}>
                    <Text>{quiz.quizDescription}</Text>
                </View>

                {/* Questions */}
                {quiz.quizQuestions.map((q, index) => {
                    const choicesHTML = `
      <ul>
        ${q.choices
                            .map(
                                (c) =>
                                    `<li ${c.startsWith(q.correctAnswer)
                                        ? 'style="color:green;font-weight:bold;"'
                                        : ""
                                    }>${c}</li>`
                            )
                            .join("")}
      </ul>
    `;

                    // 🔑 style <code> blocks
                    const questionHTML = q.mainQuestion
                        .replace(/<code[^>]*>/g, "<pre style='background:#000;color:#fff;padding:8px;border-radius:4px;font-size:11px;'>")
                        .replace(/<\/code>/g, "</pre>");


                    // ✅ extract inner text of <code>
                    const tempDiv = document.createElement("div");
                    tempDiv.innerHTML = q.mainQuestion;
                    const questionText = tempDiv.querySelector("p")?.textContent || "";
                    const codeElement = tempDiv.querySelector("code");
                    const codeText = codeElement ? codeElement.textContent : null;

                    console.log("👉 Raw code inside <code>:", codeText);

                    const explanationHTML = q.explanation.replace(
                        /<code([^>]*)>/g,
                        `<code$1 style="background-color:black;color:white;padding:4px;border-radius:3px;font-size:11px;">`
                    );

                    return (
                        <View key={q.id} style={styles.questionBlock}>
                            <Text style={styles.questionTitle}>
                                Q{index + 1}.
                            </Text>

                            <Text style={{ fontSize: 12, marginBottom: 6 }}>{questionText}</Text>
                            {/* Question HTML */}
                            <View style={{ backgroundColor: "#000", padding: 8, borderRadius: 4 }}>
                                {codeText.split("\n").map((line, i) => (
                                    <Text
                                        key={i}
                                        style={{ color: "white", fontFamily: "Courier", fontSize: 11 }}
                                    >
                                        {line}
                                    </Text>
                                ))}
                            </View>


                            {/* Choices */}
                            <Html>{choicesHTML}</Html>

                            {/* Explanation */}
                            {q.explanation && (
                                <View style={styles.explanation}>
                                    <Text>Explanation:</Text>
                                    <Html>{explanationHTML}</Html>
                                </View>
                            )}
                        </View>
                    );
                })}

            </Page>
        </Document>
    );
};

// ✅ Main component with Download Button
export default function CodePDF({ quiz }) {
    return (
        <div className="flex flex-col items-center gap-3">
            <h1 className="text-xl font-bold">Download Quiz PDF</h1>

            <PDFDownloadLink
                document={<QuizPDF quiz={quiz} />}
                fileName={`${quiz.Topic}_Quiz.pdf`}
            >
                {({ loading }) =>
                    loading ? (
                        <button className="px-4 py-2 bg-gray-400 rounded">Loading...</button>
                    ) : (
                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Download PDF
                        </button>
                    )
                }
            </PDFDownloadLink>
        </div>
    );
}
