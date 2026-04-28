import { applicantApi } from '../api/applicantApi'
import type { ResponseCreateRequest, UpdateProfileRequest } from '../types/api'

export const ApplicantPresenter = {
  getProfile() {
    return applicantApi.getProfile()
  },
  updateProfile(payload: UpdateProfileRequest) {
    return applicantApi.updateProfile(payload)
  },
  uploadResume(file: File) {
    return applicantApi.uploadResume(file)
  },
  createResponse(payload: ResponseCreateRequest) {
    return applicantApi.createResponse(payload)
  },
}
