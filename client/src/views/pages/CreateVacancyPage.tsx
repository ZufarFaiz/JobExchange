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

  const employmentTypeLabels = {
    FULL_TIME: 'Полная занятость',
    PART_TIME: 'Частичная занятость',
    PROJECT: 'Проектная работа',
    INTERNSHIP: 'Стажировка',
  }

  const workFormatLabels = {
    OFFICE: 'Офис',
    REMOTE: 'Удаленная работа',
    HYBRID: 'Гибрид',
  }

  const experienceLevelLabels = {
    NO_EXPERIENCE: 'Без опыта',
    JUNIOR: 'Начинающий специалист',
    MIDDLE: 'Специалист',
    SENIOR: 'Ведущий специалист',
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await RecruiterPresenter.createVacancy(form)
      navigate('/recruiter')
    } catch (submitError) {
      setError(getErrorMessage(submitError, 'Не удалось создать вакансию'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
            Создать новую вакансию
          </h1>
          <Link
            to="/recruiter"
            className="rounded-lg bg-slate-200 px-4 py-2 font-medium text-slate-700 transition-all duration-300 hover:bg-slate-300 hover:shadow-md"
          >
            ← Назад к профилю
          </Link>
        </div>
        {error && <ErrorBanner message={error} />}
        <form
          onSubmit={onSubmit}
          className="grid gap-6 rounded-2xl border border-indigo-200 bg-white/90 p-8 shadow-xl backdrop-blur-sm md:grid-cols-2"
        >
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">📝 Название должности</label>
            <input
              className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Введите название должности"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">📍 Местоположение</label>
            <input
              className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Город, Страна"
              value={form.location}
              onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">💰 Минимальная зарплата</label>
              <input
                className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="0 ₽"
                type="number"
                min="0"
                step="1"
                value={form.salaryMin || ''}
                onChange={(e) => setForm((prev) => ({ ...prev, salaryMin: e.target.value === '' ? 0 : Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">💰 Максимальная зарплата</label>
              <input
                className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="0 ₽"
                type="number"
                min="0"
                step="1"
                value={form.salaryMax || ''}
                onChange={(e) => setForm((prev) => ({ ...prev, salaryMax: e.target.value === '' ? 0 : Number(e.target.value) }))}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">🏢 Тип занятости</label>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              value={form.employmentType}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, employmentType: e.target.value as VacancyCreateRequest['employmentType'] }))
              }
            >
              <option value="FULL_TIME">{employmentTypeLabels.FULL_TIME}</option>
              <option value="PART_TIME">{employmentTypeLabels.PART_TIME}</option>
              <option value="PROJECT">{employmentTypeLabels.PROJECT}</option>
              <option value="INTERNSHIP">{employmentTypeLabels.INTERNSHIP}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">🏠 Формат работы</label>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              value={form.workFormat}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, workFormat: e.target.value as VacancyCreateRequest['workFormat'] }))
              }
            >
              <option value="OFFICE">{workFormatLabels.OFFICE}</option>
              <option value="REMOTE">{workFormatLabels.REMOTE}</option>
              <option value="HYBRID">{workFormatLabels.HYBRID}</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">🎯 Уровень опыта</label>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              value={form.experienceLevel}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, experienceLevel: e.target.value as VacancyCreateRequest['experienceLevel'] }))
              }
            >
              <option value="NO_EXPERIENCE">{experienceLevelLabels.NO_EXPERIENCE}</option>
              <option value="JUNIOR">{experienceLevelLabels.JUNIOR}</option>
              <option value="MIDDLE">{experienceLevelLabels.MIDDLE}</option>
              <option value="SENIOR">{experienceLevelLabels.SENIOR}</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">📖 Описание должности</label>
            <textarea
              className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Опишите роль и обязанности должности..."
              rows={4}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">✅ Требования</label>
            <textarea
              className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Перечислите требуемые навыки и квалификацию..."
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
              {loading ? 'Создание вакансии...' : '🚀 Создать вакансию'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
