"""
Comprehensive API tests for King Choreography Next.js migration.
Tests the full API chain: Browser -> Ingress -> FastAPI Proxy -> Next.js API Routes -> Supabase

Test coverage:
- Public services API (GET, filtering)
- Applications CRUD
- Submissions with pricing calculations
- Free tier submissions
- Pricing engine API
- Authentication (login success/failure)
- Admin protected endpoints (stats, applications, submissions, queue, services, recent-activity)
- Payment endpoints (mocked)
- Contact form
"""

import pytest
import requests
import os
import time
from typing import Optional

# Use the preview URL (external) to test the full chain
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://king-choreo-next.preview.emergentagent.com').rstrip('/')

# Admin credentials
ADMIN_EMAIL = "brian@kingchoreography.com"
ADMIN_PASSWORD = "KingChoreography2025!"


class TestPublicServices:
    """Tests for public services endpoint"""
    
    def test_get_all_services_returns_6(self):
        """GET /api/services returns 6 services (3 in_person + 3 virtual)"""
        response = requests.get(f"{BASE_URL}/api/services")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        assert len(data) == 6, f"Expected 6 services, got {len(data)}"
        print(f"✓ GET /api/services returned {len(data)} services")
    
    def test_get_virtual_services_returns_3(self):
        """GET /api/services?category=virtual returns 3 virtual services"""
        response = requests.get(f"{BASE_URL}/api/services?category=virtual")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        assert len(data) == 3, f"Expected 3 virtual services, got {len(data)}"
        for svc in data:
            assert svc.get('category') == 'virtual', f"Service {svc.get('name')} should be virtual"
        print(f"✓ GET /api/services?category=virtual returned {len(data)} virtual services")
    
    def test_get_inperson_services_returns_3(self):
        """GET /api/services?category=in_person returns 3 in_person services"""
        response = requests.get(f"{BASE_URL}/api/services?category=in_person")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 3, f"Expected 3 in_person services, got {len(data)}"
        print(f"✓ GET /api/services?category=in_person returned {len(data)} services")


