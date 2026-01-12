from pydantic import BaseModel, EmailStr, Field
from typing import List, Literal, Optional, Dict

FoodType = Literal["veg", "nonveg"]
Gender = Literal["male", "female"]
ActivityLevel = Literal["sedentary", "light", "moderate", "active", "very_active"]

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class MealGenerateRequest(BaseModel):
    age: int = Field(ge=1, le=120)
    weight_kg: float = Field(gt=0, le=400)
    height_cm: Optional[float] = Field(gt=0, le=250, default=170)
    gender: Optional[Gender] = Field(default="male")
    activity_level: Optional[ActivityLevel] = Field(default="moderate")
    calories_limit: int = Field(ge=800, le=5000)
    food_type: FoodType

class NutritionInfo(BaseModel):
    protein: float = 0
    carbohydrates: float = 0
    fats: float = 0
    fiber: float = 0
    calcium: float = 0
    iron: float = 0
    vitamin_c: float = 0
    sodium: Optional[float] = 0
    free_sugar: Optional[float] = 0
    folate: Optional[float] = 0

class MealItem(BaseModel):
    name: str
    calories: int
    serving_size: Optional[float] = 100  # in grams
    nutrition: Optional[NutritionInfo] = None

class MealBreakdown(BaseModel):
    calories: int
    target_calories: int
    nutrition: NutritionInfo

class MealPlanResponse(BaseModel):
    breakfast: List[MealItem]
    lunch: List[MealItem]
    dinner: List[MealItem]
    total_calories: int
    total_nutrition: Optional[NutritionInfo] = None
    meal_breakdown: Optional[Dict[str, MealBreakdown]] = None
    daily_targets: Optional[Dict] = None
    nutritional_analysis: Optional[Dict] = None
