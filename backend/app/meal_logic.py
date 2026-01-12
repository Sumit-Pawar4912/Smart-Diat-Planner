from typing import List, Dict, Tuple, Optional
from .models import FoodTypeEnum
from .data_loader import food_data_loader
import random


def _enhanced_knapsack_with_nutrition(
    items: List[Tuple[str, int, Dict, float]], 
    calorie_capacity: int,
    min_protein: float = 0,
    max_items: int = 3
) -> Tuple[List[Dict], int, Dict]:
    """
    Enhanced 0/1 knapsack algorithm that considers both calories and nutritional balance.
    
    Args:
        items: List of (name, calories, nutrition_info) tuples
        calorie_capacity: Maximum calories allowed
        min_protein: Minimum protein requirement
        max_items: Maximum number of food items to select
    
    Returns:
        Tuple of (selected_items, total_calories, total_nutrition)
    """
    if not items:
        return [], 0, {}
    
    n = len(items)
    
    # DP table: dp[i][c][k] = (max_value, protein, nutrition_totals)
    # where i = item index, c = calorie capacity, k = number of items used
    dp = {}
    
    # Initialize DP table
    for i in range(n + 1):
        for c in range(calorie_capacity + 1):
            for k in range(max_items + 1):
                dp[(i, c, k)] = (0, 0, {})
    
    # Fill DP table
    for i in range(1, n + 1):
        name, calories, nutrition, serving_size = items[i-1]
        protein = nutrition.get('protein', 0)
        
        for c in range(calorie_capacity + 1):
            for k in range(max_items + 1):
                # Don't take current item
                dp[(i, c, k)] = dp[(i-1, c, k)]
                
                # Take current item (if possible)
                if calories <= c and k > 0:
                    prev_value, prev_protein, prev_nutrition = dp[(i-1, c-calories, k-1)]
                    
                    # Calculate new value (prioritize calories but consider protein)
                    new_value = prev_value + calories
                    new_protein = prev_protein + protein
                    
                    # Bonus for meeting protein requirements
                    if new_protein >= min_protein:
                        new_value += 10  # Small bonus for meeting protein needs
                    
                    # Update if this is better
                    if new_value > dp[(i, c, k)][0]:
                        # Calculate total nutrition
                        new_nutrition = prev_nutrition.copy()
                        for nutrient, value in nutrition.items():
                            new_nutrition[nutrient] = new_nutrition.get(nutrient, 0) + value
                        
                        dp[(i, c, k)] = (new_value, new_protein, new_nutrition)
    
    # Find the best solution
    best_value = 0
    best_config = None
    
    for c in range(calorie_capacity + 1):
        for k in range(1, max_items + 1):
            value, protein, nutrition = dp[(n, c, k)]
            if value > best_value:
                best_value = value
                best_config = (c, k)
    
    if best_config is None:
        return [], 0, {}
    
    # Reconstruct solution
    selected_items = []
    total_nutrition = {}
    c, k = best_config
    
    for i in range(n, 0, -1):
        if k > 0 and dp[(i, c, k)] != dp[(i-1, c, k)]:
            name, calories, nutrition, serving_size = items[i-1]
            selected_items.append({
                'name': name,
                'calories': calories,
                'nutrition': nutrition,
                'serving_size': serving_size
            })
            c -= calories
            k -= 1
            
            # Add to total nutrition
            for nutrient, value in nutrition.items():
                total_nutrition[nutrient] = total_nutrition.get(nutrient, 0) + value
    
    selected_items.reverse()
    total_calories = sum(item['calories'] for item in selected_items)
    
    return selected_items, total_calories, total_nutrition


def _simple_knapsack_fallback(items: List[Tuple[str, int, Dict, float]], capacity: int) -> Tuple[List[Dict], int]:
    """
    Simple fallback knapsack when the enhanced version doesn't find good solutions.
    """
    if not items:
        return [], 0
    
    # Sort by calorie efficiency (calories per unit weight, treating weight as 1)
    sorted_items = sorted(items, key=lambda x: x[1], reverse=True)
    
    selected = []
    total_calories = 0
    
    for name, calories, nutrition, serving_size in sorted_items:
        if total_calories + calories <= capacity and len(selected) < 3:
            selected.append({
                'name': name,
                'calories': calories,
                'nutrition': nutrition,
                'serving_size': serving_size
            })
            total_calories += calories
    
    return selected, total_calories


