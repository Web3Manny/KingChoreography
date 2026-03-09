from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
import json
import uuid
import httpx
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone, timedelta, date
from decimal import Decimal
import jwt
import hashlib

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Supabase config
SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_ANON_KEY = os.environ.get('SUPABASE_ANON_KEY')
SUPABASE_SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_KEY')
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'brian@kingchoreography.com')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'KingChoreography2025!')
JWT_SECRET = os.environ.get('JWT_SECRET', 'king-choreography-jwt-secret-2025')

# Supabase REST helpers
def supabase_headers():
    return {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': f'Bearer {SUPABASE_SERVICE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    }

async def supabase_get(table, params=""):
    async with httpx.AsyncClient() as client:
        r = await client.get(
            f"{SUPABASE_URL}/rest/v1/{table}?{params}",
            headers=supabase_headers(), timeout=15
        )
        r.raise_for_status()
        return r.json()

async def supabase_post(table, data):
    async with httpx.AsyncClient() as client:
        r = await client.post(
            f"{SUPABASE_URL}/rest/v1/{table}",
            headers=supabase_headers(), json=data, timeout=15
        )
        r.raise_for_status()
        return r.json()

async def supabase_patch(table, match_params, data):
    headers = supabase_headers()
    async with httpx.AsyncClient() as client:
        r = await client.patch(
            f"{SUPABASE_URL}/rest/v1/{table}?{match_params}",
            headers=headers, json=data, timeout=15
        )
        r.raise_for_status()
        return r.json()

async def supabase_delete(table, match_params):
    async with httpx.AsyncClient() as client:
        r = await client.delete(
            f"{SUPABASE_URL}/rest/v1/{table}?{match_params}",
            headers=supabase_headers(), timeout=15
        )
        r.raise_for_status()
        return r.status_code

# Auth
security = HTTPBearer()

def create_token(email: str, role: str):
    payload = {
        "email": email,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def verify_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=["HS256"])
        if payload.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Admin access required")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Business Logic
def calculate_price(service, athlete_count, is_client, session_length, include_consultation):
    if service['service_type'] == 'free_tier':
        return {"total": 0, "breakdown": {"type": "free"}}

    if service['service_type'] == 'review_feedback':
        rate = float(service['client_rate'] or 0) if is_client else float(service['nonclient_rate'] or 0)
        breakdown = {"base": rate, "clientDiscount": is_client, "service": "Review & Feedback"}
        total = rate
        if include_consultation and service.get('addon_price'):
            addon = float(service['addon_price'])
            total += addon
            breakdown["consultationAddon"] = addon
        return {"total": round(total, 2), "breakdown": breakdown}

    if service['service_type'] == 'virtual_upgrade':
        rate_key = None
        if is_client and session_length == '2hr':
            rate_key = 'per_athlete_rate_client_2hr'
        elif is_client and session_length == '4hr':
            rate_key = 'per_athlete_rate_client_4hr'
        elif not is_client and session_length == '2hr':
            rate_key = 'per_athlete_rate_nonclient_2hr'
        elif not is_client and session_length == '4hr':
            rate_key = 'per_athlete_rate_nonclient_4hr'

        per_athlete_rate = float(service.get(rate_key, 0) or 0)
        total = athlete_count * per_athlete_rate
        return {
            "total": round(total, 2),
            "breakdown": {
                "perAthleteRate": per_athlete_rate,
                "athleteCount": athlete_count,
                "sessionLength": session_length,
                "isClient": is_client,
                "formula": f"{athlete_count} x ${per_athlete_rate}",
                "service": "Virtual Routine Upgrade"
            }
        }

    return {"total": 0, "breakdown": {}}

def get_monday_of_week(dt):
    days_since_monday = dt.weekday()
    return (dt - timedelta(days=days_since_monday)).date()

def assign_review_week_date(submitted_at):
    current_monday = get_monday_of_week(submitted_at)
    cutoff = datetime.combine(current_monday, datetime.max.time())
    target_week = current_monday
    if submitted_at.date() > current_monday:
        target_week = current_monday + timedelta(days=7)
    elif submitted_at.date() == current_monday and submitted_at.hour >= 23 and submitted_at.minute >= 59:
        target_week = current_monday + timedelta(days=7)
    return target_week

# App setup
app = FastAPI()
api_router = APIRouter(prefix="/api")

# ============ PUBLIC ROUTES ============

@api_router.get("/")
async def root():
    return {"message": "King Choreography API", "status": "running"}

@api_router.get("/services")
async def get_services(category: Optional[str] = None):
    params = "is_active=eq.true&order=sort_order.asc"
    if category:
        params += f"&category=eq.{category}"
    return await supabase_get("services", params)

@api_router.get("/services/{service_id}")
async def get_service(service_id: str):
    data = await supabase_get("services", f"id=eq.{service_id}")
    if not data:
        raise HTTPException(status_code=404, detail="Service not found")
    return data[0]

# ============ APPLICATION FUNNEL ============

class ApplicationCreate(BaseModel):
    gym_name: str
    contact_name: str
    email: str
    phone: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    services_interested: Optional[List[str]] = []
    team_levels: Optional[List[str]] = []
    divisions: Optional[List[str]] = []
    timeframe: Optional[str] = None
    referral_source: Optional[str] = None
    referral_detail: Optional[str] = None
    additional_notes: Optional[str] = None

@api_router.post("/applications")
async def create_application(app_data: ApplicationCreate):
    data = app_data.model_dump()
    data['status'] = 'new'
    data['submitted_at'] = datetime.now(timezone.utc).isoformat()
    result = await supabase_post("applications", data)
    # Mock email notifications
    logger.info(f"[EMAIL MOCK] Application confirmation sent to {data['email']}")
    logger.info(f"[EMAIL MOCK] New application alert sent to {ADMIN_EMAIL} from {data['gym_name']}")
    return result[0] if result else data

# ============ SUBMISSION FUNNEL ============

class SubmissionCreate(BaseModel):
    service_id: str
    service_type: str
    full_name: str
    email: str
    phone: Optional[str] = None
    gym_name: str
    athlete_names: Optional[List[str]] = []
    athlete_count: int = 1
    is_existing_client: bool = False
    session_length: Optional[str] = None
    consultation_addon: bool = False
    areas_of_concern: Optional[str] = None

@api_router.post("/submissions")
async def create_submission(sub_data: SubmissionCreate):
    services = await supabase_get("services", f"id=eq.{sub_data.service_id}")
    if not services:
        raise HTTPException(status_code=404, detail="Service not found")
    service = services[0]

    price_result = calculate_price(
        service, sub_data.athlete_count, sub_data.is_existing_client,
        sub_data.session_length, sub_data.consultation_addon
    )

    data = sub_data.model_dump()
    data['calculated_amount'] = price_result['total']
    data['price_breakdown'] = json.dumps(price_result['breakdown'])
    data['submitted_at'] = datetime.now(timezone.utc).isoformat()

    if service['service_type'] == 'free_tier':
        data['payment_status'] = 'free'
        data['review_status'] = 'not_applicable'
        data['review_week'] = None
    else:
        data['payment_status'] = 'pending'
        data['review_status'] = 'queued'
        review_week = assign_review_week_date(datetime.now(timezone.utc))
        data['review_week'] = review_week.isoformat()
        await ensure_review_week(review_week)

    result = await supabase_post("submissions", data)
    submission = result[0] if result else data

    logger.info(f"[EMAIL MOCK] Submission confirmation sent to {data['email']}")
    logger.info(f"[EMAIL MOCK] New submission alert sent to {ADMIN_EMAIL}")

    return submission

@api_router.post("/submissions/free")
async def create_free_submission(sub_data: SubmissionCreate):
    if not sub_data.is_existing_client:
        raise HTTPException(status_code=400, detail="Free submissions are available for current clients only")

    data = sub_data.model_dump()
    data['calculated_amount'] = 0
    data['price_breakdown'] = json.dumps({"type": "free"})
    data['payment_status'] = 'free'
    data['review_status'] = 'not_applicable'
    data['review_week'] = None
    data['submitted_at'] = datetime.now(timezone.utc).isoformat()

    result = await supabase_post("submissions", data)
    logger.info(f"[EMAIL MOCK] Free tier update confirmation sent to {data['email']}")
    return result[0] if result else data

@api_router.post("/submissions/{submission_id}/files")
async def upload_submission_file(submission_id: str, file_name: str = "", file_size: int = 0, storage_path: str = ""):
    file_data = {
        "submission_id": submission_id,
        "file_name": file_name,
        "file_size": file_size,
        "file_type": file_name.split('.')[-1] if '.' in file_name else 'unknown',
        "storage_path": storage_path
    }
    result = await supabase_post("submission_files", file_data)
    return result[0] if result else file_data

# ============ PRICE CALCULATION ============

class PriceCalculateRequest(BaseModel):
    service_id: str
    athlete_count: int = 1
    is_existing_client: bool = False
    session_length: Optional[str] = None
    consultation_addon: bool = False

@api_router.post("/calculate-price")
async def calculate_price_endpoint(req: PriceCalculateRequest):
    services = await supabase_get("services", f"id=eq.{req.service_id}")
    if not services:
        raise HTTPException(status_code=404, detail="Service not found")
    return calculate_price(
        services[0], req.athlete_count, req.is_existing_client,
        req.session_length, req.consultation_addon
    )

# ============ PAYPAL PLACEHOLDER ============

class PayPalOrderCreate(BaseModel):
    submission_id: str
    amount: float

@api_router.post("/payments/create-order")
async def create_paypal_order(order_data: PayPalOrderCreate):
    mock_order_id = f"MOCK-{uuid.uuid4().hex[:12].upper()}"
    return {
        "order_id": mock_order_id,
        "status": "CREATED",
        "message": "PayPal integration placeholder - order created (mock)"
    }

@api_router.post("/payments/capture-order")
async def capture_paypal_order(order_id: str = "", submission_id: str = ""):
    mock_txn_id = f"TXN-{uuid.uuid4().hex[:12].upper()}"
    if submission_id:
        await supabase_patch(
            "submissions", f"id=eq.{submission_id}",
            {
                "payment_status": "paid",
                "paypal_order_id": order_id,
                "paypal_txn_id": mock_txn_id,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        )
    return {
        "txn_id": mock_txn_id,
        "status": "COMPLETED",
        "message": "Payment captured (mock)"
    }

# ============ CONTACT ============

class ContactCreate(BaseModel):
    name: str
    email: str
    subject: Optional[str] = ""
    message: str

@api_router.post("/contact")
async def create_contact(contact: ContactCreate):
    logger.info(f"[EMAIL MOCK] Contact form from {contact.name} ({contact.email}): {contact.subject}")
    return {"status": "sent", "message": "Your message has been sent. Brian will get back to you soon."}

# ============ AUTH ============

class LoginRequest(BaseModel):
    email: str
    password: str

@api_router.post("/auth/login")
async def login(req: LoginRequest):
    if req.email == ADMIN_EMAIL and req.password == ADMIN_PASSWORD:
        token = create_token(req.email, "admin")
        return {"token": token, "email": req.email, "role": "admin", "name": "Brian King"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@api_router.get("/auth/me")
async def get_me(admin=Depends(verify_admin)):
    return {"email": admin["email"], "role": admin["role"], "name": "Brian King"}

# ============ ADMIN ROUTES ============

@api_router.get("/admin/stats")
async def admin_stats(admin=Depends(verify_admin)):
    now = datetime.now(timezone.utc)
    week_ago = (now - timedelta(days=7)).isoformat()
    month_start = now.replace(day=1, hour=0, minute=0, second=0).isoformat()

    apps_week = await supabase_get("applications", f"submitted_at=gte.{week_ago}&select=id")
    subs_week = await supabase_get("submissions", f"submitted_at=gte.{week_ago}&select=id")
    paid_month = await supabase_get("submissions", f"payment_status=eq.paid&submitted_at=gte.{month_start}&select=calculated_amount")
    queued = await supabase_get("submissions", f"review_status=eq.queued&select=id")

    revenue = sum(float(s.get('calculated_amount', 0)) for s in paid_month)

    return {
        "applications_this_week": len(apps_week),
        "submissions_this_week": len(subs_week),
        "revenue_this_month": round(revenue, 2),
        "queue_depth": len(queued)
    }

@api_router.get("/admin/applications")
async def admin_list_applications(
    status: Optional[str] = None,
    admin=Depends(verify_admin)
):
    params = "order=submitted_at.desc"
    if status:
        params += f"&status=eq.{status}"
    return await supabase_get("applications", params)

@api_router.get("/admin/applications/{app_id}")
async def admin_get_application(app_id: str, admin=Depends(verify_admin)):
    data = await supabase_get("applications", f"id=eq.{app_id}")
    if not data:
        raise HTTPException(status_code=404, detail="Application not found")
    return data[0]

class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    admin_notes: Optional[str] = None

@api_router.patch("/admin/applications/{app_id}")
async def admin_update_application(app_id: str, update: ApplicationUpdate, admin=Depends(verify_admin)):
    data = {k: v for k, v in update.model_dump().items() if v is not None}
    data['updated_at'] = datetime.now(timezone.utc).isoformat()
    result = await supabase_patch("applications", f"id=eq.{app_id}", data)
    return result[0] if result else data

@api_router.get("/admin/submissions")
async def admin_list_submissions(
    service_type: Optional[str] = None,
    payment_status: Optional[str] = None,
    review_status: Optional[str] = None,
    admin=Depends(verify_admin)
):
    params = "order=submitted_at.desc"
    if service_type:
        params += f"&service_type=eq.{service_type}"
    if payment_status:
        params += f"&payment_status=eq.{payment_status}"
    if review_status:
        params += f"&review_status=eq.{review_status}"
    return await supabase_get("submissions", params)

@api_router.get("/admin/submissions/{sub_id}")
async def admin_get_submission(sub_id: str, admin=Depends(verify_admin)):
    data = await supabase_get("submissions", f"id=eq.{sub_id}")
    if not data:
        raise HTTPException(status_code=404, detail="Submission not found")
    submission = data[0]
    files = await supabase_get("submission_files", f"submission_id=eq.{sub_id}")
    submission['files'] = files
    return submission

class SubmissionUpdate(BaseModel):
    review_status: Optional[str] = None
    admin_notes: Optional[str] = None
    payment_status: Optional[str] = None

@api_router.patch("/admin/submissions/{sub_id}")
async def admin_update_submission(sub_id: str, update: SubmissionUpdate, admin=Depends(verify_admin)):
    data = {k: v for k, v in update.model_dump().items() if v is not None}
    data['updated_at'] = datetime.now(timezone.utc).isoformat()
    if update.review_status == 'completed':
        data['completed_at'] = datetime.now(timezone.utc).isoformat()
    result = await supabase_patch("submissions", f"id=eq.{sub_id}", data)
    return result[0] if result else data

@api_router.post("/admin/submissions/{sub_id}/complete")
async def admin_complete_submission(sub_id: str, admin=Depends(verify_admin)):
    data = {
        "review_status": "completed",
        "completed_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    result = await supabase_patch("submissions", f"id=eq.{sub_id}", data)
    submission = result[0] if result else {}
    logger.info(f"[EMAIL MOCK] Review complete notification sent to {submission.get('email', 'unknown')}")
    return {"status": "completed", "submission": submission}

@api_router.get("/admin/queue")
async def admin_queue(week: Optional[str] = None, admin=Depends(verify_admin)):
    if week:
        target = week
    else:
        target = get_monday_of_week(datetime.now(timezone.utc)).isoformat()

    submissions = await supabase_get(
        "submissions",
        f"review_week=eq.{target}&order=submitted_at.asc"
    )
    week_data = await supabase_get("review_weeks", f"week_start=eq.{target}")
    week_info = week_data[0] if week_data else {"week_start": target, "capacity": 20, "current_count": len(submissions)}

    return {"week": week_info, "submissions": submissions}

# Admin Services CRUD
@api_router.get("/admin/services")
async def admin_list_services(admin=Depends(verify_admin)):
    return await supabase_get("services", "order=sort_order.asc")

@api_router.post("/admin/services")
async def admin_create_service(service_data: dict, admin=Depends(verify_admin)):
    result = await supabase_post("services", service_data)
    return result[0] if result else service_data

@api_router.patch("/admin/services/{service_id}")
async def admin_update_service(service_id: str, service_data: dict, admin=Depends(verify_admin)):
    service_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    result = await supabase_patch("services", f"id=eq.{service_id}", service_data)
    return result[0] if result else service_data

@api_router.delete("/admin/services/{service_id}")
async def admin_delete_service(service_id: str, admin=Depends(verify_admin)):
    result = await supabase_patch("services", f"id=eq.{service_id}", {"is_active": False})
    return {"status": "deactivated"}

@api_router.get("/admin/recent-activity")
async def admin_recent_activity(admin=Depends(verify_admin)):
    apps = await supabase_get("applications", "order=submitted_at.desc&limit=5")
    subs = await supabase_get("submissions", "order=submitted_at.desc&limit=5")
    activity = []
    for a in apps:
        activity.append({
            "type": "application",
            "id": a['id'],
            "title": f"New application from {a['gym_name']}",
            "subtitle": a['contact_name'],
            "status": a['status'],
            "timestamp": a['submitted_at']
        })
    for s in subs:
        activity.append({
            "type": "submission",
            "id": s['id'],
            "title": f"Submission from {s['gym_name']}",
            "subtitle": f"{s['service_type']} - ${s['calculated_amount']}",
            "status": s['review_status'],
            "timestamp": s['submitted_at']
        })
    activity.sort(key=lambda x: x['timestamp'] or '', reverse=True)
    return activity[:10]

# Review week helper
async def ensure_review_week(week_start):
    existing = await supabase_get("review_weeks", f"week_start=eq.{week_start.isoformat()}")
    if not existing:
        await supabase_post("review_weeks", {
            "week_start": week_start.isoformat(),
            "capacity": 20,
            "current_count": 1
        })
    else:
        new_count = (existing[0].get('current_count', 0) or 0) + 1
        await supabase_patch(
            "review_weeks", f"week_start=eq.{week_start.isoformat()}",
            {"current_count": new_count}
        )

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
