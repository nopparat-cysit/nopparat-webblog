import './App.css'
import { Routes, Route } from "react-router-dom";
import LandingPage from "./page/landingpage";
import ArticleDetail from "./page/ArticleDetail";
import LoginPage from "./page/LoginPage";
import SignUpPage from "./page/SignUpPage";
import Profile from './page/Profile';
import AdminLogin from './page/admin/adminlogin';
import Articles from './page/admin/articles';
import CreateArticlePage  from './page/admin/createArticle';
import EditArticle from './page/admin/editArticle';
import CategoriesPage from './page/admin/categories';
import CreateCategoryPage from './page/admin/createCategory';
import EditCategoryPage from './page/admin/editCategory';
import AdminProfile from './page/admin/Profile';
import AdminResetPassword from './page/admin/ResetPassword';
import NotificationPage from './page/admin/notification';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/posts/:id" element={<ArticleDetail />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/adminlogin" element={<AdminLogin />} />
      <Route path="/articles" element={<Articles />} />
      <Route path="/articles/create" element={<CreateArticlePage />} />
      <Route path="/article/edit/:id" element={<EditArticle />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/categories/create" element={<CreateCategoryPage />} />
      <Route path="/categories/edit/:id" element={<EditCategoryPage />} />
      <Route path="/admin/profile" element={<AdminProfile />} />
      <Route path="/admin/reset-password" element={<AdminResetPassword />} />
      <Route path="/notification" element={<NotificationPage />} />
    </Routes>
  )
}

export default App
