import { vacancyApi } from '../api/vacancyApi'
import type { VacancyFilterRequest } from '../types/api'

export const VacancyPresenter = {
  getList(page?: number, size?: number) {
    return vacancyApi.getVacancies(page, size)
  },
  getFilteredList(filters: VacancyFilterRequest, page?: number, size?: number) {
    return vacancyApi.getVacanciesWithFilters(filters, page, size)
  },
  getById(id: number) {
    return vacancyApi.getVacancyById(id)
  },
}
