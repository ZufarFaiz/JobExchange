import { http } from './http'
import type { PageResponse, RecruiterDto } from '../types/api'

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
  async verifyRecruiter(id: number, verified = true) {
    const { data } = await http.post('/api/admin/recruiters/verify', {
      id,
      verify: verified,
    })
    return data
  },
}
