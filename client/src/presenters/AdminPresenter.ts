import { adminApi } from '../api/adminApi'

export const AdminPresenter = {
  getPendingRecruiters(page?: number, size?: number) {
    return adminApi.getPendingRecruiters(page, size)
  },
  getPendingCompanies(page?: number, size?: number) {
    return adminApi.getPendingCompanies(page, size)
  },
  verifyRecruiter(id: number) {
    return adminApi.verifyRecruiter(id, true)
  },
  verifyCompany(id: number) {
    return adminApi.verifyCompany(id, true)
  },
}
