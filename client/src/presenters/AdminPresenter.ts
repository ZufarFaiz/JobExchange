import { adminApi } from '../api/adminApi'

export const AdminPresenter = {
  getPendingRecruiters(page?: number, size?: number) {
    return adminApi.getPendingRecruiters(page, size)
  },
  verifyRecruiter(id: number) {
    return adminApi.verifyRecruiter(id, true)
  },
}
