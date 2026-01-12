# Smart Diet Planner - Backend (FastAPI)

## Setup (Windows PowerShell)

```powershell
cd backend
python -m venv .venv
. .venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API base: `http://localhost:8000`

- Register: `POST /api/auth/register` (json: `{ email, password }`)
- Login: `POST /api/auth/login` (form: `username`, `password`)
- Generate plan: `POST /api/meal/generate` (Bearer token required)
