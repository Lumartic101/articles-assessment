import { Routes, Route } from "react-router-dom";
import Articles from "./pages/Articles";
import Login from "./pages/Login";
import ArticleForm from "./pages/ArticleForm";
import ProtectedRoute from "./ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Publiek */}
      <Route path="/" element={<Articles />} />
      <Route path="/login" element={<Login />} />

      {/* Protected */}
      <Route
        path="/articles/new"
        element={
          <ProtectedRoute>
            <ArticleForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/articles/:id/edit"
        element={
          <ProtectedRoute>
            <ArticleForm />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
