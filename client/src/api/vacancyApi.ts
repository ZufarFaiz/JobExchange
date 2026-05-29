import { http } from './http'
import type { PageResponse, ShortVacancyDto, VacancyDto, VacancyFilterRequest } from '../types/api'

export const vacancyApi = {
  async getVacancies(page = 0, size = 10) {
    const { data } = await http.get<PageResponse<ShortVacancyDto>>('/api/vacancies', {
      params: { page, size, sort: 'id,desc' },
    })
    return data
  },
  async getVacanciesWithFilters(filters: VacancyFilterRequest, page = 0, size = 10) {
    const { data } = await http.post<PageResponse<ShortVacancyDto>>('/api/vacancies/filter', filters, {
      params: { page, size, sort: 'createdAt,desc' },
    })
    return data
  },
  async getVacancyById(vacancyId: number) {
    const { data } = await http.get<VacancyDto>(`/api/vacancies/${vacancyId}`)
    return data
  },
}
