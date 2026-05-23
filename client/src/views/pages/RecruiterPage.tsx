import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RecruiterPresenter } from '../../presenters/RecruiterPresenter'
import type { RecruiterProfileDto } from '../../types/api'
import { ErrorBanner } from '../components/ErrorBanner'
import { Loader } from '../components/Loader'
import { getErrorMessage } from '../../utils/app'

export function RecruiterPage() {
  const [profile, setProfile] = useState<RecruiterProfileDto | null>(null)
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    RecruiterPresenter.getProfile()
      .then((data) => {
        setProfile(data)
        setProfileForm({
          firstName: data.firstName ?? '',
          lastName: data.lastName ?? '',
          phoneNumber: data.phoneNumber ?? '',
        })
      })
      .catch((error) => setError(getErrorMessage(error, 'Не удалось загрузить профиль рекрутёра')))
      .finally(() => setLoading(false))
  }, [])

  const onUpdateProfile = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    try {
      const updated = await RecruiterPresenter.updateProfile(profileForm)
      setProfile(updated)
      setSuccess('Профиль обновлён.')
    } catch (error) {
      setError(getErrorMessage(error, 'Не удалось обновить профиль'))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="text-center">
          <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
            Панель рекрутёра
          </h1>
          <p className="mt-2 text-slate-600">Управляйте компанией и размещением вакансий</p>
        </div>
        {loading && <Loader />}
        {error && <ErrorBanner message={error} />}
        {success && (
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3 rounded-lg border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4 shadow-lg">
              <span className="text-2xl">✅</span>
              <span className="text-lg font-medium text-emerald-700">{success}</span>
            </div>
          </div>
        )}
        {profile && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-indigo-200 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
              <h2 className="mb-4 flex items-center text-xl font-semibold text-slate-900">
                <span className="mr-2 text-2xl">👤</span> Информация профиля
              </h2>
              <div className="space-y-3 mb-6">
                <p className="text-lg font-medium text-slate-900">{profile.firstName} {profile.lastName}</p>
                <p className="text-slate-600">📧 {profile.email}</p>
                <p className="text-slate-600">📞 {profile.phoneNumber}</p>
                <p className="text-slate-600">🏢 {profile.companyTitle} ({profile.companyLocation})</p>
                <p className="text-slate-600">✅ Проверено: {profile.isVerified ? 'Да' : 'Нет'}</p>
                <p className="text-slate-600">📊 Всего вакансий: {profile.totalVacancies}</p>
                <p className="text-slate-600">🔥 Активных вакансий: {profile.activeVacancies}</p>
              </div>
              <form className="space-y-4" onSubmit={onUpdateProfile}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">👤 Имя</label>
                    <input
                      className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      placeholder="Имя"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">👤 Фамилия</label>
                    <input
                      className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      placeholder="Фамилия"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, lastName: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">📞 Номер телефона</label>
                  <input
                    className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="Номер телефона"
                    value={profileForm.phoneNumber}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                  />
                </div>
                <button
                  className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl"
                  type="submit"
                >
                  Обновить профиль
                </button>
              </form>
            </div>
            <div className="space-y-6">
              <div className="rounded-2xl border border-indigo-200 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
                <h2 className="mb-4 flex items-center text-xl font-semibold text-slate-900">
                  <span className="mr-2 text-2xl">💼</span> Управление вакансиями
                </h2>
                <div className="space-y-4">
                  <Link
                    to="/recruiter/vacancies/create"
                    className="block w-full rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 py-3 text-center font-medium text-white shadow-lg transition-all duration-300 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl"
                  >
                    ➕ Создать новую вакансию
                  </Link>
                  <Link
                    to="/recruiter/responses"
                    className="block w-full rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 py-3 text-center font-medium text-white shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-indigo-700 hover:shadow-xl"
                  >
                    📋 Просмотреть ответы
                  </Link>
                </div>
              </div>
              <div className="rounded-2xl border border-indigo-200 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
                <h2 className="mb-4 flex items-center text-xl font-semibold text-slate-900">
                  <span className="mr-2 text-2xl">📈</span> Статистика
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-blue-50 p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">{profile.totalVacancies}</p>
                    <p className="text-sm text-blue-700">Всего вакансий</p>
                  </div>
                  <div className="rounded-lg bg-green-50 p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">{profile.activeVacancies}</p>
                    <p className="text-sm text-green-700">Активных вакансий</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
