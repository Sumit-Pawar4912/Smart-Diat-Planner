from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import json
import math

from .db import get_db
from .models import MealPlan, FoodTypeEnum
from .schemas import MealGenerateRequest, MealPlanResponse
from .security import get_current_user
from .meal_logic import generate_meal_plan

router = APIRouter()

def replace_nan_with_none(data):
    """Recursively replace NaN and infinity values with None for JSON serialization."""
    if isinstance(data, dict):
        return {k: replace_nan_with_none(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [replace_nan_with_none(i) for i in data]
    elif isinstance(data, float) and (math.isnan(data) or math.isinf(data)):
        return None
    return data


@router.post("/generate", response_model=MealPlanResponse)
def generate(payload: MealGenerateRequest, db: Session = Depends(get_db), user=Depends(get_current_user)):
    plan = generate_meal_plan(
        age=payload.age,
        weight_kg=payload.weight_kg,
        calories_limit=payload.calories_limit,
        food_type=FoodTypeEnum(payload.food_type),
        height_cm=payload.height_cm,
        gender=payload.gender,
        activity_level=payload.activity_level,
    )

    # ✅ Clean NaN/inf values before saving and returning
    clean_plan = replace_nan_with_none(plan)

    record = MealPlan(
        user_id=user.id,
        age=payload.age,
        weight_kg=payload.weight_kg,
        calories_limit=payload.calories_limit,
        food_type=FoodTypeEnum(payload.food_type),
        plan_json=json.dumps(clean_plan),
    )
    db.add(record)
    db.commit()
    return clean_plan


@router.post("/generate-test", response_model=MealPlanResponse)
def generate_test(payload: MealGenerateRequest):
    """Test endpoint for meal generation without authentication"""
    plan = generate_meal_plan(
        age=payload.age,
        weight_kg=payload.weight_kg,
        calories_limit=payload.calories_limit,
        food_type=FoodTypeEnum(payload.food_type),
        height_cm=payload.height_cm,
        gender=payload.gender,
        activity_level=payload.activity_level,
    )

    # ✅ Clean NaN/inf values before returning
    return replace_nan_with_none(plan)
