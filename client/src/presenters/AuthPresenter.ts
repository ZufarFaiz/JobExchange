import { authApi } from '../api/authApi'
import { tokenStorage } from '../api/http'
import type {
  ApplicantRegisterRequest,
  AuthResponse,
  LoginRequest,
  RecruiterRegisterRequest,
  Role,
} from '../types/api'

const USER_KEY = 'jobexchange_user'

export interface AuthUser {
  email: string
  role: Role
}

export const AuthPresenter = {
  async login(payload: LoginRequest) {
    const auth = await authApi.login(payload)
    this.persist(auth)
    return this.getCurrentUser()
  },
  async registerApplicant(payload: ApplicantRegisterRequest) {
    const auth = await authApi.registerApplicant(payload)
    this.persist(auth)
    return this.getCurrentUser()
  },
  async registerRecruiter(payload: RecruiterRegisterRequest) {
    const auth = await authApi.registerRecruiter(payload)
    this.persist(auth)
    return this.getCurrentUser()
  },
  logout() {
    authApi.logout()
    localStorage.removeItem(USER_KEY)
  },
  getCurrentUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw || !tokenStorage.get()) {
      return null
    }
    try {
      return JSON.parse(raw) as AuthUser
    } catch {
      return null
    }
  },
  persist(auth: AuthResponse) {
    const user: AuthUser = {
      email: auth.email,
      role: auth.role,
    }
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },
}
