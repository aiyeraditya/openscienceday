import React, { useState } from "react";
import "./Quiz.css";

type QuizQuestionProps = {
    question: string;
    options: [string, string];
};

const optionImages: Record<string, HTMLImageElement> = {
  handsUp: new window.Image(),
  handsOut: new window.Image(),
};
optionImages.handsUp.src = "/handsUp.png";
optionImages.handsOut.src = "/handsOut.png";

const QuizQuestion: React.FC<QuizQuestionProps> = ({ question, options }) => {
    return (
        <div className="quiz-question">
            <h2 className="quiz-question-text">{question}</h2>
            <div className="quiz-options">
                <button className="quiz-option">
                    <img src={optionImages.handsUp.src} alt="hands up" className="quiz-option-icon" /> {options[0]}
                </button>
                <button className="quiz-option">
                    <img src={optionImages.handsOut.src} alt="hands out" className="quiz-option-icon" /> {options[1]}
                </button>
            </div>
        </div>
    );
};

export default QuizQuestion;