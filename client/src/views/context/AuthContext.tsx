import { createContext, useContext, useMemo, useState } from 'react'
import { AuthPresenter, type AuthUser } from '../../presenters/AuthPresenter'

interface AuthContextValue {
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(AuthPresenter.getCurrentUser())

  const value = useMemo(
    () => ({
      user,
      setUser,
      logout: () => {
        AuthPresenter.logout()
        setUser(null)
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
