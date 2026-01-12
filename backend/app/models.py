from sqlalchemy import Column, Integer, String, Float, Enum, DateTime, Text
from sqlalchemy.sql import func
from .db import Base
import enum

class FoodTypeEnum(str, enum.Enum):
    veg = "veg"
    nonveg = "nonveg"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class MealPlan(Base):
    __tablename__ = "meal_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    age = Column(Integer, nullable=False)
    weight_kg = Column(Float, nullable=False)
    calories_limit = Column(Integer, nullable=False)
    food_type = Column(Enum(FoodTypeEnum), nullable=False)
    plan_json = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
