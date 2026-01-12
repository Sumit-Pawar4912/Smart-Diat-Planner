import { useState } from 'react'
import { login } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [remember, setRemember] = useState(false)
	const [msg, setMsg] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const { login: setToken } = useAuth()
	const navigate = useNavigate()

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault()
		setMsg(null)
		try {
			setLoading(true)
			const res = await login(email, password)
			setToken(res.data.access_token)
			if (remember) {
				// token already persisted by context; keeping flag for UX parity
			}
			navigate('/planner')
		} catch (err: any) {
			setMsg(err?.response?.data?.detail || 'Login failed')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="auth">
			<h1 className="auth-title">Sign in to your account</h1>
			<p className="auth-sub">Don't have an account? <Link to="/register" className="inline-link">Sign up here</Link></p>

			<form onSubmit={onSubmit} className="auth-card">
				<label>Email Address
					<input className="input" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
				</label>
				<label>Password
					<input className="input" type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
				</label>

				<div className="auth-row">
					<label className="checkbox"><input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} /> Remember me</label>
					<a className="link-muted" href="#">Forgot your password?</a>
				</div>

				<button type="submit" className="btn btn-primary btn-wide" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
				{msg && <p className="message" role="alert">{msg}</p>}
			</form>
		</div>
	)
}
