import pandas as pd
import os
from typing import List, Dict, Tuple
from pathlib import Path

class IndianFoodDataLoader:
    """Loads and processes the Indian Food Nutrition dataset"""
    
    def __init__(self):
        # Get the path to the CSV file (one level up from backend/app)
        self.csv_path = Path(__file__).parent.parent.parent / "Indian_Food_Nutrition_Processed.csv"
        self.df = None
        self.load_data()
    
    def load_data(self):
        """Load the CSV data into a pandas DataFrame"""
        try:
            self.df = pd.read_csv(self.csv_path)
            print(f"Loaded {len(self.df)} food items from dataset")
        except FileNotFoundError:
            print(f"Dataset file not found at {self.csv_path}")
            raise
        except Exception as e:
            print(f"Error loading dataset: {e}")
            raise
    
    def categorize_foods(self) -> Dict[str, List[Tuple[str, int, Dict]]]:
        """
        Categorize foods into breakfast, lunch, and dinner based on dish names and calories.
        Returns dict with meal categories containing (name, calories, nutrition_info) tuples.
        """
        if self.df is None:
            raise ValueError("Dataset not loaded")
        
        # Define keywords for meal categorization
        breakfast_keywords = [
            'tea', 'coffee', 'milk', 'breakfast', 'poha', 'upma', 'idli', 'dosa', 
            'paratha', 'toast', 'oats', 'cereal', 'pancake', 'omelet', 'egg',
            'juice', 'smoothie', 'shake', 'porridge', 'uttapam', 'dhokla'
        ]
        
        lunch_dinner_keywords = [
            'rice', 'biryani', 'pulao', 'curry', 'dal', 'sambar', 'rasam',
            'roti', 'chapati', 'naan', 'kulcha', 'sabzi', 'vegetable',
            'chicken', 'mutton', 'fish', 'prawn', 'paneer', 'chole',
            'rajma', 'kadhi', 'korma', 'masala', 'gravy'
        ]
        
        # Light dinner keywords (lower calorie items suitable for dinner)
        light_dinner_keywords = [
            'soup', 'salad', 'raita', 'chaat', 'sprouts', 'steamed',
            'grilled', 'boiled', 'clear', 'broth'
        ]
        
        categorized = {
            'breakfast': [],
            'lunch': [],
            'dinner': []
        }
        
        for _, row in self.df.iterrows():
            dish_name = row['Dish Name'].lower()
            calories = row['Calories (kcal)']
            
            # Skip very low calorie items (likely condiments/spices)
            if calories < 20:
                continue
            
            # Create nutrition info dict with all available nutrients
            nutrition_info = {
                'carbohydrates': row['Carbohydrates (g)'],
                'protein': row['Protein (g)'],
                'fats': row['Fats (g)'],
                'fiber': row['Fibre (g)'],
                'calcium': row['Calcium (mg)'],
                'iron': row['Iron (mg)'],
                'vitamin_c': row['Vitamin C (mg)'],
                'sodium': row.get('Sodium (mg)', 0),
                'free_sugar': row.get('Free Sugar (g)', 0),
                'folate': row.get('Folate (µg)', 0)
            }
            
            # Include serving size (default to 100g as that's what the nutrition data is based on)
            serving_size = 100.0  # grams
            food_item = (row['Dish Name'], int(calories), nutrition_info, serving_size)
            
            # Categorize based on keywords and calorie content
            is_breakfast = any(keyword in dish_name for keyword in breakfast_keywords)
            is_lunch_dinner = any(keyword in dish_name for keyword in lunch_dinner_keywords)
            is_light = any(keyword in dish_name for keyword in light_dinner_keywords)
            
            if is_breakfast or calories < 100:
                categorized['breakfast'].append(food_item)
            elif is_light or (calories < 200 and not is_lunch_dinner):
                categorized['dinner'].append(food_item)
            elif is_lunch_dinner or calories > 300:
                categorized['lunch'].append(food_item)
            else:
                # Default categorization based on calorie content
                if calories < 150:
                    categorized['breakfast'].append(food_item)
                elif calories > 400:
                    categorized['lunch'].append(food_item)
                else:
                    categorized['dinner'].append(food_item)
        
        # Ensure each category has enough options
        min_items = 20
        for category in categorized:
            if len(categorized[category]) < min_items:
                # Add some general items to ensure variety
                remaining_items = [
                    (row['Dish Name'], int(row['Calories (kcal)']), {
                        'carbohydrates': row['Carbohydrates (g)'],
                        'protein': row['Protein (g)'],
                        'fats': row['Fats (g)'],
                        'fiber': row['Fibre (g)'],
                        'calcium': row['Calcium (mg)'],
                        'iron': row['Iron (mg)'],
                        'vitamin_c': row['Vitamin C (mg)'],
                        'sodium': row.get('Sodium (mg)', 0),
                        'free_sugar': row.get('Free Sugar (g)', 0),
                        'folate': row.get('Folate (µg)', 0)
                    }, 100.0)
                    for _, row in self.df.iterrows()
                    if row['Calories (kcal)'] >= 20 and 
                    (row['Dish Name'], int(row['Calories (kcal)']), {}) not in 
                    [item[:2] + ({},) for item in categorized[category]]
                ]
                
                # Add items based on calorie appropriateness for the meal
                if category == 'breakfast':
                    suitable_items = [item for item in remaining_items if 50 <= item[1] <= 300]
                elif category == 'lunch':
                    suitable_items = [item for item in remaining_items if 200 <= item[1] <= 800]
                else:  # dinner
                    suitable_items = [item for item in remaining_items if 100 <= item[1] <= 500]
                
                # Add items to reach minimum count
                needed = min_items - len(categorized[category])
                categorized[category].extend(suitable_items[:needed])
        
        print(f"Categorized foods: Breakfast: {len(categorized['breakfast'])}, "
              f"Lunch: {len(categorized['lunch'])}, Dinner: {len(categorized['dinner'])}")
        
        return categorized
    
    def get_vegetarian_foods(self) -> Dict[str, List[Tuple[str, int, Dict]]]:
        """
        Filter and return vegetarian foods only.
        This is a simple implementation - in a real scenario, you might have 
        a separate column indicating vegetarian status.
        """
        all_foods = self.categorize_foods()
        
        # Keywords that typically indicate non-vegetarian food
        non_veg_keywords = [
            'chicken', 'mutton', 'lamb', 'beef', 'pork', 'fish', 'prawn', 
            'shrimp', 'crab', 'meat', 'egg', 'omelet', 'omelette'
        ]
        
        veg_foods = {}
        for meal_type, foods in all_foods.items():
            veg_foods[meal_type] = [
                food for food in foods 
                if not any(keyword in food[0].lower() for keyword in non_veg_keywords)
            ]
        
        print(f"Vegetarian foods: Breakfast: {len(veg_foods['breakfast'])}, "
              f"Lunch: {len(veg_foods['lunch'])}, Dinner: {len(veg_foods['dinner'])}")
        
        return veg_foods
    
    def get_non_vegetarian_foods(self) -> Dict[str, List[Tuple[str, int, Dict]]]:
        """
        Return all foods including non-vegetarian options.
        """
        return self.categorize_foods()
    
    def get_food_stats(self) -> Dict:
        """Get basic statistics about the dataset"""
        if self.df is None:
            return {}
        
        return {
            'total_foods': len(self.df),
            'calorie_range': {
                'min': self.df['Calories (kcal)'].min(),
                'max': self.df['Calories (kcal)'].max(),
                'mean': self.df['Calories (kcal)'].mean()
            },
            'protein_range': {
                'min': self.df['Protein (g)'].min(),
                'max': self.df['Protein (g)'].max(),
                'mean': self.df['Protein (g)'].mean()
            }
        }

# Global instance to be used across the application
food_data_loader = IndianFoodDataLoader()
