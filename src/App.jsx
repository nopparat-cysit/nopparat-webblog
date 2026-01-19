import './App.css'
import { Routes, Route } from "react-router-dom";
import LandingPage from "./page/landingpage";
import ArticleDetail from "./page/ArticleDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/posts/:id" element={<ArticleDetail />} />
    </Routes>
  )
}

export default App
