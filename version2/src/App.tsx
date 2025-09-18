import { BrowserRouter, Routes, Route } from "react-router-dom";
import Disco from "./disco";
import OverlayTest from "./OverlayTest";
import SimonSays from "./simonSays";
import RunFromBear from "./runFromBear";
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;