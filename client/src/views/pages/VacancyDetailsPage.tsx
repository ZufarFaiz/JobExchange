import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ApplicantPresenter } from '../../presenters/ApplicantPresenter'
import { VacancyPresenter } from '../../presenters/VacancyPresenter'
import type { VacancyDto } from '../../types/api'
import { ErrorBanner } from '../components/ErrorBanner'
import { Loader } from '../components/Loader'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../../utils/app'

export function VacancyDetailsPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [item, setItem] = useState<VacancyDto | null>(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError('Invalid vacancy id')
      setLoading(false)
      return
    }
    setError(null)
    VacancyPresenter.getById(Number(id))
      .then(setItem)
      .catch((fetchError) => setError(getErrorMessage(fetchError, 'Failed to load vacancy')))
      .finally(() => setLoading(false))
  }, [id])

  const onApply = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!id) return
    setError(null)
    setSuccess(null)
    try {
      await ApplicantPresenter.createResponse({
        vacancyId: Number(id),
        coverLetter,
      })
      setCoverLetter('')
      setSuccess('Response created.')
    } catch (applyError) {
      setError(getErrorMessage(applyError, 'Failed to create response'))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="text-center">
          <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
            Vacancy Details
          </h1>
        </div>
        {loading && <Loader />}
        {error && <ErrorBanner message={error} />}
        {item && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">{item.title}</h2>
                  <p className="mt-2 text-lg text-slate-600">{item.companyTitle} - {item.companyLocation}</p>
                </div>
                <span className="text-4xl">💼</span>
              </div>
              <div className="mb-6 flex flex-wrap gap-3">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800">
                  📍 {item.location}
                </span>
                <span className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800">
                  {item.employmentType}
                </span>
                <span className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800">
                  {item.workFormat}
                </span>
                <span className="inline-flex items-center rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-800">
                  {item.experienceLevel}
                </span>
              </div>
              <div className="mb-6 rounded-lg bg-indigo-50 p-4">
                <p className="text-2xl font-semibold text-indigo-600">
                  💰 ${item.salaryMin} - ${item.salaryMax}
                </p>
              </div>
              <div className="mb-6 space-y-4">
                <h3 className="text-xl font-semibold text-slate-900">📝 Description</h3>
                <p className="whitespace-pre-line text-slate-700 leading-relaxed">{item.description}</p>
              </div>
              <div className="mb-6 space-y-4">
                <h3 className="text-xl font-semibold text-slate-900">✅ Requirements</h3>
                <p className="whitespace-pre-line text-slate-700 leading-relaxed">{item.requirements}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-slate-600">
                  👨‍💼 Recruiter: <span className="font-medium">{item.recruiterName}</span> ({item.recruiterEmail})
                </p>
              </div>
            </div>
            {success && (
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-3 rounded-lg border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4 shadow-lg">
                  <span className="text-2xl">✅</span>
                  <span className="text-lg font-medium text-emerald-700">{success}</span>
                </div>
              </div>
            )}
            {user?.role === 'ROLE_APPLICANT' && (
              <div className="rounded-2xl border border-indigo-200 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
                <h3 className="mb-4 text-xl font-semibold text-slate-900">🚀 Apply for this vacancy</h3>
                <form onSubmit={onApply} className="space-y-4">
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-400">📄</span>
                    <textarea
                      className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      placeholder="Write your cover letter..."
                      rows={5}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl"
                    type="submit"
                  >
                    Send Application
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
