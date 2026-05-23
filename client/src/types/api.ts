export type Role = 'ROLE_APPLICANT' | 'ROLE_RECRUITER' | 'ROLE_ADMIN'

export interface AuthResponse {
  firstName?: string
  fistName?: string
  lastName?: string
  email: string
  accessToken?: string | null
  refreshToken?: string | null
  role: Role
}

export interface LoginRequest {
  email: string
  password: string
}

export interface ApplicantRegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber: string
}

export interface RecruiterRegisterRequest extends ApplicantRegisterRequest {
  companyTaxId: string
  companyTitle: string
  companyLocation: string
  companyDescription: string
}

export interface PageResponse<T> {
  content: T[]
  number: number
  size: number
  totalElements: number
  totalPages: number
}

export interface ShortVacancyDto {
  id: number
  title: string
  location: string
  salaryMin: number
  salaryMax: number
  experienceLevel: string
  employmentType: string
  workFormat: string
  companyTitle: string
}

export interface VacancyDto extends ShortVacancyDto {
  description: string
  requirements: string
  isActive: boolean
  companyLocation: string
  recruiterName: string
  recruiterEmail: string
  comments?: CommentDto[]
}

export interface ApplicantProfileDto {
  id: number
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  avatarUrl?: string
  resumeUrl?: string
  totalResponses: number
}

export interface RecruiterProfileDto {
  id: number
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  isVerified: boolean
  companyId: number
  companyTitle: string
  companyLocation: string
  companyVerified: boolean
  totalVacancies: number
  activeVacancies: number
}

export interface UpdateProfileRequest {
  email?: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  avatarUrl?: string
}

export interface VacancyCreateRequest {
  title: string
  description: string
  location: string
  salaryMin: number
  salaryMax: number
  requirements: string
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'PROJECT' | 'INTERNSHIP'
  workFormat: 'OFFICE' | 'REMOTE' | 'HYBRID'
  experienceLevel: 'NO_EXPERIENCE' | 'JUNIOR' | 'MIDDLE' | 'SENIOR'
}

export interface VacancyFilterRequest {
  title?: string
  location?: string
  salaryMin?: number
  salaryMax?: number
  employmentType?: 'FULL_TIME' | 'PART_TIME' | 'PROJECT' | 'INTERNSHIP'
  workFormat?: 'OFFICE' | 'REMOTE' | 'HYBRID'
  experienceLevel?: 'NO_EXPERIENCE' | 'JUNIOR' | 'MIDDLE' | 'SENIOR'
}

export interface ResponseCreateRequest {
  vacancyId: number
  coverLetter: string
}

export interface ShortResponseDto {
  id: number
  status: 'PENDING' | 'REVIEWED' | 'APPROVED' | 'REJECTED'
  createdAt: string
  vacancyId: number
  vacancyTitle: string
  applicantId: number
  applicantName: string
}

export interface ResponseStatusUpdateRequest {
  status: ShortResponseDto['status']
}

export interface ResponseDto {
  id: number
  status: ShortResponseDto['status']
  coverLetter: string
  createdAt: string
  viewedAt?: string | null
  vacancyId: number
  vacancyTitle: string
  vacancyLocation: string
  vacancySalaryMin: number
  vacancySalaryMax: number
  companyId: number
  companyTitle: string
  applicantId: number
  applicantName: string
  applicantEmail: string
  applicantResumeUrl?: string | null
}

export interface RecruiterDto {
  id: number
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  companyTitle: string
  isVerified: boolean
}

export interface CompanyDto {
  id: number
  title: string
  description: string
  taxId: string
  location: string
  isVerified: boolean
}

export interface ChatMessageDto {
  id: number
  content: string
  senderEmail: string
  senderRole?: string
  isRead?: boolean
  createdAt: string
}

export interface ChatDto {
  id: number
  responseId: number
  applicantEmail: string
  recruiterEmail: string
  otherPartyEmail?: string
  otherPartyRole?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  lastMessage?: ChatMessageDto | null
  unreadCount?: number
}

export interface CreateChatRequest {
  responseId: number
  applicantEmail: string
  recruiterEmail: string
}

export interface CommentCreateRequest {
  content: string
  rating: number
  vacancyId: number
}

export interface CommentDto {
  id: number
  content: string
  rating: number
  isVerified: boolean
  isEdited: boolean
  createdAt: string
  updatedAt: string
  applicantId: number
  applicantName: string
  applicantEmail: string
  vacancyId: number
  vacancyTitle: string
  companyName: string
}
