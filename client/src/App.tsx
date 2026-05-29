import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './views/context/AuthContext'
import { ProtectedRoute } from './views/components/ProtectedRoute'
import { AppLayout } from './views/components/AppLayout'
import { LoginPage } from './views/pages/LoginPage'
import { RegisterPage } from './views/pages/RegisterPage'
import { VacanciesPage } from './views/pages/VacanciesPage'
import { VacancyDetailsPage } from './views/pages/VacancyDetailsPage'
import { ApplicantPage } from './views/pages/ApplicantPage'
import { RecruiterPage } from './views/pages/RecruiterPage'
import { CreateVacancyPage } from './views/pages/CreateVacancyPage'
import { RecruiterResponsesPage } from './views/pages/RecruiterResponsesPage'
import { RecruiterResponseDetailsPage } from './views/pages/RecruiterResponseDetailsPage'
import { ChatPage } from './views/pages/ChatPage'
import { AdminPage } from './views/pages/AdminPage'
import { NotFoundPage } from './views/pages/NotFoundPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/vacancies" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/vacancies" element={<VacanciesPage />} />
            <Route path="/vacancies/:id" element={<VacancyDetailsPage />} />

            <Route
              path="/applicant"
              element={
                <ProtectedRoute roles={['ROLE_APPLICANT']}>
                  <ApplicantPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter"
              element={
                <ProtectedRoute roles={['ROLE_RECRUITER']}>
                  <RecruiterPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/vacancies/create"
              element={
                <ProtectedRoute roles={['ROLE_RECRUITER']}>
                  <CreateVacancyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/responses"
              element={
                <ProtectedRoute roles={['ROLE_RECRUITER']}>
                  <RecruiterResponsesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/responses/:id"
              element={
                <ProtectedRoute roles={['ROLE_RECRUITER']}>
                  <RecruiterResponseDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chats"
              element={
                <ProtectedRoute roles={['ROLE_APPLICANT', 'ROLE_RECRUITER']}>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['ROLE_ADMIN']}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
