import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Planner from './pages/Planner'
import { AuthProvider, useAuth } from './auth/AuthContext'

function PrivateRoute({ children }: { children: JSX.Element }) {
	const { token } = useAuth()
	return token ? children : <Navigate to="/login" replace />
}

export default function App() {
	return (
		<AuthProvider>
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
				<Route path="/planner" element={
					<PrivateRoute>
						<Planner />
					</PrivateRoute>
				} />
			</Routes>
		</AuthProvider>
	)
}


