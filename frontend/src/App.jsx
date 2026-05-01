import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import Layout from "./layout/Layout";
import AdminRoute from "./components/AdminRoute";

import HomePage from "./page/HomePage";
import LoginPage from "./page/LoginPage";
import SignUpPage from "./page/SignUpPage";
import AddProblem from "./page/AddProblem";
import EditProblem from "./page/EditProblem";
import ProblemPage from "./page/ProblemPage";
import Profile from "./page/Profile";
import ProblemsPage from "./page/ProblemsPage";
import ContestListPage from "./page/ContestListPage";
import ContestDetailPage from "./page/ContestDetailPage";
import CreateContestPage from "./page/CreateContestPage";
import PricingPage from "./page/PricingPage";

import { useThemeStore } from "./store/useThemeStore";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen" data-theme={theme}>
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen w-full flex flex-col" data-theme={theme}>
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout /> }>
          {/* Public route */}
          <Route index element={<HomePage />} />

          {/* Protected routes */}
          <Route path="/problems" element={authUser ? <ProblemsPage /> : <Navigate to="/login" />} />
          <Route path="/contests" element={authUser ? <ContestListPage /> : <Navigate to="/login" />} />
          <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route element={<AdminRoute/>}>
            <Route path="/add-problem" element={authUser ? <AddProblem /> : <Navigate to="/" />} />
            <Route path="/edit-problem/:id" element={authUser ? <EditProblem /> : <Navigate to="/" />} />
            <Route path="/create-contest" element={<CreateContestPage />} />
          </Route>
        </Route>
        
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />

        <Route path="/problem/:id" element={authUser ? <ProblemPage /> : <Navigate to={"/login"} />} />
        <Route path="/contest/:id" element={authUser ? <ContestDetailPage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
