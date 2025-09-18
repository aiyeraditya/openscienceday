import { BrowserRouter, Routes, Route } from "react-router-dom";
import Disco from "./disco";
import OverlayTest from "./OverlayTest";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ...other routes */}
        <Route path="/disco" element={<Disco />} />
        <Route path="/overlay-test" element={<OverlayTest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;