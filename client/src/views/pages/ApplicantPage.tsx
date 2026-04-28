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
      .catch((error) => setError(getErrorMessage(error, 'Failed to load applicant profile')))
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
      setSuccess('Resume uploaded.')
    } catch (error) {
      setError(getErrorMessage(error, 'Failed to upload resume'))
    }
  }

  const onUpdateProfile = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    try {
      const updated = await ApplicantPresenter.updateProfile(profileForm)
      setProfile(updated)
      setSuccess('Profile updated.')
    } catch (error) {
      setError(getErrorMessage(error, 'Failed to update profile'))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="text-center">
          <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
            Applicant Dashboard
          </h1>
          <p className="mt-2 text-slate-600">Manage your profile and applications</p>
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
                <span className="mr-2 text-2xl">👤</span> Profile Information
              </h2>
              <div className="space-y-3 mb-6">
                <p className="text-lg font-medium text-slate-900">{profile.firstName} {profile.lastName}</p>
                <p className="text-slate-600">📧 {profile.email}</p>
                <p className="text-slate-600">📞 {profile.phoneNumber}</p>
                <p className="text-slate-600">📄 Resume: {profile.resumeUrl ? 'Uploaded' : 'Not uploaded'}</p>
                <p className="text-slate-600">📊 Total Responses: {profile.totalResponses}</p>
              </div>
              <form className="space-y-4" onSubmit={onUpdateProfile}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">👤 First Name</label>
                    <input
                      className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      placeholder="First name"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">👤 Last Name</label>
                    <input
                      className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      placeholder="Last name"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, lastName: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">📞 Phone Number</label>
                  <input
                    className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="Phone number"
                    value={profileForm.phoneNumber}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                  />
                </div>
                <button
                  className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl"
                  type="submit"
                >
                  Update Profile
                </button>
              </form>
            </div>
            <div className="rounded-2xl border border-indigo-200 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
              <h2 className="mb-4 flex items-center text-xl font-semibold text-slate-900">
                <span className="mr-2 text-2xl">📄</span> Upload Resume
              </h2>
              <input
                type="file"
                onChange={onUploadResume}
                className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
