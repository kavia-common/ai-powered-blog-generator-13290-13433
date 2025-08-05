import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Navbar from "./components/Navbar";
import NotificationPanel from "./components/NotificationPanel";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import BlogEditorPage from "./pages/BlogEditorPage";
import BlogViewPage from "./pages/BlogViewPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPanel from "./pages/AdminPanel";

// PRIVATE ROUTE
function PrivateRoute({ children, adminOnly=false }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

// PUBLIC_INTERFACE
export default function AppRouter() {
  return (
    <Router>
      <Navbar />
      <NotificationPanel />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/post/new" element={
          <PrivateRoute>
            <BlogEditorPage />
          </PrivateRoute>
        } />
        <Route path="/post/:id/edit" element={
          <PrivateRoute>
            <BlogEditorPage />
          </PrivateRoute>
        } />
        <Route path="/post/:id" element={<BlogViewPage />} />
        <Route path="/profile" element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        } />
        <Route path="/admin/*" element={
          <PrivateRoute adminOnly>
            <AdminPanel />
          </PrivateRoute>
        } />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}
