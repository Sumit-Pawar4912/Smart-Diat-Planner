import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useState, useEffect } from 'react'

export default function Navbar() {
	const { token, logout } = useAuth()
	const navigate = useNavigate()
	const location = useLocation()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isScrolled, setIsScrolled] = useState(false)

	// Handle scroll effect
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20)
		}
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	// Close mobile menu when route changes
	useEffect(() => {
		setIsMenuOpen(false)
	}, [location])

	const handleLogout = () => {
		logout()
		navigate('/')
		setIsMenuOpen(false)
	}

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	const isActiveLink = (path: string) => {
		return location.pathname === path
	}

	return (
		<nav className={`nav ${isScrolled ? 'nav-scrolled' : ''}`}>
			<div className="nav-container">
				<div className="nav-brand">
					<Link to="/" className="brand-link">
						<div className="brand-icon">🥗</div>
						<span className="brand-text">Smart Diet Planner</span>
					</Link>
				</div>

				{/* Desktop Navigation */}
				<div className="nav-links desktop-only">
					<Link 
						to="/" 
						className={`nav-link ${isActiveLink('/') ? 'active' : ''}`}
					>
						Home
					</Link>
					<Link 
						to="/planner" 
						className={`nav-link ${isActiveLink('/planner') ? 'active' : ''}`}
					>
						🎯 Planner
					</Link>
					{token ? (
						<div className="nav-user">
							<span className="user-indicator">👤</span>
							<button onClick={handleLogout} className="nav-button logout-btn">
								Logout
							</button>
						</div>
					) : (
						<div className="nav-auth">
							<Link 
								to="/login" 
								className={`nav-link ${isActiveLink('/login') ? 'active' : ''}`}
							>
								Sign In
							</Link>
							<Link 
								to="/register" 
								className="nav-button primary"
							>
								Get Started
							</Link>
						</div>
					)}
				</div>

				{/* Mobile Menu Button */}
				<button 
					className={`mobile-menu-btn ${isMenuOpen ? 'active' : ''}`}
					onClick={toggleMenu}
					aria-label="Toggle menu"
				>
					<span className="hamburger-line"></span>
					<span className="hamburger-line"></span>
					<span className="hamburger-line"></span>
				</button>
			</div>

			{/* Mobile Navigation */}
			<div className={`mobile-nav ${isMenuOpen ? 'active' : ''}`}>
				<div className="mobile-nav-content">
					<Link 
						to="/" 
						className={`mobile-nav-link ${isActiveLink('/') ? 'active' : ''}`}
					>
						<span className="mobile-link-icon">🏠</span>
						Home
					</Link>
					<Link 
						to="/planner" 
						className={`mobile-nav-link ${isActiveLink('/planner') ? 'active' : ''}`}
					>
						<span className="mobile-link-icon">🎯</span>
						Planner
					</Link>
					{token ? (
						<button onClick={handleLogout} className="mobile-nav-button logout">
							<span className="mobile-link-icon">🚪</span>
							Logout
						</button>
					) : (
						<>
							<Link 
								to="/login" 
								className={`mobile-nav-link ${isActiveLink('/login') ? 'active' : ''}`}
							>
								<span className="mobile-link-icon">🔑</span>
								Sign In
							</Link>
							<Link 
								to="/register" 
								className="mobile-nav-button primary"
							>
								<span className="mobile-link-icon">✨</span>
								Get Started
							</Link>
						</>
					)}
				</div>
			</div>

			{/* Mobile Menu Overlay */}
			{isMenuOpen && (
				<div 
					className="mobile-overlay" 
					onClick={() => setIsMenuOpen(false)}
				></div>
			)}
		</nav>
	)
}
