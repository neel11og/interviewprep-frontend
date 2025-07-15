import { Routes, Route } from "react-router-dom";
import Interview from "./pages/Interview";
import Feedback from "./pages/Feedback";
import Layout from "./components/Layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Interview />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/feedback" element={<Feedback />} />
      </Route>
    </Routes>
  );
}

export default App;
