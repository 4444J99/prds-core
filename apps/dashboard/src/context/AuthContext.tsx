import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@prds/types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('prds_token')
    if (token) {
      // In production, validate token with API
      setUser({
        id: '1',
        email: 'broker@example.com',
        name: 'Broker User',
        tier: 'professional',
        organizationId: 'org_1'
      })
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // In production, call API
    const mockUser: User = {
      id: '1',
      email,
      name: 'Broker User',
      tier: 'professional',
      organizationId: 'org_1'
    }
    localStorage.setItem('prds_token', 'mock_jwt_token')
    setUser(mockUser)
  }

  const logout = () => {
    localStorage.removeItem('prds_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}