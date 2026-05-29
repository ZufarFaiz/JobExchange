import { applicantApi } from '../api/applicantApi'
import type { ResponseCreateRequest, UpdateProfileRequest, CommentCreateRequest } from '../types/api'

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
  viewResume() {
    return applicantApi.viewResume()
  },
  deleteResume() {
    return applicantApi.deleteResume()
  },
  createResponse(payload: ResponseCreateRequest) {
    return applicantApi.createResponse(payload)
  },
  createComment(payload: CommentCreateRequest) {
    return applicantApi.createComment(payload)
  },
}
