import { useEffect, useState } from 'react'
import { ApplicantPresenter } from '../../presenters/ApplicantPresenter'
import type { ApplicantProfileDto } from '../../types/api'
import { ErrorBanner } from '../components/ErrorBanner'
import { Loader } from '../components/Loader'
import { getErrorMessage } from '../../utils/app'

export function ApplicantPage() {
  const [profile, setProfile] = useState<ApplicantProfileDto | null>(null)
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const loadProfile = () => {
    setLoading(true)
    ApplicantPresenter.getProfile()
      .then((data) => {
        setProfile(data)
        setProfileForm({
          firstName: data.firstName ?? '',
          lastName: data.lastName ?? '',
          phoneNumber: data.phoneNumber ?? '',
        })
      })
      .catch((error) => setError(getErrorMessage(error, 'Не удалось загрузить профиль соискателя')))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const onUploadResume = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setError(null)
    setSuccess(null)
    try {
      const updated = await ApplicantPresenter.uploadResume(file)
      setProfile(updated)
      setSuccess('Резюме загружено.')
    } catch (error) {
      setError(getErrorMessage(error, 'Не удалось загрузить резюме'))
    }
  }

  const onViewResume = async () => {
    try {
      const blob = await ApplicantPresenter.viewResume()
      const url = window.URL.createObjectURL(blob)
      window.open(url, '_blank')
    } catch (error) {
      setError(getErrorMessage(error, 'Не удалось открыть резюме'))
    }
  }

  const onDeleteResume = async () => {
    if (!confirm('Вы уверены, что хотите удалить резюме?')) return
    setError(null)
    setSuccess(null)
    try {
      const updated = await ApplicantPresenter.deleteResume()
      setProfile(updated)
      setSuccess('Резюме удалено.')
    } catch (error) {
      setError(getErrorMessage(error, 'Не удалось удалить резюме'))
    }
  }

  const onUpdateProfile = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    try {
      const updated = await ApplicantPresenter.updateProfile(profileForm)
      setProfile(updated)
      setSuccess('Профиль обновлен.')
    } catch (error) {
      setError(getErrorMessage(error, 'Не удалось обновить профиль'))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="text-center">
          <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
            Панель соискателя
          </h1>
          <p className="mt-2 text-slate-600">Управляйте своим профилем и заявками</p>
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
            <div className="rounded-2xl border border-indigo-200 bg-white/90 p-6 shadow-xl backdrop-blur-sm md:col-span-2">
              <h2 className="mb-4 flex items-center text-xl font-semibold text-slate-900">
                <span className="mr-2 text-2xl">👤</span> Информация о профиле
              </h2>
              <div className="space-y-3 mb-6">
                <p className="text-lg font-medium text-slate-900">{profile.firstName} {profile.lastName}</p>
                <p className="text-slate-600">📧 {profile.email}</p>
                <p className="text-slate-600">📞 {profile.phoneNumber}</p>
                <p className="text-slate-600">📄 Резюме: {profile.resumeUrl ? 'Загружено' : 'Не загружено'}</p>
                <p className="text-slate-600">📊 Всего заявок: {profile.totalResponses}</p>
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
            <div className="rounded-2xl border border-indigo-200 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
              <h2 className="mb-4 flex items-center text-xl font-semibold text-slate-900">
                <span className="mr-2 text-2xl">📄</span> Обновить резюме
              </h2>
              {profile.resumeUrl ? (
                <div className="mb-4 flex gap-2">
                  <button
                    onClick={onViewResume}
                    className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                  >
                    👁 Просмотреть
                  </button>
                  <button
                    onClick={onDeleteResume}
                    className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
                  >
                    🗑 Удалить
                  </button>
                </div>
              ) : null}
              <div className="space-y-3">
                <input
                  id="resume-upload"
                  type="file"
                  onChange={onUploadResume}
                  className="hidden"
                />
                <label
                  htmlFor="resume-upload"
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-indigo-300 bg-indigo-50 py-4 text-indigo-600 transition-all duration-300 hover:border-indigo-500 hover:bg-indigo-100 hover:text-indigo-700"
                >
                  <span className="text-2xl">📎</span>
                  <span className="font-medium">Выбрать файл резюме</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
