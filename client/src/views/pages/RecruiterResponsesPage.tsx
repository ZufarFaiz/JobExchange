import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RecruiterPresenter } from '../../presenters/RecruiterPresenter'
import type { ShortResponseDto } from '../../types/api'
import { ErrorBanner } from '../components/ErrorBanner'
import { getErrorMessage } from '../../utils/app'

export function RecruiterResponsesPage() {
  const [items, setItems] = useState<ShortResponseDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadResponses = async () => {
    setError(null)
    setLoading(true)
    try {
      const page = await RecruiterPresenter.getResponses()
      setItems(page.content)
    } catch (loadError) {
      setError(getErrorMessage(loadError, 'Не удалось загрузить отклики'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadResponses()
  }, [])

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Отклики</h1>
        <Link to="/recruiter" className="text-sm text-slate-600 hover:text-slate-900">
          Назад в профиль
        </Link>
      </div>
      {error && <ErrorBanner message={error} />}
      <div className="rounded border bg-white p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded bg-slate-900 px-3 py-2 text-white disabled:opacity-50"
            type="button"
            onClick={loadResponses}
            disabled={loading}
          >
            {loading ? 'Загрузка...' : 'Обновить список откликов'}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Кандидат</th>
                <th className="p-2">Вакансия</th>
                <th className="p-2">Статус</th>
                <th className="p-2">Дата</th>
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
                      Открыть
                    </Link>
                  </td>
                </tr>
              ))}
              {!loading && items.length === 0 && (
                <tr>
                  <td className="p-3 text-slate-500" colSpan={6}>
                    Нет откликов. Нажмите «Обновить список откликов», чтобы попробовать снова.
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
