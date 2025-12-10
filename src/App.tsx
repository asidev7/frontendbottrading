import { BrowserRouter, Routes, Route } from "react-router-dom";
import Screener from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Screener />} />
      </Routes>
    </BrowserRouter>
  );
}
