import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Home() {
	const { token } = useAuth()
	return (
		<div>
			<section className="hero hero-img">
				<div className="hero-inner hero-grid">
					<div className="hero-copy">
						<div className="hero-badge">🥗 Smart Diet Planner</div>
						<h1 className="hero-title">Transform your health with <span>intelligent meal planning</span></h1>
						<p className="hero-sub">Discover personalized nutrition that fits your lifestyle. Enter your details and get scientifically-backed meal plans tailored to your goals, preferences, and dietary needs - all in seconds.</p>
						<div className="hero-features-mini">
							<div className="mini-feature">✨ Personalized Plans</div>
							<div className="mini-feature">🎯 Calorie Precision</div>
							<div className="mini-feature">⚡ Instant Results</div>
						</div>
						<div className="hero-ctas">
							{token ? (
								<>
									<Link to="/planner" className="btn btn-primary">🎯 Create Your Meal Plan</Link>
									<span className="hero-welcome">Welcome back! Ready to plan your next meal?</span>
								</>
							) : (
								<>
									<Link to="/register" className="btn btn-primary">Start Your Journey Free</Link>
									<Link to="/login" className="btn btn-ghost">Sign In</Link>
									<p className="auth-notice">
										<span className="lock-icon">🔒</span>
										Create an account to access the personalized meal planner
									</p>
								</>
							)}
						</div>
					</div>
					<div className="hero-art">
						<img src="/diet-illustration.svg" alt="Healthy diet illustration" />
						{/* You can replace the above with /diet-illustration.png if you add a PNG */}
					</div>
				</div>
			</section>

			<section className="container section">
				<h2 className="section-title">Everything you need for smart nutrition</h2>
				<p className="section-sub">Simple inputs, clear plans, and actionable meals. Stay within your calories while eating what you love.</p>
				<div className="cards three">
					<div className="card">
						<h4>Personalized</h4>
						<p>Plans adapt to your calories, age, weight and food type.</p>
					</div>
					<div className="card">
						<h4>Balanced</h4>
						<p>Breakfast, lunch, dinner with a clear total calorie count.</p>
					</div>
					<div className="card">
						<h4>Fast</h4>
						<p>Generate plans instantly and tweak until it feels right.</p>
					</div>
				</div>
			</section>

			{/* Project Information Section - Full Width */}
			<section className="project-info">
				<div className="container">
					<div className="project-content-full">
						<h2 className="project-title">About Smart Diet Planner</h2>
						<p className="project-description">
							Smart Diet Planner is an intelligent meal planning application that helps you maintain a healthy lifestyle 
							by generating personalized meal plans based on your individual requirements. Whether you're looking to lose weight, 
							gain muscle, or simply eat healthier, our platform provides scientifically-backed nutrition guidance using 
							authentic Indian cuisine and advanced optimization algorithms.
						</p>
						<div className="project-features-grid">
							<div className="feature-item">
								<div className="feature-icon">🎯</div>
								<div>
									<h4>Precision Planning</h4>
									<p>Get exact calorie breakdowns for breakfast, lunch, and dinner tailored to your goals using advanced knapsack algorithms.</p>
								</div>
							</div>
							<div className="feature-item">
								<div className="feature-icon">🥗</div>
								<div>
									<h4>Dietary Preferences</h4>
									<p>Support for both vegetarian and non-vegetarian meal preferences with over 1000 authentic Indian dishes.</p>
								</div>
							</div>
							<div className="feature-item">
								<div className="feature-icon">⚡</div>
								<div>
									<h4>Instant Results</h4>
									<p>Generate comprehensive meal plans in seconds with detailed nutritional analysis and macro breakdowns.</p>
								</div>
							</div>
							<div className="feature-item">
								<div className="feature-icon">🧮</div>
								<div>
									<h4>Smart Algorithm</h4>
									<p>Uses knapsack optimization to find the perfect combination of foods that meet your caloric and nutritional needs.</p>
								</div>
							</div>
							<div className="feature-item">
								<div className="feature-icon">📊</div>
								<div>
									<h4>Nutritional Analysis</h4>
									<p>Complete breakdown of proteins, carbs, fats, vitamins, and minerals with visual progress tracking.</p>
								</div>
							</div>
							<div className="feature-item">
								<div className="feature-icon">🍛</div>
								<div>
									<h4>Authentic Indian Cuisine</h4>
									<p>Meal plans feature real Indian dishes with comprehensive nutritional data from our extensive food database.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Statistics Section */}
			<section className="stats-section">
				<div className="container">
					<h2 className="section-title">Why Choose Smart Diet Planner?</h2>
					<div className="stats-grid">
						<div className="stat-item">
							<div className="stat-number">1000+</div>
							<div className="stat-label">Meal Combinations</div>
						</div>
						<div className="stat-item">
							<div className="stat-number">24/7</div>
							<div className="stat-label">Available Access</div>
						</div>
						<div className="stat-item">
							<div className="stat-number">100%</div>
							<div className="stat-label">Personalized Plans</div>
						</div>
						<div className="stat-item">
							<div className="stat-number">Free</div>
							<div className="stat-label">To Get Started</div>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="footer">
				<div className="container">
					<div className="footer-content">
						<div className="footer-section">
							<div className="footer-brand">
								<h3>Smart Diet Planner</h3>
								<p>Empowering your health journey with intelligent meal planning and personalized nutrition guidance.</p>
							</div>
						</div>
						<div className="footer-section">
							<h4>Features</h4>
							<ul className="footer-links">
								<li><Link to="/register">Personalized Plans</Link></li>
								<li><Link to="/register">Calorie Tracking</Link></li>
								<li><Link to="/register">Meal Variety</Link></li>
								<li><Link to="/register">Instant Generation</Link></li>
							</ul>
						</div>
						<div className="footer-section">
							<h4>Get Started</h4>
							<ul className="footer-links">
								<li><Link to="/register">Create Account</Link></li>
								<li><Link to="/login">Sign In</Link></li>
								<li><Link to="/planner">Meal Planner</Link></li>
							</ul>
						</div>
					</div>
					<div className="footer-bottom">
						<div className="footer-bottom-content">
						<p>&copy;  Smart Diet Planner. Built with ❤️ for healthier living.</p>
							<div className="footer-social">
								<span>Made with React, FastAPI & Modern Web Technologies</span>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</div>
	)
}
