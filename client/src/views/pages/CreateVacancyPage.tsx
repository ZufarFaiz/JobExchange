import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RecruiterPresenter } from '../../presenters/RecruiterPresenter'
import type { VacancyCreateRequest } from '../../types/api'
import { ErrorBanner } from '../components/ErrorBanner'
import { getErrorMessage } from '../../utils/app'

const initialVacancy: VacancyCreateRequest = {
  title: '',
  description: '',
  location: '',
  salaryMin: 0,
  salaryMax: 0,
  requirements: '',
  employmentType: 'FULL_TIME',
  workFormat: 'OFFICE',
  experienceLevel: 'JUNIOR',
}

export function CreateVacancyPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<VacancyCreateRequest>(initialVacancy)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await RecruiterPresenter.createVacancy(form)
      navigate('/recruiter')
    } catch (submitError) {
      setError(getErrorMessage(submitError, 'Failed to create vacancy'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
            Create New Vacancy
          </h1>
          <Link
            to="/recruiter"
            className="rounded-lg bg-slate-200 px-4 py-2 font-medium text-slate-700 transition-all duration-300 hover:bg-slate-300 hover:shadow-md"
          >
            ← Back to Profile
          </Link>
        </div>
        {error && <ErrorBanner message={error} />}
        <form
          onSubmit={onSubmit}
          className="grid gap-6 rounded-2xl border border-indigo-200 bg-white/90 p-8 shadow-xl backdrop-blur-sm md:grid-cols-2"
        >
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">📝 Job Title</label>
            <input
              className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Enter job title"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">📍 Location</label>
            <input
              className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="City, Country"
              value={form.location}
              onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">💰 Min Salary</label>
              <input
                className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="0"
                type="number"
                value={form.salaryMin}
                onChange={(e) => setForm((prev) => ({ ...prev, salaryMin: Number(e.target.value) }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">💰 Max Salary</label>
              <input
                className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="0"
                type="number"
                value={form.salaryMax}
                onChange={(e) => setForm((prev) => ({ ...prev, salaryMax: Number(e.target.value) }))}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">🏢 Employment Type</label>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              value={form.employmentType}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, employmentType: e.target.value as VacancyCreateRequest['employmentType'] }))
              }
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="PROJECT">Project</option>
              <option value="INTERNSHIP">Internship</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">🏠 Work Format</label>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              value={form.workFormat}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, workFormat: e.target.value as VacancyCreateRequest['workFormat'] }))
              }
            >
              <option value="OFFICE">Office</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">🎯 Experience Level</label>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              value={form.experienceLevel}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, experienceLevel: e.target.value as VacancyCreateRequest['experienceLevel'] }))
              }
            >
              <option value="NO_EXPERIENCE">No Experience</option>
              <option value="JUNIOR">Junior</option>
              <option value="MIDDLE">Middle</option>
              <option value="SENIOR">Senior</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">📖 Job Description</label>
            <textarea
              className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Describe the job role and responsibilities..."
              rows={4}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">✅ Requirements</label>
            <textarea
              className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="List the required skills and qualifications..."
              rows={4}
              value={form.requirements}
              onChange={(e) => setForm((prev) => ({ ...prev, requirements: e.target.value }))}
              required
            />
          </div>
          <div className="md:col-span-2">
            <button
              className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating Vacancy...' : '🚀 Create Vacancy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
