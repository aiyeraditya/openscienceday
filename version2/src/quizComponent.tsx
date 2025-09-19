import React, { useState } from "react";

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
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "20vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#fff", zIndex: 9999 }}>
            <div>
            <h3 style={{ textAlign: "center" }}>{question}</h3>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center" }} >
                <button style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "4vh", padding: "1vh 2vh" }}>
                    <img src={optionImages.handsUp.src} alt="hands up" style={{ height: "6vh", verticalAlign: "middle" }} /> {options[0]}
                </button>
                <button style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "4vh", padding: "1vh 2vh" }}>
                    <img src={optionImages.handsOut.src} alt="hands out" style={{ height: "6vh", verticalAlign: "middle" }} /> {options[1]}
                </button>
            </div>
            </div>
        </div>
    );
};

export default QuizQuestion;