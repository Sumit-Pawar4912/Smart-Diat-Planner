import { useState, useEffect } from 'react'
import { generateMeal } from '../api/client'

export default function Planner() {
	const [age, setAge] = useState<number>(25)
	const [weight, setWeight] = useState<number>(70)
	const [height, setHeight] = useState<number>(170)
	const [gender, setGender] = useState<'male' | 'female'>('male')
	const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'>('moderate')
	const [calories, setCalories] = useState<number>(2000)
	const [foodType, setFoodType] = useState<'veg' | 'nonveg'>('veg')
	const [plan, setPlan] = useState<any | null>(null)
	const [msg, setMsg] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [showAdvanced, setShowAdvanced] = useState<boolean>(false)
	const [bmi, setBmi] = useState<number>(0)
	const [bmr, setBmr] = useState<number>(0)
	const [recommendedCalories, setRecommendedCalories] = useState<number>(0)

	// Calculate BMI and BMR when values change
	useEffect(() => {
		if (height > 0 && weight > 0) {
			const heightInM = height / 100
			const calculatedBmi = weight / (heightInM * heightInM)
			setBmi(calculatedBmi)

			// Calculate BMR using Mifflin-St Jeor Equation
			let calculatedBmr: number
			if (gender === 'male') {
				calculatedBmr = 10 * weight + 6.25 * height - 5 * age + 5
			} else {
				calculatedBmr = 10 * weight + 6.25 * height - 5 * age - 161
			}
			setBmr(calculatedBmr)

			// Calculate recommended calories based on activity level
			const activityMultipliers = {
				sedentary: 1.2,
				light: 1.375,
				moderate: 1.55,
				active: 1.725,
				very_active: 1.9
			}
			const recommended = Math.round(calculatedBmr * activityMultipliers[activityLevel])
			setRecommendedCalories(recommended)
		}
	}, [height, weight, age, gender, activityLevel])

	const getBmiCategory = (bmi: number) => {
		if (bmi < 18.5) return { category: 'Underweight', color: '#60a5fa' }
		if (bmi < 25) return { category: 'Normal', color: '#22c55e' }
		if (bmi < 30) return { category: 'Overweight', color: '#f59e0b' }
		return { category: 'Obese', color: '#ef4444' }
	}

	const useRecommendedCalories = () => {
		setCalories(recommendedCalories)
	}

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault()
		setMsg(null)
		setPlan(null)
		setIsLoading(true)
		try {
			const res = await generateMeal({ 
				age, 
				weight_kg: weight, 
				height_cm: height,
				gender,
				activity_level: activityLevel,
				calories_limit: calories, 
				food_type: foodType 
			})
			setPlan(res.data)
		} catch (err: any) {
			setMsg(err?.response?.data?.detail || 'Failed to generate plan')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="container">
			<div className="planner-header">
				<h2>🎯 Smart Meal Planner</h2>
				<p className="planner-subtitle">Create a personalized meal plan based on your goals and preferences</p>
			</div>

			<div className="planner-layout">
				<div className="planner-form-section">
					<form onSubmit={onSubmit} className="planner-form">
						<div className="form-section">
							<h3>📊 Basic Information</h3>
							<div className="form-grid">
								<div className="form-group">
									<label>Age
										<div className="input-with-slider">
											<input 
												type="range" 
												min="18" 
												max="80" 
												value={age} 
												onChange={e => setAge(parseInt(e.target.value))} 
												className="slider"
											/>
											<span className="slider-value">{age} years</span>
										</div>
									</label>
								</div>

								<div className="form-group">
									<label>Weight
										<div className="input-with-slider">
											<input 
												type="range" 
												min="40" 
												max="150" 
												step="0.5" 
												value={weight} 
												onChange={e => setWeight(parseFloat(e.target.value))} 
												className="slider"
											/>
											<span className="slider-value">{weight} kg</span>
										</div>
									</label>
								</div>

								<div className="form-group">
									<label>Height
										<div className="input-with-slider">
											<input 
												type="range" 
												min="140" 
												max="220" 
												value={height} 
												onChange={e => setHeight(parseInt(e.target.value))} 
												className="slider"
											/>
											<span className="slider-value">{height} cm</span>
										</div>
									</label>
								</div>

								<div className="form-group">
									<label>Gender
										<div className="radio-group">
											<label className="radio-option">
												<input 
													type="radio" 
													name="gender" 
													value="male" 
													checked={gender === 'male'} 
													onChange={e => setGender(e.target.value as 'male' | 'female')} 
												/>
												<span>👨 Male</span>
											</label>
											<label className="radio-option">
												<input 
													type="radio" 
													name="gender" 
													value="female" 
													checked={gender === 'female'} 
													onChange={e => setGender(e.target.value as 'male' | 'female')} 
												/>
												<span>👩 Female</span>
											</label>
										</div>
									</label>
								</div>

								<div className="form-group full-width">
									<label>Activity Level
										<select value={activityLevel} onChange={e => setActivityLevel(e.target.value as any)} className="activity-select">
											<option value="sedentary">🛋️ Sedentary (little/no exercise)</option>
											<option value="light">🚶 Light (light exercise 1-3 days/week)</option>
											<option value="moderate">🏃 Moderate (moderate exercise 3-5 days/week)</option>
											<option value="active">💪 Active (hard exercise 6-7 days/week)</option>
											<option value="very_active">🏋️ Very Active (very hard exercise, physical job)</option>
										</select>
									</label>
								</div>
							</div>
						</div>

						<div className="form-section">
							<h3>🍽️ Meal Preferences</h3>
							<div className="form-grid">
								<div className="form-group">
									<label>Daily Calories
										<div className="calories-input-group">
											<div className="input-with-slider">
												<input 
													type="range" 
													min="1200" 
													max="4000" 
													step="50" 
													value={calories} 
													onChange={e => setCalories(parseInt(e.target.value))} 
													className="slider calories-slider"
												/>
												<span className="slider-value">{calories} kcal</span>
											</div>
											{recommendedCalories > 0 && (
												<button 
													type="button" 
													className="use-recommended-btn"
													onClick={useRecommendedCalories}
												>
													💡 Use Recommended ({recommendedCalories} kcal)
												</button>
											)}
										</div>
									</label>
								</div>

								<div className="form-group">
									<label>Food Type
										<div className="food-type-toggle">
											<button 
												type="button" 
												className={`food-type-btn ${foodType === 'veg' ? 'active' : ''}`}
												onClick={() => setFoodType('veg')}
											>
												🥬 Vegetarian
											</button>
											<button 
												type="button" 
												className={`food-type-btn ${foodType === 'nonveg' ? 'active' : ''}`}
												onClick={() => setFoodType('nonveg')}
											>
												🍖 Non-Vegetarian
											</button>
										</div>
									</label>
								</div>
							</div>
						</div>

						<button type="submit" className="generate-btn" disabled={isLoading}>
							{isLoading ? (
								<>
									<span className="loading-spinner"></span>
									Generating...
								</>
							) : (
								<>
									🎯 Generate My Meal Plan
								</>
							)}
						</button>
					</form>
				</div>

				<div className="health-stats-section">
					<div className="health-stats">
						<h3>📈 Health Metrics</h3>
						
						{bmi > 0 && (
							<div className="health-metric">
								<div className="metric-header">
									<span className="metric-label">BMI</span>
									<span className="metric-value" style={{ color: getBmiCategory(bmi).color }}>
										{bmi.toFixed(1)}
									</span>
								</div>
								<div className="metric-category" style={{ color: getBmiCategory(bmi).color }}>
									{getBmiCategory(bmi).category}
								</div>
								<div className="bmi-bar">
									<div className="bmi-indicator" style={{ 
										left: `${Math.min(Math.max((bmi - 15) / 25 * 100, 0), 100)}%`,
										backgroundColor: getBmiCategory(bmi).color
									}}></div>
								</div>
							</div>
						)}

						{bmr > 0 && (
							<div className="health-metric">
								<div className="metric-header">
									<span className="metric-label">BMR</span>
									<span className="metric-value">{Math.round(bmr)} kcal/day</span>
								</div>
								<div className="metric-description">Calories burned at rest</div>
							</div>
						)}

						{recommendedCalories > 0 && (
							<div className="health-metric">
								<div className="metric-header">
									<span className="metric-label">Daily Calories</span>
									<span className="metric-value">{recommendedCalories} kcal/day</span>
								</div>
								<div className="metric-description">Recommended for {activityLevel.replace('_', ' ')} lifestyle</div>
							</div>
						)}

						<div className="health-tips">
							<h4>💡 Quick Tips</h4>
							<ul>
								<li>Aim for 0.8-1.2g protein per kg body weight</li>
								<li>Include 25-35g fiber daily for digestive health</li>
								<li>Stay hydrated with 8-10 glasses of water</li>
								<li>Eat a variety of colorful fruits and vegetables</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			{msg && (
				<div className="error-message">
					<span className="error-icon">⚠️</span>
					{msg}
				</div>
			)}
			{plan && (
				<div className="plan">
					<div className="plan-header">
						<h3>🍽️ Your Personalized Meal Plan</h3>
						<div className="plan-summary">
							<div className="summary-item">
								<span className="summary-label">Total Calories:</span>
								<span className="summary-value">{plan.total_calories} kcal</span>
							</div>
							{plan.daily_targets && (
								<div className="summary-item">
									<span className="summary-label">Target:</span>
									<span className="summary-value">{plan.daily_targets.calories} kcal</span>
								</div>
							)}
							<div className="summary-item">
								<span className="summary-label">Calories Remaining:</span>
								<span className="summary-value" style={{ 
									color: calories - plan.total_calories > 0 ? 'var(--primary)' : '#f59e0b' 
								}}>
									{calories - plan.total_calories} kcal
								</span>
							</div>
						</div>
						
						<div className="plan-actions">
							<button className="plan-action-btn save-btn" onClick={() => alert('Plan saved! (Feature coming soon)')}>
								💾 Save Plan
							</button>
							<button className="plan-action-btn share-btn" onClick={() => navigator.share ? navigator.share({title: 'My Meal Plan', text: 'Check out my personalized meal plan!'}) : alert('Share feature not available')}>
								📤 Share
							</button>
							<button className="plan-action-btn regenerate-btn" onClick={() => onSubmit({ preventDefault: () => {} } as any)}>
								🔄 Regenerate
							</button>
						</div>
					</div>

					{/* Nutritional Analysis */}
					{plan.nutritional_analysis && (
						<div className="nutrition-overview">
							<h4>📊 Nutritional Breakdown</h4>
							<div className="nutrition-bars">
								<div className="nutrition-bar">
									<span className="nutrition-label">Protein</span>
									<div className="bar-container">
										<div 
											className="bar protein-bar" 
											style={{width: `${Math.min(plan.nutritional_analysis.protein_percentage, 100)}%`}}
										></div>
									</div>
									<span className="nutrition-value">{plan.nutritional_analysis.protein_percentage.toFixed(1)}%</span>
								</div>
								<div className="nutrition-bar">
									<span className="nutrition-label">Carbs</span>
									<div className="bar-container">
										<div 
											className="bar carb-bar" 
											style={{width: `${Math.min(plan.nutritional_analysis.carb_percentage, 100)}%`}}
										></div>
									</div>
									<span className="nutrition-value">{plan.nutritional_analysis.carb_percentage.toFixed(1)}%</span>
								</div>
								<div className="nutrition-bar">
									<span className="nutrition-label">Fats</span>
									<div className="bar-container">
										<div 
											className="bar fat-bar" 
											style={{width: `${Math.min(plan.nutritional_analysis.fat_percentage, 100)}%`}}
										></div>
									</div>
									<span className="nutrition-value">{plan.nutritional_analysis.fat_percentage.toFixed(1)}%</span>
								</div>
							</div>
						</div>
					)}

					{/* Meal Cards */}
					<div className="meal-cards">
						{['breakfast', 'lunch', 'dinner'].map((mealType) => {
							const mealCalories = plan.meal_breakdown && plan.meal_breakdown[mealType] 
								? plan.meal_breakdown[mealType].calories 
								: plan[mealType].reduce((sum: number, item: any) => sum + item.calories, 0);
							const targetCalories = Math.round(calories / 3); // Rough division
							const caloriePercentage = (mealCalories / targetCalories) * 100;
							
							return (
								<div key={mealType} className="meal-card">
									<div className="meal-header">
										<div className="meal-title">
											<h4>
												{mealType === 'breakfast' && '🌅'} 
												{mealType === 'lunch' && '☀️'} 
												{mealType === 'dinner' && '🌙'} 
												{mealType.charAt(0).toUpperCase() + mealType.slice(1)}
											</h4>
											<div className="meal-progress">
												<div className="progress-bar">
													<div 
														className="progress-fill" 
														style={{ 
															width: `${Math.min(caloriePercentage, 100)}%`,
															backgroundColor: caloriePercentage > 120 ? '#f59e0b' : 
																caloriePercentage > 80 ? 'var(--primary)' : '#60a5fa'
														}}
													></div>
												</div>
												<span className="progress-text">
													{Math.round(caloriePercentage)}% of target
												</span>
											</div>
										</div>
										<div className="meal-calories-info">
											<span className="meal-calories">{mealCalories} kcal</span>
											<span className="meal-target">/ {targetCalories} target</span>
										</div>
									</div>
									
									<div className="meal-items">
										{plan[mealType].map((item: any, idx: number) => (
											<div key={idx} className="meal-item" onClick={() => {
												// Toggle detailed view
												const element = document.getElementById(`item-details-${mealType}-${idx}`);
												if (element) {
													element.style.display = element.style.display === 'none' ? 'block' : 'none';
												}
											}}>
												<div className="item-main">
													<div className="item-info">
														<span className="item-name">{item.name}</span>
														<div className="item-serving-info">
															<span className="item-serving">
																{item.serving_size ? `${item.serving_size}g serving` : '100g serving'}
															</span>
															<span className="item-macros">
																{item.nutrition ? (
																	<>
																		P: {item.nutrition.protein?.toFixed(1) || 0}g | 
																		C: {item.nutrition.carbohydrates?.toFixed(1) || 0}g | 
																		F: {item.nutrition.fats?.toFixed(1) || 0}g
																	</>
																) : 'Nutrition data unavailable'}
															</span>
														</div>
													</div>
													<div className="item-calories-container">
														<span className="item-calories">{item.calories} kcal</span>
														<span className="expand-icon">👁️</span>
													</div>
												</div>
												
												{/* Detailed nutrition info - initially hidden */}
												<div 
													id={`item-details-${mealType}-${idx}`} 
													className="item-details" 
													style={{ display: 'none' }}
												>
													{item.nutrition && (
														<div className="detailed-nutrition">
															<div className="nutrition-header">
																<h5>Complete Nutrition Information</h5>
																<span className="serving-weight">Per {item.serving_size || 100}g serving</span>
															</div>
															
															<div className="macronutrients">
																<h6>Macronutrients</h6>
																<div className="macro-grid">
																	<div className="macro-item protein">
																		<div className="macro-label">Protein</div>
																		<div className="macro-value">{item.nutrition.protein?.toFixed(1) || 0}g</div>
																		<div className="macro-calories">{((item.nutrition.protein || 0) * 4).toFixed(0)} kcal</div>
																	</div>
																	<div className="macro-item carbs">
																		<div className="macro-label">Carbohydrates</div>
																		<div className="macro-value">{item.nutrition.carbohydrates?.toFixed(1) || 0}g</div>
																		<div className="macro-calories">{((item.nutrition.carbohydrates || 0) * 4).toFixed(0)} kcal</div>
																	</div>
																	<div className="macro-item fats">
																		<div className="macro-label">Fats</div>
																		<div className="macro-value">{item.nutrition.fats?.toFixed(1) || 0}g</div>
																		<div className="macro-calories">{((item.nutrition.fats || 0) * 9).toFixed(0)} kcal</div>
																	</div>
																</div>
															</div>

															<div className="micronutrients">
																<h6>Micronutrients & Fiber</h6>
																<div className="micro-grid">
																	{item.nutrition.fiber > 0 && (
																		<div className="nutrition-row">
																			<span>🌾 Fiber:</span>
																			<span>{item.nutrition.fiber.toFixed(1)}g</span>
																		</div>
																	)}
																	{item.nutrition.calcium > 0 && (
																		<div className="nutrition-row">
																			<span>🦴 Calcium:</span>
																			<span>{item.nutrition.calcium.toFixed(0)}mg</span>
																		</div>
																	)}
																	{item.nutrition.iron > 0 && (
																		<div className="nutrition-row">
																			<span>⚡ Iron:</span>
																			<span>{item.nutrition.iron.toFixed(1)}mg</span>
																		</div>
																	)}
																	{item.nutrition.vitamin_c > 0 && (
																		<div className="nutrition-row">
																			<span>🍊 Vitamin C:</span>
																			<span>{item.nutrition.vitamin_c.toFixed(1)}mg</span>
																		</div>
																	)}
																	{item.nutrition.sodium > 0 && (
																		<div className="nutrition-row">
																			<span>🧂 Sodium:</span>
																			<span>{item.nutrition.sodium.toFixed(0)}mg</span>
																		</div>
																	)}
																	{item.nutrition.free_sugar > 0 && (
																		<div className="nutrition-row">
																			<span>🍯 Free Sugar:</span>
																			<span>{item.nutrition.free_sugar.toFixed(1)}g</span>
																		</div>
																	)}
																	{item.nutrition.folate > 0 && (
																		<div className="nutrition-row">
																			<span>🍃 Folate:</span>
																			<span>{item.nutrition.folate.toFixed(0)}µg</span>
																		</div>
																	)}
																</div>
															</div>

															<div className="calorie-breakdown">
																<h6>Calorie Breakdown</h6>
																<div className="calorie-distribution">
																	<div className="calorie-bar">
																		<div className="calorie-segment protein-segment" style={{
																			width: `${((item.nutrition.protein || 0) * 4 / item.calories * 100).toFixed(1)}%`
																		}}></div>
																		<div className="calorie-segment carbs-segment" style={{
																			width: `${((item.nutrition.carbohydrates || 0) * 4 / item.calories * 100).toFixed(1)}%`
																		}}></div>
																		<div className="calorie-segment fats-segment" style={{
																			width: `${((item.nutrition.fats || 0) * 9 / item.calories * 100).toFixed(1)}%`
																		}}></div>
																	</div>
																	<div className="calorie-legend">
																		<span className="legend-item protein">
																			{((item.nutrition.protein || 0) * 4 / item.calories * 100).toFixed(1)}% Protein
																		</span>
																		<span className="legend-item carbs">
																			{((item.nutrition.carbohydrates || 0) * 4 / item.calories * 100).toFixed(1)}% Carbs
																		</span>
																		<span className="legend-item fats">
																			{((item.nutrition.fats || 0) * 9 / item.calories * 100).toFixed(1)}% Fats
																		</span>
																	</div>
																</div>
															</div>
														</div>
													)}
												</div>
												
												{item.nutrition && (
													<div className="item-nutrition">
														{item.nutrition.protein > 0 && (
															<span className="nutrition-tag protein">
																🥩 {item.nutrition.protein.toFixed(1)}g protein
															</span>
														)}
														{item.nutrition.fiber > 0 && (
															<span className="nutrition-tag fiber">
																🌾 {item.nutrition.fiber.toFixed(1)}g fiber
															</span>
														)}
														{item.nutrition.calcium > 0 && (
															<span className="nutrition-tag calcium">
																🦴 {item.nutrition.calcium.toFixed(0)}mg calcium
															</span>
														)}
														{item.nutrition.iron > 0 && (
															<span className="nutrition-tag iron">
																⚡ {item.nutrition.iron.toFixed(1)}mg iron
															</span>
														)}
														{item.nutrition.vitamin_c > 0 && (
															<span className="nutrition-tag vitamin-c">
																🍊 {item.nutrition.vitamin_c.toFixed(1)}mg Vit C
															</span>
														)}
													</div>
												)}
											</div>
										))}
									</div>
									
									<div className="meal-actions">
										<button className="meal-action-btn" onClick={() => alert('Customize meal feature coming soon!')}>
											⚙️ Customize
										</button>
										<button className="meal-action-btn" onClick={() => alert('Alternative suggestions coming soon!')}>
											🔄 Alternatives
										</button>
									</div>
								</div>
							);
						})}
					</div>

					{/* Total Nutrition Summary */}
					{plan.total_nutrition && (
						<div className="nutrition-summary">
							<h4>🧮 Daily Nutrition Totals</h4>
							<div className="nutrition-grid">
								<div className="nutrition-item">
									<span className="nutrition-icon">🥩</span>
									<div className="nutrition-details">
										<span className="nutrition-name">Protein</span>
										<span className="nutrition-amount">{plan.total_nutrition.protein.toFixed(1)}g</span>
									</div>
								</div>
								<div className="nutrition-item">
									<span className="nutrition-icon">🍞</span>
									<div className="nutrition-details">
										<span className="nutrition-name">Carbs</span>
										<span className="nutrition-amount">{plan.total_nutrition.carbohydrates.toFixed(1)}g</span>
									</div>
								</div>
								<div className="nutrition-item">
									<span className="nutrition-icon">🥑</span>
									<div className="nutrition-details">
										<span className="nutrition-name">Fats</span>
										<span className="nutrition-amount">{plan.total_nutrition.fats.toFixed(1)}g</span>
									</div>
								</div>
								<div className="nutrition-item">
									<span className="nutrition-icon">🌾</span>
									<div className="nutrition-details">
										<span className="nutrition-name">Fiber</span>
										<span className="nutrition-amount">{plan.total_nutrition.fiber.toFixed(1)}g</span>
									</div>
								</div>
								<div className="nutrition-item">
									<span className="nutrition-icon">🦴</span>
									<div className="nutrition-details">
										<span className="nutrition-name">Calcium</span>
										<span className="nutrition-amount">{plan.total_nutrition.calcium.toFixed(0)}mg</span>
									</div>
								</div>
								<div className="nutrition-item">
									<span className="nutrition-icon">⚡</span>
									<div className="nutrition-details">
										<span className="nutrition-name">Iron</span>
										<span className="nutrition-amount">{plan.total_nutrition.iron.toFixed(1)}mg</span>
									</div>
								</div>
							</div>
						</div>
					)}

					<div className="plan-footer">
						<p className="plan-note">
							💡 This meal plan is generated using authentic Indian foods and optimized using advanced algorithms 
							to meet your caloric and nutritional needs.
						</p>
					</div>
				</div>
			)}
		</div>
	)
}

