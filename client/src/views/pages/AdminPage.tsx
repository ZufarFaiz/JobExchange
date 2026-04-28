import { useEffect, useState } from 'react'
import { AdminPresenter } from '../../presenters/AdminPresenter'
import type { RecruiterDto } from '../../types/api'
import { ErrorBanner } from '../components/ErrorBanner'
import { Loader } from '../components/Loader'
import { getErrorMessage } from '../../utils/app'

export function AdminPage() {
  const [items, setItems] = useState<RecruiterDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const page = await AdminPresenter.getPendingRecruiters()
      setItems(page.content)
    } catch (error) {
      setError(getErrorMessage(error, 'Failed to load pending recruiters'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const onVerify = async (id: number) => {
    try {
      await AdminPresenter.verifyRecruiter(id)
      await loadData()
    } catch (error) {
      setError(getErrorMessage(error, 'Failed to verify recruiter'))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="text-center">
          <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-slate-600">Manage pending recruiter verifications</p>
        </div>
        {loading && <Loader />}
        {error && <ErrorBanner message={error} />}
        {!loading && !error && (
          <div className="rounded-2xl border border-indigo-200 bg-white/90 shadow-xl backdrop-blur-sm overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
              <h2 className="text-xl font-semibold text-white">Pending Recruiters</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-4 font-medium text-slate-700">👤 Name</th>
                    <th className="p-4 font-medium text-slate-700">📧 Email</th>
                    <th className="p-4 font-medium text-slate-700">🏢 Company</th>
                    <th className="p-4 font-medium text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((recruiter, index) => (
                    <tr className={`border-t border-slate-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`} key={recruiter.id}>
                      <td className="p-4 text-slate-900">{recruiter.firstName} {recruiter.lastName}</td>
                      <td className="p-4 text-slate-600">{recruiter.email}</td>
                      <td className="p-4 text-slate-600">{recruiter.companyTitle}</td>
                      <td className="p-4">
                        <button
                          type="button"
                          className="rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 font-medium text-white shadow-md transition-all duration-300 hover:from-green-600 hover:to-emerald-700 hover:shadow-lg"
                          onClick={() => onVerify(recruiter.id)}
                        >
                          ✅ Verify
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {items.length === 0 && (
              <div className="p-8 text-center">
                <span className="text-4xl">🎉</span>
                <p className="mt-4 text-lg text-slate-600">No pending recruiters to verify!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
