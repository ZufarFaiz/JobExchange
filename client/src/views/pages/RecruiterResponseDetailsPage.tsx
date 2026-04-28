import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChatPresenter } from '../../presenters/ChatPresenter'
import { RecruiterPresenter } from '../../presenters/RecruiterPresenter'
import type { ResponseDto, ShortResponseDto } from '../../types/api'
import { ErrorBanner } from '../components/ErrorBanner'
import { Loader } from '../components/Loader'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../../utils/app'

const statusOptions: ShortResponseDto['status'][] = ['REVIEWED', 'APPROVED', 'REJECTED']

export function RecruiterResponseDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [item, setItem] = useState<ResponseDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [resumeLoading, setResumeLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const load = async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await RecruiterPresenter.getResponseById(Number(id))
      setItem(data)
    } catch (loadError) {
      setError(getErrorMessage(loadError, 'Failed to load response'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!id) {
      setError('Invalid response id')
      setLoading(false)
      return
    }
    load()
  }, [id])

  const onChangeStatus = async (status: ShortResponseDto['status']) => {
    if (!id) return
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      await RecruiterPresenter.updateResponseStatus(Number(id), { status })
      await load()
      setSuccess('Status updated.')
    } catch (saveError) {
      setError(getErrorMessage(saveError, 'Failed to update status'))
    } finally {
      setSaving(false)
    }
  }

  const onResumeAction = async (download: boolean) => {
    if (!id) return
    setResumeLoading(true)
    setError(null)
    try {
      const { blob } = await RecruiterPresenter.getResume(Number(id), download)
      const url = URL.createObjectURL(blob)
      if (download) {
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = `resume-response-${id}`
        document.body.append(anchor)
        anchor.click()
        anchor.remove()
      } else {
        window.open(url, '_blank', 'noopener,noreferrer')
      }
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (resumeError) {
      setError(getErrorMessage(resumeError, 'Failed to open resume'))
    } finally {
      setResumeLoading(false)
    }
  }

  const onOpenChat = async () => {
    if (!item || !user?.email) return
    setError(null)
    try {
      await ChatPresenter.createChat({
        responseId: item.id,
        applicantEmail: item.applicantEmail,
        recruiterEmail: user.email,
      })
      navigate('/chats')
    } catch (chatError) {
      setError(getErrorMessage(chatError, 'Failed to open chat'))
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Response Details</h1>
        <Link to="/recruiter/responses" className="text-sm text-slate-600 hover:text-slate-900">
          Back to responses
        </Link>
      </div>
      {loading && <Loader />}
      {error && <ErrorBanner message={error} />}
      {success && <div className="rounded border border-emerald-200 bg-emerald-50 p-3 text-emerald-700">{success}</div>}
      {item && (
        <div className="space-y-4 rounded border bg-white p-4">
          <div className="grid gap-2 md:grid-cols-2">
            <p><span className="font-medium">Response ID:</span> {item.id}</p>
            <p><span className="font-medium">Status:</span> {item.status}</p>
            <p><span className="font-medium">Applicant:</span> {item.applicantName}</p>
            <p><span className="font-medium">Email:</span> {item.applicantEmail}</p>
            <p><span className="font-medium">Vacancy:</span> {item.vacancyTitle}</p>
            <p><span className="font-medium">Company:</span> {item.companyTitle}</p>
            <p><span className="font-medium">Created:</span> {new Date(item.createdAt).toLocaleString()}</p>
            <p>
              <span className="font-medium">Viewed:</span>{' '}
              {item.viewedAt ? new Date(item.viewedAt).toLocaleString() : 'Not viewed yet'}
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold">Cover Letter</h2>
            <p className="whitespace-pre-line rounded bg-slate-50 p-3 text-sm">
              {item.coverLetter || 'No cover letter provided.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <button
                key={status}
                type="button"
                disabled={saving || item.status === status}
                onClick={() => onChangeStatus(status)}
                className="rounded bg-slate-900 px-3 py-2 text-white disabled:opacity-50"
              >
                Mark as {status}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onOpenChat}
              className="rounded bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700"
            >
              Open Chat
            </button>
            <button
              type="button"
              onClick={() => onResumeAction(false)}
              disabled={resumeLoading}
              className="rounded bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-700"
            >
              View Resume
            </button>
            <button
              type="button"
              onClick={() => onResumeAction(true)}
              disabled={resumeLoading}
              className="rounded bg-slate-700 px-3 py-2 text-white hover:bg-slate-800"
            >
              Download Resume
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
