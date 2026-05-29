import { http } from './http'
import type { PageResponse, RecruiterDto, CompanyDto } from '../types/api'

export const adminApi = {
  async getPendingRecruiters(page = 0, size = 10) {
    const { data } = await http.get<PageResponse<RecruiterDto>>(
      '/api/admin/recruiters/pending',
      {
        params: { page, size },
      },
    )
    return data
  },
  async getPendingCompanies(page = 0, size = 10) {
    const { data } = await http.get<PageResponse<CompanyDto>>(
      '/api/admin/companies/pending',
      {
        params: { page, size },
      },
    )
    return data
  },
  async verifyRecruiter(id: number, verified = true) {
    const { data } = await http.post('/api/admin/recruiters/verify', {
      id,
      verify: verified,
    })
    return data
  },
  async verifyCompany(id: number, verified = true) {
    const { data } = await http.post('/api/admin/companies/verify', {
      id,
      verify: verified,
    })
    return data
  },
}
