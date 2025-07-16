// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Interview from "./pages/Interview";
import Feedback from "./pages/Feedback";
//import AIInterview from "./pages/AIInterview";
import Layout from "./components/Layout";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Interview />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/feedback" element={<Feedback />} />
        </Route>
    </Routes>
  );
}

export default App;
