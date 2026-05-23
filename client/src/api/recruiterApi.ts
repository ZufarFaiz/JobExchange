import { http } from './http'
import type {
  PageResponse,
  RecruiterProfileDto,
  ResponseDto,
  ResponseStatusUpdateRequest,
  ShortResponseDto,
  UpdateProfileRequest,
  VacancyCreateRequest,
  VacancyDto,
} from '../types/api'

export const recruiterApi = {
  async getProfile() {
    const { data } = await http.get<RecruiterProfileDto>('/api/recruiter/profile')
    return data
  },
  async updateProfile(payload: UpdateProfileRequest) {
    const { data } = await http.put<RecruiterProfileDto>(
      '/api/recruiter/profile',
      payload,
    )
    return data
  },
  async createVacancy(payload: VacancyCreateRequest) {
    const { data } = await http.post<VacancyDto>('/api/recruiter/add-vacancy', payload)
    return data
  },
  async getResponses(page = 0, size = 10) {
    const { data } = await http.get<PageResponse<ShortResponseDto>>('/api/recruiter/responses', {
      params: { page, size, sort: 'id,desc' },
    })
    return data
  },
  async updateResponseStatus(responseId: number, payload: ResponseStatusUpdateRequest) {
    const { data } = await http.put(`/api/recruiter/responses/${responseId}/status`, payload)
    return data
  },
  async getResponseById(responseId: number) {
    const { data } = await http.get<ResponseDto>(`/api/recruiter/responses/${responseId}`)
    return data
  },
  async getResume(responseId: number, download = false) {
    const endpoint = download
      ? `/api/recruiter/responses/${responseId}/resume/download`
      : `/api/recruiter/responses/${responseId}/resume`
    const { data, headers } = await http.get<Blob>(endpoint, { responseType: 'blob' })
    return { blob: data, contentType: headers['content-type'] as string | undefined }
  },
}
