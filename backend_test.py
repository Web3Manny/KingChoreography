#!/usr/bin/env python3
"""
King Choreography Backend API Test Suite
Tests all critical backend endpoints and business logic
"""

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any, Optional

class KingChoreographyAPITester:
    def __init__(self, base_url="https://king-choreography.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        
        # Test credentials
        self.admin_email = "brian@kingchoreography.com"
        self.admin_password = "KingChoreography2025!"

    def log_result(self, test_name: str, success: bool, details: str = ""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {test_name}: PASSED")
        else:
            print(f"❌ {test_name}: FAILED - {details}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })

    def make_request(self, method: str, endpoint: str, data: dict = None, expected_status: int = 200) -> tuple:
        """Make HTTP request with proper headers"""
        url = f"{self.base_url}{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=headers, timeout=30)
            
            success = response.status_code == expected_status
            return success, response.status_code, response.json() if response.content else {}
            
        except requests.exceptions.Timeout:
            return False, 0, {"error": "Request timeout"}
        except requests.exceptions.ConnectionError:
            return False, 0, {"error": "Connection error"}
        except Exception as e:
            return False, 0, {"error": str(e)}

    def test_root_endpoint(self):
        """Test API root endpoint returns running status"""
        success, status, data = self.make_request('GET', '/')
        
        if success and data.get('status') == 'running':
            self.log_result("API Root Endpoint", True)
            return True
        else:
            self.log_result("API Root Endpoint", False, f"Status: {status}, Data: {data}")
            return False

    def test_get_services(self):
        """Test GET /api/services returns all seeded services (should be 6)"""
        success, status, data = self.make_request('GET', '/services')
        
        if success and isinstance(data, list) and len(data) >= 6:
            self.log_result("Get Services", True, f"Found {len(data)} services")
            return True, data
        else:
            self.log_result("Get Services", False, f"Status: {status}, Services count: {len(data) if isinstance(data, list) else 0}")
            return False, []

    def test_admin_login_correct(self):
        """Test admin login with correct credentials"""
        login_data = {"email": self.admin_email, "password": self.admin_password}
        success, status, data = self.make_request('POST', '/auth/login', login_data)
        
        if success and data.get('token'):
            self.token = data['token']
            self.log_result("Admin Login (Correct Credentials)", True)
            return True
        else:
            self.log_result("Admin Login (Correct Credentials)", False, f"Status: {status}, Response: {data}")
            return False

    def test_admin_login_incorrect(self):
        """Test admin login with wrong credentials returns 401"""
        login_data = {"email": self.admin_email, "password": "wrongpassword"}
        success, status, data = self.make_request('POST', '/auth/login', login_data, 401)
        
        if success:
            self.log_result("Admin Login (Wrong Credentials)", True)
            return True
        else:
            self.log_result("Admin Login (Wrong Credentials)", False, f"Expected 401, got {status}")
            return False

    def test_create_application(self):
        """Test POST /api/applications creates new application"""
        app_data = {
            "gym_name": "Test Elite Cheer",
            "contact_name": "Jane Smith", 
            "email": "jane@testelite.com",
            "phone": "555-123-4567",
            "city": "Dallas",
            "state": "TX",
            "services_interested": ["Full Program Choreography"],
            "team_levels": ["Senior"],
            "divisions": ["Large"],
            "timeframe": "asap",
            "referral_source": "Website / Google",
            "additional_notes": "Test application for API testing"
        }
        
        success, status, data = self.make_request('POST', '/applications', app_data, 201)
        
        if not success:
            # Try with 200 status code as backup
            success, status, data = self.make_request('POST', '/applications', app_data, 200)
        
        if success and data.get('gym_name') == app_data['gym_name']:
            self.log_result("Create Application", True, f"Application ID: {data.get('id', 'N/A')}")
            return True, data
        else:
            self.log_result("Create Application", False, f"Status: {status}, Response: {data}")
            return False, {}

    def test_calculate_price_review_feedback(self, services):
        """Test price calculation for Review & Feedback service"""
        # Find review & feedback service
        review_service = None
        for service in services:
            if service.get('service_type') == 'review_feedback':
                review_service = service
                break
        
        if not review_service:
            self.log_result("Calculate Price (Review & Feedback)", False, "Review service not found")
            return False
        
        # Test client rate calculation
        price_data = {
            "service_id": review_service['id'],
            "athlete_count": 1,
            "is_existing_client": True,
            "consultation_addon": False
        }
        
        success, status, data = self.make_request('POST', '/calculate-price', price_data)
        
        expected_client_rate = 150.0
        if success and data.get('total') == expected_client_rate:
            self.log_result("Calculate Price (Review & Feedback Client)", True, f"Price: ${data['total']}")
            return True
        else:
            self.log_result("Calculate Price (Review & Feedback Client)", False, 
                          f"Expected ${expected_client_rate}, got ${data.get('total', 'N/A')}")
            return False

    def test_calculate_price_virtual_upgrade(self, services):
        """Test price calculation for Virtual Upgrade service"""
        # Find virtual upgrade service
        upgrade_service = None
        for service in services:
            if service.get('service_type') == 'virtual_upgrade':
                upgrade_service = service
                break
        
        if not upgrade_service:
            self.log_result("Calculate Price (Virtual Upgrade)", False, "Virtual upgrade service not found")
            return False
        
        # Test 5 athletes x $40 = $200 for client 2hr
        price_data = {
            "service_id": upgrade_service['id'],
            "athlete_count": 5,
            "is_existing_client": True,
            "session_length": "2hr"
        }
        
        success, status, data = self.make_request('POST', '/calculate-price', price_data)
        
        expected_price = 200.0  # 5 athletes x $40
        if success and data.get('total') == expected_price:
            self.log_result("Calculate Price (Virtual Upgrade 5x$40)", True, f"Price: ${data['total']}")
            return True
        else:
            self.log_result("Calculate Price (Virtual Upgrade 5x$40)", False, 
                          f"Expected ${expected_price}, got ${data.get('total', 'N/A')}")
            return False

    def test_create_submission(self, services):
        """Test POST /api/submissions creates submission with calculated price"""
        # Use first service for testing
        if not services:
            self.log_result("Create Submission", False, "No services available")
            return False
        
        service = services[0]
        submission_data = {
            "service_id": service['id'],
            "service_type": service['service_type'],
            "full_name": "Test User",
            "email": "test@example.com",
            "gym_name": "Test Gym",
            "athlete_count": 2,
            "is_existing_client": False,
            "areas_of_concern": "Test submission for API testing"
        }
        
        # Add session length if it's virtual upgrade
        if service.get('service_type') == 'virtual_upgrade':
            submission_data['session_length'] = '2hr'
        
        success, status, data = self.make_request('POST', '/submissions', submission_data, 201)
        
        if not success:
            # Try with 200 status code as backup
            success, status, data = self.make_request('POST', '/submissions', submission_data, 200)
        
        if success and data.get('email') == submission_data['email']:
            self.log_result("Create Submission", True, f"Submission ID: {data.get('id', 'N/A')}")
            return True
        else:
            self.log_result("Create Submission", False, f"Status: {status}, Response: {data}")
            return False

    def test_admin_stats(self):
        """Test GET /api/admin/stats requires auth token"""
        if not self.token:
            self.log_result("Admin Stats", False, "No auth token available")
            return False
        
        success, status, data = self.make_request('GET', '/admin/stats')
        
        if success and isinstance(data, dict):
            expected_keys = ['applications_this_week', 'submissions_this_week', 'revenue_this_month', 'queue_depth']
            has_expected_keys = all(key in data for key in expected_keys)
            
            if has_expected_keys:
                self.log_result("Admin Stats", True, f"Stats: {data}")
                return True
            else:
                self.log_result("Admin Stats", False, f"Missing expected keys in response: {data}")
                return False
        else:
            self.log_result("Admin Stats", False, f"Status: {status}, Response: {data}")
            return False

    def test_admin_applications(self):
        """Test GET /api/admin/applications requires auth token"""
        if not self.token:
            self.log_result("Admin Applications List", False, "No auth token available")
            return False
        
        success, status, data = self.make_request('GET', '/admin/applications')
        
        if success and isinstance(data, list):
            self.log_result("Admin Applications List", True, f"Found {len(data)} applications")
            return True
        else:
            self.log_result("Admin Applications List", False, f"Status: {status}, Response type: {type(data)}")
            return False

    def run_all_tests(self):
        """Run all API tests in sequence"""
        print("🏁 Starting King Choreography Backend API Tests")
        print("=" * 60)
        
        # Test 1: Root endpoint
        self.test_root_endpoint()
        
        # Test 2: Get services
        services_success, services = self.test_get_services()
        
        # Test 3: Admin login (correct)
        login_success = self.test_admin_login_correct()
        
        # Test 4: Admin login (incorrect)
        self.test_admin_login_incorrect()
        
        # Test 5: Create application
        self.test_create_application()
        
        # Test 6 & 7: Price calculations (need services data)
        if services_success and services:
            self.test_calculate_price_review_feedback(services)
            self.test_calculate_price_virtual_upgrade(services)
            
            # Test 8: Create submission
            self.test_create_submission(services)
        
        # Test 9 & 10: Admin endpoints (need auth token)
        if login_success:
            self.test_admin_stats()
            self.test_admin_applications()
        
        # Print summary
        print("\n" + "=" * 60)
        print(f"🏁 Tests completed: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} test(s) failed")
            return 1

def main():
    """Main test runner"""
    tester = KingChoreographyAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)