class TestApplications:
    """Tests for application submission"""
    
    def test_create_application_with_status_new(self):
        """POST /api/applications creates a new application with status 'new'"""
        payload = {
            "gym_name": "TEST_GymPytest123",
            "contact_name": "Test Pytest User",
            "email": f"testpytest{int(time.time())}@example.com",
            "phone": "555-123-4567",
            "city": "Los Angeles",
            "state": "CA",
            "services_interested": ["choreography", "training"],
            "team_levels": ["Level 5"],
            "divisions": ["Small Senior"],
            "timeframe": "asap",  # Valid constraint value (asap, next_season)
            "referral_source": "website",
            "additional_notes": "Test application from pytest"
        }
        response = requests.post(f"{BASE_URL}/api/applications", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        # Verify status is 'new'
        assert data.get('status') == 'new', f"Expected status 'new', got {data.get('status')}"
        # Verify submitted_at is set
        assert 'submitted_at' in data, "submitted_at should be set"
        # Verify required fields are persisted
        assert data.get('gym_name') == payload['gym_name']
        assert data.get('email') == payload['email']
        
        # Store ID for potential cleanup
        TestApplications.created_app_id = data.get('id')
        print(f"✓ POST /api/applications created application with status 'new', id: {data.get('id')}")
        return data.get('id')


class TestSubmissions:
    """Tests for submissions with pricing calculations"""
    
    @pytest.fixture(autouse=True)
    def get_virtual_services(self):
        """Get virtual services to use their IDs for testing"""
        response = requests.get(f"{BASE_URL}/api/services?category=virtual")
        if response.status_code == 200:
            self.virtual_services = response.json()
        else:
            self.virtual_services = []
    
    def test_submission_review_feedback_client_rate(self):
        """POST /api/submissions with review_feedback creates submission with $150 for client"""
        # First find the review_feedback service
        response = requests.get(f"{BASE_URL}/api/services?category=virtual")
        services = response.json()
        review_feedback_svc = next((s for s in services if s.get('service_type') == 'review_feedback'), None)
        
        if not review_feedback_svc:
            pytest.skip("Review & Feedback service not found")
        
        # Use schema-compatible field names (full_name, not contact_name)
        # Note: video_url is not a valid schema field - excluded
        payload = {
            "service_id": review_feedback_svc['id'],
            "service_type": "review_feedback",
            "gym_name": "TEST_ReviewGymClient",
            "full_name": "Test Review User",
            "email": f"testreviewclient{int(time.time())}@example.com",
            "phone": "555-111-2222",
            "is_existing_client": True,  # Client rate = $150
            "athlete_count": 1
        }
        response = requests.post(f"{BASE_URL}/api/submissions", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        # Verify calculated_amount is $150 for client
        assert float(data.get('calculated_amount', 0)) == 150.0, f"Expected $150, got ${data.get('calculated_amount')}"
        assert data.get('payment_status') == 'pending'
        assert data.get('review_status') == 'queued'
        
        TestSubmissions.created_sub_id = data.get('id')
        print(f"✓ Review feedback client rate submission: $150 (id: {data.get('id')})")
    
    def test_submission_review_feedback_nonclient_rate(self):
        """POST /api/submissions with review_feedback creates submission with $250 for non-client"""
        response = requests.get(f"{BASE_URL}/api/services?category=virtual")
        services = response.json()
        review_feedback_svc = next((s for s in services if s.get('service_type') == 'review_feedback'), None)
        
        if not review_feedback_svc:
            pytest.skip("Review & Feedback service not found")
        
        # Use schema-compatible field names
        payload = {
            "service_id": review_feedback_svc['id'],
            "service_type": "review_feedback",
            "gym_name": "TEST_ReviewNonClient",
            "full_name": "Test NonClient User",
            "email": f"testncreview{int(time.time())}@example.com",
            "phone": "555-111-3333",
            "is_existing_client": False,  # Non-client rate = $250
            "athlete_count": 1
        }
        response = requests.post(f"{BASE_URL}/api/submissions", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        # Verify calculated_amount is $250 for non-client
        assert float(data.get('calculated_amount', 0)) == 250.0, f"Expected $250, got ${data.get('calculated_amount')}"
        print(f"✓ Review feedback non-client rate submission: $250 (id: {data.get('id')})")


class TestFreeSubmissions:
    """Tests for free tier submissions"""
    
    @pytest.fixture(autouse=True)
    def get_free_service(self):
        """Get free tier service"""
        response = requests.get(f"{BASE_URL}/api/services?category=virtual")
        if response.status_code == 200:
            services = response.json()
            self.free_service = next((s for s in services if s.get('service_type') == 'free_tier'), None)
    
    def test_free_submission_only_for_existing_client(self):
        """POST /api/submissions/free only works for is_existing_client=true"""
        # Use schema-compatible field names
        payload = {
            "gym_name": "TEST_FreeClientGym",
            "full_name": "Test Free Client",
            "email": f"testfreeclient{int(time.time())}@example.com",
            "phone": "555-222-3333",
            "is_existing_client": True  # Should work
        }
        response = requests.post(f"{BASE_URL}/api/submissions/free", json=payload)
        assert response.status_code == 200, f"Expected 200 for client, got {response.status_code}: {response.text}"
        data = response.json()
        assert float(data.get('calculated_amount', 0)) == 0, "Free submission should be $0"
        assert data.get('payment_status') == 'free'
        print(f"✓ Free submission accepted for existing client (id: {data.get('id')})")
    
    def test_free_submission_rejects_non_client(self):
        """POST /api/submissions/free rejects non-clients with 400"""
        # Use schema-compatible field names
        payload = {
            "gym_name": "TEST_FreeNonClientGym",
            "full_name": "Test Free NonClient",
            "email": f"testfreenonclient{int(time.time())}@example.com",
            "phone": "555-222-4444",
            "is_existing_client": False  # Should be rejected
        }
        response = requests.post(f"{BASE_URL}/api/submissions/free", json=payload)
        assert response.status_code == 400, f"Expected 400 for non-client, got {response.status_code}"
        data = response.json()
        assert 'error' in data, "Should return error message"
        print(f"✓ Free submission correctly rejected non-client with 400")


class TestPriceCalculation:
    """Tests for pricing engine API"""
    
    def test_calculate_price_virtual_upgrade(self):
        """POST /api/calculate-price returns correct pricing for virtual_upgrade"""
        # First get virtual upgrade service
        response = requests.get(f"{BASE_URL}/api/services?category=virtual")
        services = response.json()
        upgrade_svc = next((s for s in services if s.get('service_type') == 'virtual_upgrade'), None)
        
        if not upgrade_svc:
            pytest.skip("Virtual Upgrade service not found")
        
        payload = {
            "service_id": upgrade_svc['id'],
            "athlete_count": 5,
            "is_existing_client": True,
            "session_length": "2hr"
        }
        response = requests.post(f"{BASE_URL}/api/calculate-price", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        # 5 athletes x $40 = $200 for client 2hr
        expected_total = 200.0
        assert data.get('total') == expected_total, f"Expected ${expected_total}, got ${data.get('total')}"
        assert 'breakdown' in data
        print(f"✓ Price calculation: 5 athletes x $40 = ${data.get('total')}")


class TestAuthentication:
    """Tests for authentication endpoints"""
    
    def test_login_with_correct_credentials(self):
        """POST /api/auth/login with correct credentials returns JWT token"""
        payload = {
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        }
        response = requests.post(f"{BASE_URL}/api/auth/login", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        # Verify token is returned
        assert 'token' in data, "Response should contain token"
        assert isinstance(data['token'], str) and len(data['token']) > 0, "Token should be a non-empty string"
        assert data.get('email') == ADMIN_EMAIL
        assert data.get('role') == 'admin'
        
        # Store token for other tests
        TestAuthentication.admin_token = data['token']
        print(f"✓ Login successful, token received (role: {data.get('role')})")
        return data['token']
    
    def test_login_with_wrong_credentials(self):
        """POST /api/auth/login with wrong credentials returns 401"""
        payload = {
            "email": "wrong@example.com",
            "password": "WrongPassword123"
        }
        response = requests.post(f"{BASE_URL}/api/auth/login", json=payload)
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        data = response.json()
        assert 'error' in data, "Should return error message"
        print(f"✓ Invalid login correctly rejected with 401")


class TestAdminEndpoints:
    """Tests for admin protected endpoints"""
    
    @pytest.fixture(autouse=True)
    def get_admin_token(self):
        """Get admin token before each test"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            self.token = response.json().get('token')
            self.headers = {"Authorization": f"Bearer {self.token}"}
        else:
            pytest.skip("Could not get admin token")
    
    def test_admin_stats(self):
        """GET /api/admin/stats returns stats object"""
        response = requests.get(f"{BASE_URL}/api/admin/stats", headers=self.headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        # Verify stats object structure
        assert 'applications_this_week' in data, "Should have applications_this_week"
        assert 'submissions_this_week' in data, "Should have submissions_this_week"
        assert 'revenue_this_month' in data, "Should have revenue_this_month"
        assert 'queue_depth' in data, "Should have queue_depth"
        
        # Values should be numeric
        assert isinstance(data['applications_this_week'], int), "applications_this_week should be int"
        assert isinstance(data['submissions_this_week'], int), "submissions_this_week should be int"
        assert isinstance(data['queue_depth'], int), "queue_depth should be int"
        
        print(f"✓ Admin stats: apps={data['applications_this_week']}, subs={data['submissions_this_week']}, revenue=${data['revenue_this_month']}, queue={data['queue_depth']}")
    
    def test_admin_stats_unauthorized(self):
        """GET /api/admin/stats without token returns 401"""
        response = requests.get(f"{BASE_URL}/api/admin/stats")
        assert response.status_code == 401, f"Expected 401 without token, got {response.status_code}"
        print(f"✓ Admin stats correctly requires authentication")
    
    def test_admin_applications_list(self):
        """GET /api/admin/applications returns list of applications"""
        response = requests.get(f"{BASE_URL}/api/admin/applications", headers=self.headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert isinstance(data, list), "Should return a list"
        # Should have at least our test application
        print(f"✓ Admin applications returned {len(data)} items")
    
    def test_admin_submissions_list(self):
        """GET /api/admin/submissions returns list of submissions"""
        response = requests.get(f"{BASE_URL}/api/admin/submissions", headers=self.headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert isinstance(data, list), "Should return a list"
        print(f"✓ Admin submissions returned {len(data)} items")
    
    def test_admin_queue(self):
        """GET /api/admin/queue returns week info and submissions"""
        response = requests.get(f"{BASE_URL}/api/admin/queue", headers=self.headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert 'week' in data, "Should have week info"
        assert 'submissions' in data, "Should have submissions list"
        assert isinstance(data['submissions'], list)
        print(f"✓ Admin queue: week={data['week'].get('week_start')}, submissions={len(data['submissions'])}")
    
    def test_admin_services(self):
        """GET /api/admin/services returns all services including inactive"""
        response = requests.get(f"{BASE_URL}/api/admin/services", headers=self.headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert isinstance(data, list), "Should return a list"
        # Admin endpoint should return at least as many as public (might include inactive)
        assert len(data) >= 6, f"Expected at least 6 services, got {len(data)}"
        print(f"✓ Admin services returned {len(data)} items (includes inactive)")
    
    def test_admin_recent_activity(self):
        """GET /api/admin/recent-activity returns activity feed"""
        response = requests.get(f"{BASE_URL}/api/admin/recent-activity", headers=self.headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert isinstance(data, list), "Should return a list"
        # Each activity item should have type, title, timestamp
        if len(data) > 0:
            item = data[0]
            assert 'type' in item, "Activity should have type"
            assert 'title' in item, "Activity should have title"
            assert 'timestamp' in item, "Activity should have timestamp"
        print(f"✓ Admin recent-activity returned {len(data)} items")
    
    def test_patch_application_status(self):
        """PATCH /api/admin/applications/{id} updates application status"""
        # First create an application to update
        app_payload = {
            "gym_name": "TEST_PatchGym",
            "contact_name": "Patch Test User",
            "email": "testpatch@example.com",
            "phone": "555-999-0000",
            "city": "Dallas",
            "state": "TX",
            "services_interested": ["choreography"],
            "team_levels": ["Level 6"],
            "divisions": ["Large Senior"],
            "timeframe": "asap"
        }
        create_response = requests.post(f"{BASE_URL}/api/applications", json=app_payload)
        assert create_response.status_code == 200
        app_id = create_response.json().get('id')
        
        if not app_id:
            pytest.skip("Could not create application to test PATCH")
        
        # Now update the status
        update_payload = {"status": "contacted"}
        response = requests.patch(f"{BASE_URL}/api/admin/applications/{app_id}", json=update_payload, headers=self.headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert data.get('status') == 'contacted', f"Expected status 'contacted', got {data.get('status')}"
        print(f"✓ PATCH application {app_id}: status updated to 'contacted'")


class TestPayments:
    """Tests for payment endpoints (mocked)"""
    
    def test_create_order_returns_mock_order_id(self):
        """POST /api/payments/create-order returns mock order_id"""
        payload = {"amount": 150, "currency": "USD"}
        response = requests.post(f"{BASE_URL}/api/payments/create-order", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert 'order_id' in data, "Should return order_id"
        assert data['order_id'].startswith('MOCK-'), f"Order ID should be mocked: {data['order_id']}"
        assert data.get('status') == 'CREATED'
        print(f"✓ Create order returned mock order_id: {data['order_id']}")
    
    def test_capture_order_returns_mock_txn_id(self):
        """POST /api/payments/capture-order returns mock txn_id"""
        payload = {"order_id": "MOCK-TEST123"}
        response = requests.post(f"{BASE_URL}/api/payments/capture-order", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert 'txn_id' in data, "Should return txn_id"
        assert data['txn_id'].startswith('TXN-'), f"Txn ID should be mocked: {data['txn_id']}"
        assert data.get('status') == 'COMPLETED'
        print(f"✓ Capture order returned mock txn_id: {data['txn_id']}")


class TestContact:
    """Tests for contact form"""
    
    def test_contact_returns_success(self):
        """POST /api/contact returns success response"""
        payload = {
            "name": "Test Contact User",
            "email": "testcontact@example.com",
            "subject": "Test Inquiry",
            "message": "This is a test message from pytest."
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert data.get('status') == 'sent', f"Expected status 'sent', got {data.get('status')}"
        assert 'message' in data
        print(f"✓ Contact form submission successful")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
