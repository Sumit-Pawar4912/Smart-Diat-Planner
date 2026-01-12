import axios from 'axios'
import { getToken } from './token'

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

export const api = axios.create({
	baseURL: API_BASE
})

api.interceptors.request.use((config) => {
	const token = getToken()
	if (token) {
		config.headers = config.headers || {}
		config.headers['Authorization'] = `Bearer ${token}`
	}
	return config
})

export async function register(email: string, password: string) {
	return api.post('/api/auth/register', { email, password })
}

export async function login(username: string, password: string) {
	const params = new URLSearchParams()
	params.append('username', username)
	params.append('password', password)
	return api.post('/api/auth/login', params, {
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	})
}

export type MealPayload = {
	age: number
	weight_kg: number
	height_cm?: number
	gender?: 'male' | 'female'
	activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
	calories_limit: number
	food_type: 'veg' | 'nonveg'
}

export async function generateMeal(payload: MealPayload) {
	return api.post('/api/meal/generate', payload)
}