def generate_meal_plan(age: int, weight_kg: float, calories_limit: int, food_type: FoodTypeEnum, 
                      height_cm: float = 170, gender: str = "male", activity_level: str = "moderate") -> Dict:
    """
    Generate a personalized meal plan using the Indian food dataset and knapsack algorithm.
    
    Args:
        age: User's age
        weight_kg: User's weight in kg
        calories_limit: Daily calorie limit
        food_type: Vegetarian or non-vegetarian preference
        height_cm: User's height in centimeters
        gender: User's gender ("male" or "female")
        activity_level: User's activity level
    
    Returns:
        Dictionary containing meal plan with nutritional information
    """
    try:
        # Get food options from the dataset
        if food_type == FoodTypeEnum.veg:
            options = food_data_loader.get_vegetarian_foods()
        else:
            options = food_data_loader.get_non_vegetarian_foods()
        
        # Calculate protein requirements based on weight and gender
        # Female: 0.8-1.0g per kg body weight, Male: 1.0-1.2g per kg body weight
        if gender.lower() == "female":
            daily_protein_requirement = weight_kg * 0.9  # Slightly lower for females
        else:
            
            daily_protein_requirement = weight_kg * 1.0  # Standard for males
        
        # Calculate BMR using Mifflin-St Jeor Equation for better targeting
        if gender.lower() == "female":
            bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161
        else:
            bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
        
        # Activity level multipliers
        activity_multipliers = {
            "sedentary": 1.2,
            "light": 1.375,
            "moderate": 1.55,
            "active": 1.725,
            "very_active": 1.9
        }
        
        # Calculate recommended calories based on BMR and activity
        recommended_calories = bmr * activity_multipliers.get(activity_level, 1.55)
        
        # Calorie and protein distribution per meal
        meal_distribution = {
            "breakfast": {"calorie_ratio": 0.25, "protein_ratio": 0.20},
            "lunch": {"calorie_ratio": 0.45, "protein_ratio": 0.50},
            "dinner": {"calorie_ratio": 0.30, "protein_ratio": 0.30},
        }
        
        plan = {
            "breakfast": [],
            "lunch": [],
            "dinner": [],
            "total_calories": 0,
            "total_nutrition": {
                "protein": 0,
                "carbohydrates": 0,
                "fats": 0,
                "fiber": 0,
                "calcium": 0,
                "iron": 0,
                "vitamin_c": 0
            },
            "meal_breakdown": {}
        }
        
        total_calories = 0
        total_nutrition = {
            "protein": 0,
            "carbohydrates": 0,
            "fats": 0,
            "fiber": 0,
            "calcium": 0,
            "iron": 0,
            "vitamin_c": 0
        }
        
        for meal_type in ["breakfast", "lunch", "dinner"]:
            # Calculate targets for this meal
            calorie_target = int(calories_limit * meal_distribution[meal_type]["calorie_ratio"])
            protein_target = daily_protein_requirement * meal_distribution[meal_type]["protein_ratio"]
            
            # Get available options for this meal
            meal_options = options.get(meal_type, [])
            
            if not meal_options:
                # Fallback: use a simple default if no options available
                plan[meal_type] = [{
                    "name": f"Default {meal_type} option",
                    "calories": calorie_target // 2,
                    "nutrition": {"protein": protein_target // 2}
                }]
                continue
            
            # Add some randomization to avoid always getting the same meals
            if len(meal_options) > 20:
                # Randomly sample a subset for variety
                meal_options = random.sample(meal_options, min(50, len(meal_options)))
            
            # Use enhanced knapsack algorithm
            selected_items, meal_calories, meal_nutrition = _enhanced_knapsack_with_nutrition(
                meal_options,
                calorie_target,
                min_protein=protein_target,
                max_items=3
            )
            
            # Fallback if knapsack didn't find good solution
            if not selected_items or meal_calories < calorie_target * 0.5:
                selected_items, meal_calories = _simple_knapsack_fallback(meal_options, calorie_target)
                meal_nutrition = {}
                for item in selected_items:
                    for nutrient, value in item.get('nutrition', {}).items():
                        meal_nutrition[nutrient] = meal_nutrition.get(nutrient, 0) + value
            
            # Store meal plan
            plan[meal_type] = selected_items
            plan["meal_breakdown"][meal_type] = {
                "calories": meal_calories,
                "target_calories": calorie_target,
                "nutrition": meal_nutrition
            }
            
            # Add to totals
            total_calories += meal_calories
            for nutrient, value in meal_nutrition.items():
                if nutrient in total_nutrition:
                    total_nutrition[nutrient] += value
        
        plan["total_calories"] = total_calories
        plan["total_nutrition"] = total_nutrition
        plan["daily_targets"] = {
            "calories": calories_limit,
            "protein": daily_protein_requirement
        }
        plan["nutritional_analysis"] = {
            "protein_percentage": (total_nutrition["protein"] * 4 / total_calories * 100) if total_calories > 0 else 0,
            "carb_percentage": (total_nutrition["carbohydrates"] * 4 / total_calories * 100) if total_calories > 0 else 0,
            "fat_percentage": (total_nutrition["fats"] * 9 / total_calories * 100) if total_calories > 0 else 0
        }
        
        return plan
        
    except Exception as e:
        print(f"Error generating meal plan: {e}")
        # Return a basic fallback plan
        return {
            "breakfast": [{"name": "Basic breakfast", "calories": int(0.25 * calories_limit)}],
            "lunch": [{"name": "Basic lunch", "calories": int(0.45 * calories_limit)}],
            "dinner": [{"name": "Basic dinner", "calories": int(0.30 * calories_limit)}],
            "total_calories": calories_limit,
            "error": str(e)
        }
