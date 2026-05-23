import { useEffect, useState } from 'react'
import { AdminPresenter } from '../../presenters/AdminPresenter'
import type { RecruiterDto, CompanyDto } from '../../types/api'
import { ErrorBanner } from '../components/ErrorBanner'
import { Loader } from '../components/Loader'
import { getErrorMessage } from '../../utils/app'

export function AdminPage() {
  const [recruiters, setRecruiters] = useState<RecruiterDto[]>([])
  const [companies, setCompanies] = useState<CompanyDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [recruiterPage, companyPage] = await Promise.all([
        AdminPresenter.getPendingRecruiters(),
        AdminPresenter.getPendingCompanies(),
      ])
      setRecruiters(recruiterPage.content)
      setCompanies(companyPage.content)
    } catch (error) {
      setError(getErrorMessage(error, 'Не удалось загрузить данные администратора'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const onVerifyRecruiter = async (id: number) => {
    setError(null)
    try {
      await AdminPresenter.verifyRecruiter(id)
      await loadData()
    } catch (error) {
      setError(getErrorMessage(error, 'Не удалось подтвердить рекрутёра'))
    }
  }

  const onVerifyCompany = async (id: number) => {
    setError(null)
    try {
      await AdminPresenter.verifyCompany(id)
      await loadData()
    } catch (error) {
      setError(getErrorMessage(error, 'Не удалось подтвердить компанию'))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="text-center">
          <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
            Панель администратора
          </h1>
          <p className="mt-2 text-slate-600">Управление подтверждением компаний и рекрутёров</p>
        </div>

        {loading && <Loader />}
        {error && <ErrorBanner message={error} />}

        {!loading && !error && (
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-indigo-200 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Ожидающие рекрутёры</h2>
                  <p className="mt-1 text-sm text-slate-500">Рекрутёры, ожидающие проверки администратора</p>
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">{recruiters.length}</span>
              </div>
              {recruiters.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="p-3 font-medium text-slate-700">Имя</th>
                        <th className="p-3 font-medium text-slate-700">Email</th>
                        <th className="p-3 font-medium text-slate-700">Компания</th>
                        <th className="p-3 font-medium text-slate-700">Действие</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recruiters.map((recruiter, index) => (
                        <tr key={recruiter.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} border-t border-slate-200`}>
                          <td className="p-3 text-slate-900">{recruiter.firstName} {recruiter.lastName}</td>
                          <td className="p-3 text-slate-600">{recruiter.email}</td>
                          <td className="p-3 text-slate-600">{recruiter.companyTitle}</td>
                          <td className="p-3">
                            <button
                              type="button"
                              className="rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 font-medium text-white shadow-md transition-all duration-300 hover:from-green-600 hover:to-emerald-700 hover:shadow-lg"
                              onClick={() => onVerifyRecruiter(recruiter.id)}
                            >
                              ✅ Подтвердить
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                  Пока нет рекрутёров для проверки.
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-indigo-200 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Ожидающие компании</h2>
                  <p className="mt-1 text-sm text-slate-500">Компании, которые нужно подтвердить в системе</p>
                </div>
                <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">{companies.length}</span>
              </div>
              {companies.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="p-3 font-medium text-slate-700">Компания</th>
                        <th className="p-3 font-medium text-slate-700">ИНН</th>
                        <th className="p-3 font-medium text-slate-700">Локация</th>
                        <th className="p-3 font-medium text-slate-700">Действие</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companies.map((company, index) => (
                        <tr key={company.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} border-t border-slate-200`}>
                          <td className="p-3 text-slate-900">{company.title}</td>
                          <td className="p-3 text-slate-600">{company.taxId}</td>
                          <td className="p-3 text-slate-600">{company.location}</td>
                          <td className="p-3">
                            <button
                              type="button"
                              className="rounded-lg bg-gradient-to-r from-indigo-500 to-blue-600 px-4 py-2 font-medium text-white shadow-md transition-all duration-300 hover:from-indigo-600 hover:to-blue-700 hover:shadow-lg"
                              onClick={() => onVerifyCompany(company.id)}
                            >
                              ✅ Подтвердить
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                  Пока нет компаний для проверки.
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
