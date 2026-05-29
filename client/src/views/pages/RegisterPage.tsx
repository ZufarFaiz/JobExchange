import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthPresenter } from '../../presenters/AuthPresenter'
import { ErrorBanner } from '../components/ErrorBanner'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage, getRoleHomePath } from '../../utils/app'

type RegisterMode = 'applicant' | 'recruiter'

export function RegisterPage() {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [mode, setMode] = useState<RegisterMode>('applicant')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    companyTaxId: '',
    companyTitle: '',
    companyLocation: '',
    companyDescription: '',
  })

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const user =
        mode === 'applicant'
          ? await AuthPresenter.registerApplicant({
              email: form.email,
              password: form.password,
              firstName: form.firstName,
              lastName: form.lastName,
              phoneNumber: form.phoneNumber,
            })
          : await AuthPresenter.registerRecruiter(form)
      setUser(user)
      navigate(user?.role ? getRoleHomePath(user.role) : '/login')
    } catch (error) {
      setError(getErrorMessage(error, 'Регистрация не удалась.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <section className="w-full max-w-md space-y-6 rounded-2xl border border-indigo-200 bg-white/90 p-8 shadow-2xl backdrop-blur-sm">
        <div className="text-center">
          <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
            Создать аккаунт
          </h1>
          <p className="mt-2 text-slate-600">Присоединяйтесь к нашей платформе</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode('applicant')}
            className={`flex-1 rounded-lg py-2 font-medium transition-all duration-300 ${
              mode === 'applicant'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Соискатель
          </button>
          <button
            type="button"
            onClick={() => setMode('recruiter')}
            className={`flex-1 rounded-lg py-2 font-medium transition-all duration-300 ${
              mode === 'recruiter'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Рекрутер
          </button>
        </div>
        {error && <ErrorBanner message={error} />}
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">📧</span>
            <input
              className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔒</span>
            <input
              className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">👤</span>
              <input
                className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Имя"
                value={form.firstName}
                onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">👤</span>
              <input
                className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Фамилия"
                value={form.lastName}
                onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
              />
            </div>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">📞</span>
            <input
              className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Номер телефона"
              value={form.phoneNumber}
              onChange={(e) => setForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
            />
          </div>
          {mode === 'recruiter' && (
            <>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🏢</span>
                <input
                  className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="ИНН компании"
                  value={form.companyTaxId}
                  onChange={(e) => setForm((prev) => ({ ...prev, companyTaxId: e.target.value }))}
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🏢</span>
                <input
                  className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Название компании"
                  value={form.companyTitle}
                  onChange={(e) => setForm((prev) => ({ ...prev, companyTitle: e.target.value }))}
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">📍</span>
                <input
                  className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Местоположение компании"
                  value={form.companyLocation}
                  onChange={(e) => setForm((prev) => ({ ...prev, companyLocation: e.target.value }))}
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">📝</span>
                <textarea
                  className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Описание компании"
                  rows={3}
                  value={form.companyDescription}
                  onChange={(e) => setForm((prev) => ({ ...prev, companyDescription: e.target.value }))}
                />
              </div>
            </>
          )}
          <button
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl disabled:opacity-50"
            type="submit"
          >
            {loading ? 'Создание аккаунта...' : 'Создать аккаунт'}
          </button>
        </form>
        <p className="text-center text-sm text-slate-600">
          Уже есть аккаунт? <a href="/login" className="text-indigo-600 hover:underline">Войти</a>
        </p>
      </section>
    </div>
  )
}
