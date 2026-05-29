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
  const experienceLevelLabels = {
    NO_EXPERIENCE: 'Без опыта',
    JUNIOR: 'Начинающий специалист',
    MIDDLE: 'Специалист',
    SENIOR: 'Ведущий специалист',
  }

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

  const { id } = useParams()
  const [item, setItem] = useState<VacancyDto | null>(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [commentContent, setCommentContent] = useState('')
  const [commentRating, setCommentRating] = useState(3)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!id) {
      setError('Неверный ID вакансии')
      setLoading(false)
      return
    }
    setError(null)
    VacancyPresenter.getById(Number(id))
      .then(setItem)
      .catch((fetchError) => setError(getErrorMessage(fetchError, 'Не удалось загрузить вакансию')))
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
      setSuccess('Заявка создана.')
    } catch (applyError) {
      setError(getErrorMessage(applyError, 'Не удалось создать заявку'))
    }
  }

  const onCommentSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!id) return
    setError(null)
    setSuccess(null)
    try {
      const newComment = await ApplicantPresenter.createComment({
        vacancyId: Number(id),
        content: commentContent,
        rating: commentRating,
      })
      setCommentContent('')
      setCommentRating(3)
      setSuccess('Комментарий отправлен.')
      // Update the comments list
      setItem(prev => prev ? {
        ...prev,
        comments: prev.comments ? [...prev.comments, newComment] : [newComment]
      } : null)
    } catch (commentError) {
      setError(getErrorMessage(commentError, 'Не удалось отправить комментарий'))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="text-center">
          <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
            Детали вакансии
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
                  {employmentTypeLabels[item.employmentType as keyof typeof employmentTypeLabels] || item.employmentType}
                </span>
                <span className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800">
                  {workFormatLabels[item.workFormat as keyof typeof workFormatLabels] || item.workFormat}
                </span>
                <span className="inline-flex items-center rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-800">
                  {experienceLevelLabels[item.experienceLevel as keyof typeof experienceLevelLabels] || item.experienceLevel}
                </span>
              </div>
              <div className="mb-6 rounded-lg bg-indigo-50 p-4">
                <p className="text-2xl font-semibold text-indigo-600">
                  💰 ₽{item.salaryMin} - ₽{item.salaryMax}
                </p>
              </div>
              <div className="mb-6 space-y-4">
                <h3 className="text-xl font-semibold text-slate-900">📝 Описание</h3>
                <p className="whitespace-pre-line text-slate-700 leading-relaxed">{item.description}</p>
              </div>
              <div className="mb-6 space-y-4">
                <h3 className="text-xl font-semibold text-slate-900">✅ Требования</h3>
                <p className="whitespace-pre-line text-slate-700 leading-relaxed">{item.requirements}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-slate-600">
                  👨‍💼 Рекрутер: <span className="font-medium">{item.recruiterName}</span> ({item.recruiterEmail})
                </p>
              </div>
            </div>
            {item.comments && item.comments.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
                <h3 className="mb-6 text-2xl font-bold text-slate-900">💬 Комментарии</h3>
                <div className="space-y-4">
                  {item.comments.map((comment) => (
                    <div key={comment.id} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-slate-900">{comment.applicantName}</span>
                          <span className="text-sm text-slate-500">({comment.applicantEmail})</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: comment.rating }, (_, i) => (
                            <span key={i} className="text-yellow-400">⭐</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-700">{comment.content}</p>
                      <p className="mt-2 text-xs text-slate-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                <h3 className="mb-4 text-xl font-semibold text-slate-900">🚀 Подать заявку на эту вакансию</h3>
                <form onSubmit={onApply} className="space-y-4">
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-400">📄</span>
                    <textarea
                      className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      placeholder="Напишите сопроводительное письмо..."
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
                    Отправить заявку
                  </button>
                </form>
              </div>
            )}
            {user?.role === 'ROLE_APPLICANT' && (
              <div className="rounded-2xl border border-purple-200 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
                <h3 className="mb-4 text-xl font-semibold text-slate-900">💬 Оставить комментарий</h3>
                <form onSubmit={onCommentSubmit} className="space-y-4">
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-400">📝</span>
                    <textarea
                      className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 shadow-sm transition-all duration-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                      placeholder="Поделитесь своими мыслями о вакансии..."
                      rows={4}
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-slate-700">Рейтинг:</label>
                    <select
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 shadow-sm transition-all duration-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                      value={commentRating}
                      onChange={(e) => setCommentRating(Number(e.target.value))}
                    >
                      <option value={1}>⭐</option>
                      <option value={2}>⭐⭐</option>
                      <option value={3}>⭐⭐⭐</option>
                      <option value={4}>⭐⭐⭐⭐</option>
                      <option value={5}>⭐⭐⭐⭐⭐</option>
                    </select>
                  </div>
                  <button
                    className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-pink-700 hover:shadow-xl"
                    type="submit"
                  >
                    Отправить комментарий
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
