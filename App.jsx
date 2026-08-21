import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import { AuthProvider } from "./AuthContext";
import ScrollToTop from "./ScrollToTop";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import Layout from "./Layout";
import Dashboard from "./Dashboard";
import Learn from "./Learn";
import Lesson from "./Lesson";
import Projects from "./Projects";
import ProjectDetail from "./ProjectDetail";
import Flashcards from "./Flashcards";
import CodePlayground from "./CodePlayground";
import Minigames from "./Minigames";

// Initialize QueryClient directly in file so we don't rely on missing lib/ path
const queryClientInstance = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/lesson/:id" element={<Lesson />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/flashcards" element={<Flashcards />} />
                <Route path="/playground" element={<CodePlayground />} />
                <Route path="/minigames" element={<Minigames />} />
              </Route>
            </Route>

            {/* 404 Catch-All */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
