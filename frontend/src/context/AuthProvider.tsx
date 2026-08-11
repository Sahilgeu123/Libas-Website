import { useState } from 'react'
import { AuthContext} from './AuthContext'
import type {  UserData,  AuthProviderProps } from '../types/auth'

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserData | null>(null)

  const login = (userData: UserData) => {
    setUser(userData)
    localStorage.setItem('userInfo', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('userInfo')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
