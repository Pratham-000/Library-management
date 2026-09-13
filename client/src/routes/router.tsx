import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { AppShell } from "../components/layout/AppShell";
import { AISearchPage } from "../pages/AISearchPage";
import { CreateResourcePage } from "../pages/CreateResourcePage";
import { DashboardPage } from "../pages/DashboardPage";
import { LoginPage } from "../pages/LoginPage";
import { NoteDetailPage } from "../pages/NoteDetailPage";
import { NotebooksPage } from "../pages/NotebooksPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ActiveSessionPage } from "../pages/ActiveSessionPage";
import { SessionHistoryPage } from "../pages/SessionHistoryPage";
export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/resources/new" element={<CreateResourcePage />} />
          <Route path="/notebooks" element={<NotebooksPage />} />
          <Route path="/notebooks/:id" element={<NoteDetailPage />} />
          <Route path="/sessions" element={<SessionHistoryPage />} />
          <Route path="/sessions/active" element={<ActiveSessionPage />} />
          <Route path="/ai-search" element={<AISearchPage />} />
        </Route>
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}