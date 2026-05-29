import { http, tokenStorage } from './http'
import type {
  ApplicantRegisterRequest,
  AuthResponse,
  LoginRequest,
  RecruiterRegisterRequest,
} from '../types/api'

export const authApi = {
  async login(payload: LoginRequest) {
    const { data } = await http.post<AuthResponse>('/api/auth/login', payload)
    if (data.accessToken) {
      tokenStorage.set(data.accessToken)
    }
    return data
  },
  async registerApplicant(payload: ApplicantRegisterRequest) {
    const { data } = await http.post<AuthResponse>(
      '/api/auth/register/applicant',
      payload,
    )
    if (data.accessToken) {
      tokenStorage.set(data.accessToken)
    }
    return data
  },
  async registerRecruiter(payload: RecruiterRegisterRequest) {
    const { data } = await http.post<AuthResponse>(
      '/api/auth/register/recruiter',
      payload,
    )
    if (data.accessToken) {
      tokenStorage.set(data.accessToken)
    }
    return data
  },
  logout() {
    tokenStorage.clear()
  },
}
