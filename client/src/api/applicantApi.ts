import { http } from './http'
import type {
  ApplicantProfileDto,
  ResponseCreateRequest,
  UpdateProfileRequest,
  CommentCreateRequest,
  CommentDto,
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
  async viewResume() {
    const response = await http.get('/api/applicant/resume', {
      responseType: 'blob',
    })
    return response.data
  },
  async deleteResume() {
    const { data } = await http.delete<ApplicantProfileDto>('/api/applicant/resume')
    return data
  },
  async createResponse(payload: ResponseCreateRequest) {
    const { data } = await http.post('/api/applicant/responses', payload)
    return data
  },
  async createComment(payload: CommentCreateRequest) {
    const { data } = await http.post<CommentDto>('/api/applicant/comments', payload)
    return data
  },
}
