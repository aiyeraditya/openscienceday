import QuizQuestion from "./quizComponent";
import React, { useState } from "react";


const questions = [
    {
        question: "What is 2 + 2?",
        options: ["3", "4"],
        answer: "4"
    }];

export default function QuizComponent() {
    return <QuizQuestion question={questions[0].question} options={questions[0].options} />;
}