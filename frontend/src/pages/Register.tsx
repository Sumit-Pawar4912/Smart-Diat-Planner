import { useState } from 'react'
import { Link } from 'react-router-dom'
import { register } from '../api/client'

export default function Register() {
	const [fullName, setFullName] = useState('')
	const [email, setEmail] = useState('')
	const [phone, setPhone] = useState('')
	const [password, setPassword] = useState('')
	const [confirm, setConfirm] = useState('')
	const [msg, setMsg] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault()
		setMsg(null)
		if (password.length < 6) {
			setMsg('Password must be at least 6 characters')
			return
		}
		if (password !== confirm) {
			setMsg('Passwords do not match')
			return
		}
		try {
			setLoading(true)
			await register(email, password)
			setMsg('Registered successfully. You can login now.')
			setPassword('')
			setConfirm('')
		} catch (err: any) {
			setMsg(err?.response?.data?.detail || 'Registration failed')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="auth">
			{/* <div className="auth-brand">A</div> */}
			<h1 className="auth-title">Create your account</h1>
			<p className="auth-sub">Already have an account? <Link to="/login" className="inline-link">Sign in here</Link></p>

			<form onSubmit={onSubmit} className="auth-card">
				<label>Full Name
					<input className="input" type="text" placeholder="Enter your full name" value={fullName} onChange={e => setFullName(e.target.value)} />
				</label>
				<label>Email Address
					<input className="input" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
				</label>
				<label>Phone Number
					<input className="input" type="tel" placeholder="Enter your 10-digit phone number" value={phone} onChange={e => setPhone(e.target.value)} />
				</label>
				<label>Password
					<input className="input" type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
				</label>
				<label>Confirm Password
					<input className="input" type="password" placeholder="Confirm your password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
				</label>

				<button type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</button>
				{msg && <p className="message" role="alert">{msg}</p>}
			</form>
		</div>
	)
}
