import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RecruiterPresenter } from '../../presenters/RecruiterPresenter'
import type { ShortResponseDto } from '../../types/api'
import { ErrorBanner } from '../components/ErrorBanner'
import { getErrorMessage } from '../../utils/app'

export function RecruiterResponsesPage() {
  const [vacancyId, setVacancyId] = useState('')
  const [items, setItems] = useState<ShortResponseDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onLoad = async () => {
    setError(null)
    setLoading(true)
    try {
      const page = await RecruiterPresenter.getResponses(Number(vacancyId))
      setItems(page.content)
    } catch (loadError) {
      setError(getErrorMessage(loadError, 'Failed to load responses'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Responses by Vacancy</h1>
        <Link to="/recruiter" className="text-sm text-slate-600 hover:text-slate-900">
          Back to profile
        </Link>
      </div>
      {error && <ErrorBanner message={error} />}
      <div className="rounded border bg-white p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          <input
            className="rounded border p-2"
            placeholder="Vacancy ID"
            value={vacancyId}
            onChange={(e) => setVacancyId(e.target.value)}
          />
          <button
            className="rounded bg-slate-900 px-3 py-2 text-white disabled:opacity-50"
            type="button"
            onClick={onLoad}
            disabled={loading || !vacancyId}
          >
            {loading ? 'Loading...' : 'Load responses'}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Applicant</th>
                <th className="p-2">Vacancy</th>
                <th className="p-2">Status</th>
                <th className="p-2">Created</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((response) => (
                <tr key={response.id} className="border-t">
                  <td className="p-2">{response.id}</td>
                  <td className="p-2">{response.applicantName}</td>
                  <td className="p-2">{response.vacancyTitle}</td>
                  <td className="p-2">{response.status}</td>
                  <td className="p-2">{new Date(response.createdAt).toLocaleString()}</td>
                  <td className="p-2">
                    <Link
                      to={`/recruiter/responses/${response.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
              {!loading && items.length === 0 && (
                <tr>
                  <td className="p-3 text-slate-500" colSpan={6}>
                    Enter vacancy ID and load responses.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
