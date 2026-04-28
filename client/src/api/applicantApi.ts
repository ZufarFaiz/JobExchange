import { http } from './http'
import type {
  ApplicantProfileDto,
  ResponseCreateRequest,
  UpdateProfileRequest,
} from '../types/api'

export const applicantApi = {
  async getProfile() {
    const { data } = await http.get<ApplicantProfileDto>('/api/applicant/profile')
    return data
  },
  async updateProfile(payload: UpdateProfileRequest) {
    const { data } = await http.put<ApplicantProfileDto>(
      '/api/applicant/profile',
      payload,
    )
    return data
  },
  async uploadResume(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await http.post<ApplicantProfileDto>(
      '/api/applicant/resume',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    )
    return data
  },
  async createResponse(payload: ResponseCreateRequest) {
    const { data } = await http.post('/api/applicant/responses', payload)
    return data
  },
}
