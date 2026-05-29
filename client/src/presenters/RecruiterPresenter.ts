import { recruiterApi } from '../api/recruiterApi'
import type {
  ResponseStatusUpdateRequest,
  UpdateProfileRequest,
  VacancyCreateRequest,
} from '../types/api'

export const RecruiterPresenter = {
  getProfile() {
    return recruiterApi.getProfile()
  },
  updateProfile(payload: UpdateProfileRequest) {
    return recruiterApi.updateProfile(payload)
  },
  createVacancy(payload: VacancyCreateRequest) {
    return recruiterApi.createVacancy(payload)
  },
  getResponses(page?: number, size?: number) {
    return recruiterApi.getResponses(page, size)
  },
  updateResponseStatus(responseId: number, payload: ResponseStatusUpdateRequest) {
    return recruiterApi.updateResponseStatus(responseId, payload)
  },
  getResponseById(responseId: number) {
    return recruiterApi.getResponseById(responseId)
  },
  getResume(responseId: number, download?: boolean) {
    return recruiterApi.getResume(responseId, download)
  },
}
