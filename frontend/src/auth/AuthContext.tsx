import React, { createContext, useContext, useEffect, useState } from 'react'

type AuthContextType = {
	token: string | null
	login: (token: string) => void
	logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [token, setToken] = useState<string | null>(null)

	useEffect(() => {
		const saved = localStorage.getItem('token')
		if (saved) setToken(saved)
	}, [])

	function login(newToken: string) {
		setToken(newToken)
		localStorage.setItem('token', newToken)
	}

	function logout() {
		setToken(null)
		localStorage.removeItem('token')
	}

	return (
		<AuthContext.Provider value={{ token, login, logout }}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return ctx
}





