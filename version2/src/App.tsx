import { BrowserRouter, Routes, Route } from "react-router-dom";
import Disco from "./disco";
import OverlayTest from "./OverlayTest";
import SimonSays from "./simonSays";
import RunFromBear from "./runFromBear";
import LearnObject from "./learnObject";
import QuizComponent from "./quiz";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ...other routes */}
        <Route path="/disco" element={<Disco />} />
        <Route path="/overlay-test" element={<OverlayTest />} />
        <Route path="/simon-says" element={<SimonSays />} />
        <Route path="/run-from-bear" element={<RunFromBear />} />
        <Route path="/learn-object" element={<LearnObject />} />
        <Route path="/quiz" element={<QuizComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;