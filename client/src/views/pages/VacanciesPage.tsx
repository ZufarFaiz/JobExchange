import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { VacancyPresenter } from '../../presenters/VacancyPresenter'
import type { ShortVacancyDto, VacancyFilterRequest } from '../../types/api'
import { ErrorBanner } from '../components/ErrorBanner'
import { Loader } from '../components/Loader'
import { getErrorMessage } from '../../utils/app'

export function VacanciesPage() {
  const [items, setItems] = useState<ShortVacancyDto[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<VacancyFilterRequest>({})
  const [appliedFilters, setAppliedFilters] = useState<VacancyFilterRequest>({})

  const loadVacancies = (currentPage: number, currentFilters: VacancyFilterRequest) => {
    setLoading(true)
    setError(null)
    const hasFilters = Object.values(currentFilters).some(value => value !== undefined && value !== '')
    const promise = hasFilters
      ? VacancyPresenter.getFilteredList(currentFilters, currentPage, 10)
      : VacancyPresenter.getList(currentPage, 10)
    promise
      .then((data) => {
        setItems(data.content)
        setTotalPages(data.totalPages)
      })
      .catch((loadError) => setError(getErrorMessage(loadError, 'Failed to load vacancies')))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadVacancies(page, appliedFilters)
  }, [page, appliedFilters])

  const handleApplyFilters = () => {
    setAppliedFilters(filters)
    setPage(0)
  }

  const handleClearFilters = () => {
    setFilters({})
    setAppliedFilters({})
    setPage(0)
  }

  const updateFilter = (key: keyof VacancyFilterRequest, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined }))
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="text-center">
          <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
            Discover Your Dream Job
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Explore exciting opportunities and apply with ease.
          </p>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-indigo-200 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
          <h2 className="mb-4 flex items-center text-xl font-semibold text-indigo-800">
            <span className="mr-2 text-2xl">🔍</span> Filter Vacancies
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">📝</span>
              <input
                type="text"
                placeholder="Job Title"
                value={filters.title || ''}
                onChange={(e) => updateFilter('title', e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">📍</span>
              <input
                type="text"
                placeholder="Location"
                value={filters.location || ''}
                onChange={(e) => updateFilter('location', e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">💰</span>
              <input
                type="number"
                placeholder="Min Salary"
                value={filters.salaryMin || ''}
                onChange={(e) => updateFilter('salaryMin', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">💰</span>
              <input
                type="number"
                placeholder="Max Salary"
                value={filters.salaryMax || ''}
                onChange={(e) => updateFilter('salaryMax', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
            <select
              value={filters.employmentType || ''}
              onChange={(e) => updateFilter('employmentType', e.target.value || undefined)}
              className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="">Employment Type</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="PROJECT">Project</option>
              <option value="INTERNSHIP">Internship</option>
            </select>
            <select
              value={filters.workFormat || ''}
              onChange={(e) => updateFilter('workFormat', e.target.value || undefined)}
              className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="">Work Format</option>
              <option value="OFFICE">Office</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
            </select>
            <select
              value={filters.experienceLevel || ''}
              onChange={(e) => updateFilter('experienceLevel', e.target.value || undefined)}
              className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="">Experience Level</option>
              <option value="NO_EXPERIENCE">No Experience</option>
              <option value="JUNIOR">Junior</option>
              <option value="MIDDLE">Middle</option>
              <option value="SENIOR">Senior</option>
            </select>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={handleApplyFilters}
              className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl"
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={handleClearFilters}
              className="rounded-lg bg-gradient-to-r from-gray-500 to-slate-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:from-gray-600 hover:to-slate-700 hover:shadow-xl"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {loading && <Loader />}
        {error && <ErrorBanner message={error} />}
        {!loading && !error && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((vacancy, index) => (
                <Link
                  key={vacancy.id}
                  to={`/vacancies/${vacancy.id}`}
                  className="group block animate-fade-in-up transform rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:border-indigo-300 hover:shadow-2xl"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mb-4 flex items-start justify-between">
                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600">
                      {vacancy.title}
                    </h2>
                    <span className="text-2xl">💼</span>
                  </div>
                  <p className="mb-4 text-sm font-medium text-slate-600">{vacancy.companyTitle}</p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                      📍 {vacancy.location}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      {vacancy.employmentType}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
                      {vacancy.workFormat}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
                      {vacancy.experienceLevel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-indigo-600">
                      ${vacancy.salaryMin} - ${vacancy.salaryMax}
                    </p>
                    <span className="text-indigo-500 transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                className="rounded-lg bg-gradient-to-r from-slate-400 to-slate-500 px-4 py-2 font-medium text-white shadow-md transition-all duration-300 hover:from-slate-500 hover:to-slate-600 disabled:opacity-50"
                disabled={page <= 0}
                onClick={() => setPage((prev) => prev - 1)}
              >
                ← Previous
              </button>
              <span className="rounded-lg bg-white px-4 py-2 font-medium text-slate-700 shadow-md">
                Page {page + 1} of {Math.max(totalPages, 1)}
              </span>
              <button
                type="button"
                className="rounded-lg bg-gradient-to-r from-slate-400 to-slate-500 px-4 py-2 font-medium text-white shadow-md transition-all duration-300 hover:from-slate-500 hover:to-slate-600 disabled:opacity-50"
                disabled={totalPages > 0 && page >= totalPages - 1}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
