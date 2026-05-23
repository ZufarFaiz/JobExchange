import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthPresenter } from '../../presenters/AuthPresenter'
import { ErrorBanner } from '../components/ErrorBanner'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage, getRoleHomePath } from '../../utils/app'

export function LoginPage() {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const user = await AuthPresenter.login({ email, password })
      setUser(user)
      navigate(user?.role ? getRoleHomePath(user.role) : '/vacancies')
    } catch (error) {
      setError(getErrorMessage(error, 'Не удалось войти. Проверьте учетные данные.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <section className="w-full max-w-md space-y-6 rounded-2xl border border-indigo-200 bg-white/90 p-8 shadow-2xl backdrop-blur-sm">
        <div className="text-center">
          <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
            Добро пожаловать обратно
          </h1>
          <p className="mt-2 text-slate-600">Войдите в свой аккаунт</p>
        </div>
        {error && <ErrorBanner message={error} />}
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">📧</span>
            <input
              className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔒</span>
            <input
              className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl disabled:opacity-50"
            type="submit"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        <p className="text-center text-sm text-slate-600">
          Нет аккаунта? <a href="/register" className="text-indigo-600 hover:underline">Зарегистрироваться</a>
        </p>
      </section>
    </div>
  )
}
