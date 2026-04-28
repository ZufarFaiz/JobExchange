import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function AppLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link className="font-semibold text-slate-900" to="/vacancies">
            JobExchange
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link to="/vacancies" className="text-slate-700 hover:text-slate-900">
              Vacancies
            </Link>
            {!user && (
              <>
                <Link to="/login" className="text-slate-700 hover:text-slate-900">
                  Login
                </Link>
                <Link to="/register" className="text-slate-700 hover:text-slate-900">
                  Register
                </Link>
              </>
            )}
            {user?.role === 'ROLE_APPLICANT' && (
              <Link to="/applicant" className="text-slate-700 hover:text-slate-900">
                Applicant
              </Link>
            )}
            {user?.role === 'ROLE_RECRUITER' && (
              <Link to="/recruiter" className="text-slate-700 hover:text-slate-900">
                Recruiter
              </Link>
            )}
            {(user?.role === 'ROLE_APPLICANT' || user?.role === 'ROLE_RECRUITER') && (
              <Link to="/chats" className="text-slate-700 hover:text-slate-900">
                Chats
              </Link>
            )}
            {user?.role === 'ROLE_ADMIN' && (
              <Link to="/admin" className="text-slate-700 hover:text-slate-900">
                Admin
              </Link>
            )}
            {user && (
              <button
                onClick={logout}
                className="rounded bg-slate-900 px-3 py-1.5 text-white"
                type="button"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
