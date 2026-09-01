from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Union, Dict, Any
import json
import os
from datetime import date

app = FastAPI(
    title="Samarthya Scheme Matching API",
    description="Backend API for matching special-needs student profiles with eligible government welfare schemes.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load schemes database from JSON
SCHEMES_FILE = os.path.join(os.path.dirname(__file__), "schemes.json")
try:
    with open(SCHEMES_FILE, "r", encoding="utf-8") as f:
        schemes_data = json.load(f)
except Exception as e:
    schemes_data = {
        "INDIAN_STATES": [],
        "EDUCATION_LEVELS": [],
        "DISABILITY_TYPES": [],
        "SCHEME_CATEGORIES": {},
        "SCHEME_DATABASE": []
    }
    print(f"Warning: Failed to load schemes database: {e}")

# Pydantic models for request validation
class StudentProfile(BaseModel):
    name: str = "Student"
    dob: str  # YYYY-MM-DD
    gender: str  # male, female, other
    state: str
    disabilityTypes: List[str]
    disabilityPercent: int = Field(ge=0, le=100)
    educationLevel: str
    householdIncome: int

# Matching Engine helpers
def calculate_age(dob_str: str) -> int:
    try:
        dob = date.fromisoformat(dob_str)
        today = date.today()
        age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
        return age
    except Exception:
        # Fallback if invalid date
        return 18

def get_disability_label(dtype_id: str) -> str:
    for d in schemes_data.get("DISABILITY_TYPES", []):
        if d["id"] == dtype_id:
            return d["label"]
    return dtype_id

def get_education_label(edu_id: str) -> str:
    for e in schemes_data.get("EDUCATION_LEVELS", []):
        if e["id"] == edu_id:
            return e["label"]
    return edu_id

def days_to_deadline(deadline_str: str) -> int:
    try:
        deadline = date.fromisoformat(deadline_str)
        today = date.today()
        diff = deadline - today
        return diff.days
    except Exception:
        return 365

def evaluate_scheme(profile: StudentProfile, age: int, scheme: Dict[str, Any]) -> Dict[str, Any]:
    e = scheme.get("eligibility", {})
    checks = []
    total_weight = 0
    passed_weight = 0

    # 1. Disability Type Check (weight: 30)
    weight_dtype = 30
    total_weight += weight_dtype
    scheme_dtypes = e.get("disabilityTypes", [])
    profile_dtypes = profile.disabilityTypes
    has_no_disability = "none" in profile_dtypes
    
    passed_dtype = False
    detail_dtype = ""
    
    if has_no_disability:
        passed_dtype = e.get("disabilityPercentMin", 0) == 0
        detail_dtype = "No disability required for this scheme" if passed_dtype else "This scheme requires a disability certificate"
    else:
        intersection = [d for d in profile_dtypes if d in scheme_dtypes]
        passed_dtype = len(intersection) > 0
        if passed_dtype:
            detail_dtype = f"Matched: {', '.join([get_disability_label(d) for d in intersection])}"
        else:
            required_list = ', '.join([get_disability_label(d) for d in scheme_dtypes[:4]])
            detail_dtype = f"Your type(s) not covered. Scheme requires: {required_list}..."

    if passed_dtype:
        passed_weight += weight_dtype
    
    checks.append({
        "name": "Disability Type Match",
        "weight": weight_dtype,
        "passed": passed_dtype,
        "detail": detail_dtype
    })

    # 2. Disability Percentage Check (weight: 20)
    weight_percent = 20
    total_weight += weight_percent
    required_percent = e.get("disabilityPercentMin", 40)
    passed_percent = profile.disabilityPercent >= required_percent
    
    if passed_percent:
        passed_weight += weight_percent
        detail_percent = f"Your {profile.disabilityPercent}% >= required {required_percent}%"
    else:
        detail_percent = f"Your {profile.disabilityPercent}% < required minimum {required_percent}%"

    checks.append({
        "name": "Disability Percentage",
        "weight": weight_percent,
        "passed": passed_percent,
        "detail": detail_percent
    })

    # 3. Education Level Check (weight: 15)
    weight_edu = 15
    total_weight += weight_edu
    allowed_levels = e.get("educationLevels", "all")
    
    if allowed_levels == "all":
        passed_edu = True
    elif isinstance(allowed_levels, list):
        passed_edu = profile.educationLevel in allowed_levels
    else:
        passed_edu = False

    if passed_edu:
        passed_weight += weight_edu
        detail_edu = f"Current level '{get_education_label(profile.educationLevel)}' is eligible"
    else:
        req_levels = ', '.join([get_education_label(l) for l in allowed_levels[:3]]) if isinstance(allowed_levels, list) else "all"
        detail_edu = f"Level '{get_education_label(profile.educationLevel)}' not eligible. Requires: {req_levels}..."

    checks.append({
        "name": "Education Level",
        "weight": weight_edu,
        "passed": passed_edu,
        "detail": detail_edu
    })

    # 4. Income Ceiling Check (weight: 15)
    weight_income = 15
    total_weight += weight_income
    max_income = e.get("maxIncome", 9999999)
    passed_income = profile.householdIncome <= max_income

    if passed_income:
        passed_weight += weight_income
        income_str = "No limit" if max_income >= 9999999 else f"Rs {max_income/100000:.1f} lakh"
        detail_income = f"Income within limit (Max: {income_str})"
    else:
        income_str = f"Rs {max_income/100000:.1f} lakh"
        detail_income = f"Income Rs {profile.householdIncome/100000:.1f}L exceeds maximum {income_str}"

    checks.append({
        "name": "Income Eligibility",
        "weight": weight_income,
        "passed": passed_income,
        "detail": detail_income
    })

    # 5. Age Range Check (weight: 10)
    weight_age = 10
    total_weight += weight_age
    age_range = e.get("ageRange", [0, 99])
    min_age, max_age = age_range[0], age_range[1]
    passed_age = min_age <= age <= max_age

    if passed_age:
        passed_weight += weight_age
        detail_age = f"Age {age} is within {min_age}-{max_age} years"
    else:
        detail_age = f"Age {age} is outside required range ({min_age}-{max_age})"

    checks.append({
        "name": "Age Range",
        "weight": weight_age,
        "passed": passed_age,
        "detail": detail_age
    })

    # 6. Gender Check (weight: 5)
    weight_gender = 5
    total_weight += weight_gender
    req_gender = e.get("gender", "all")
    passed_gender = req_gender == "all" or req_gender == profile.gender

    if passed_gender:
        passed_weight += weight_gender
        detail_gender = "Gender criteria met"
    else:
        detail_gender = f"Scheme is for {req_gender} only"

    checks.append({
        "name": "Gender Eligibility",
        "weight": weight_gender,
        "passed": passed_gender,
        "detail": detail_gender
    })

    # 7. State Check (weight: 5)
    weight_state = 5
    total_weight += weight_state
    allowed_states = e.get("states", "all")
    
    if allowed_states == "all":
        passed_state = True
    elif isinstance(allowed_states, list):
        passed_state = profile.state in allowed_states
    else:
        passed_state = False

    if passed_state:
        passed_weight += weight_state
        detail_state = "Your state is covered"
    else:
        detail_state = "Scheme not available in your state"

    checks.append({
        "name": "State/UT Coverage",
        "weight": weight_state,
        "passed": passed_state,
        "detail": detail_state
    })

    # Compute final score
    score = round((passed_weight / total_weight) * 100)

    # Status classification
    if score >= 85:
        status = "highly-eligible"
    elif score >= 65:
        status = "likely-eligible"
    elif score >= 40:
        status = "partially-eligible"
    else:
        status = "low-match"

    days_left = days_to_deadline(scheme.get("deadline", "2027-12-31"))
    is_urgent = 0 < days_left <= 60

    return {
        "scheme": scheme,
        "score": score,
        "status": status,
        "checks": checks,
        "daysToDeadline": days_left,
        "isUrgent": is_urgent,
        "requiredDocuments": scheme.get("requiredDocuments", [])
    }

# API Endpoints
@app.get("/")
def read_root():
    return {
        "message": "Welcome to Samarthya Scheme Matching API",
        "endpoints": {
            "GET /api/metadata": "Fetch Indian states, education levels, disability types, and categories.",
            "GET /api/schemes": "Fetch all welfare schemes in the database.",
            "POST /api/match": "Evaluate student profile against schemes database to find matches."
        }
    }

@app.get("/api/metadata")
def get_metadata():
    return {
        "states": schemes_data.get("INDIAN_STATES", []),
        "educationLevels": schemes_data.get("EDUCATION_LEVELS", []),
        "disabilityTypes": schemes_data.get("DISABILITY_TYPES", []),
        "categories": schemes_data.get("SCHEME_CATEGORIES", {})
    }

@app.get("/api/schemes")
def get_schemes():
    return schemes_data.get("SCHEME_DATABASE", [])

@app.post("/api/match")
def match_profile(profile: StudentProfile):
    age = calculate_age(profile.dob)
    results = []
    
    for scheme in schemes_data.get("SCHEME_DATABASE", []):
        res = evaluate_scheme(profile, age, scheme)
        # Only return matches with score > 0
        if res["score"] > 0:
            results.append(res)
            
    # Sort by score descending
    results.sort(key=lambda x: x["score"], reverse=True)
    
    # Calculate stats summary
    highly_eligible = sum(1 for r in results if r["status"] == "highly-eligible")
    urgent = sum(1 for r in results if r["isUrgent"])
    avg_score = sum(r["score"] for r in results) / len(results) if results else 0.0
    
    categories = {}
    for r in results:
        cat = r["scheme"]["category"]
        categories[cat] = categories.get(cat, 0) + 1

    return {
        "profile": {**profile.model_dump(), "age": age},
        "results": results,
        "stats": {
            "total": len(results),
            "highlyEligible": highly_eligible,
            "urgent": urgent,
            "avgScore": f"{avg_score:.1f}",
            "categories": categories
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
