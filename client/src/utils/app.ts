import axios from 'axios'
import type { Role } from '../types/api'

export function getRoleHomePath(role: Role): string {
  if (role === 'ROLE_APPLICANT') return '/applicant'
  if (role === 'ROLE_RECRUITER') return '/recruiter'
  if (role === 'ROLE_ADMIN') return '/admin'
  return '/vacancies'
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) return fallback
  const message = error.response?.data?.message
  if (typeof message === 'string' && message.trim()) {
    return message
  }
  return fallback
}
