import './App.css'
import { Routes, Route } from "react-router-dom";
import LandingPage from "./page/landingpage";
import ArticleDetail from "./page/ArticleDetail";
import LoginPage from "./page/LoginPage";
import SignUpPage from "./page/SignUpPage";
import Profile from './page/Profile';


function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/posts/:id" element={<ArticleDetail />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}

export default App
