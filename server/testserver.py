import requests
import unittest

class TestLeaderboardServer(unittest.TestCase):
    def setUp(self):
        self.base_url = "http://localhost:9500"
        self.test_data = {
            'name': 'TestPlayer',
            'score': 100
        }
        
    def test_1_authenticate(self):
        # Test invalid password
        response = requests.post(
            f"{self.base_url}/authenticate",
            data={'password': 'wrong'}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'error')

        # Test valid password
        response = requests.post(
            f"{self.base_url}/authenticate",
            data={'password': 'memgame'}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'success')
        
    def test_2_add_leaderboard_entry(self):
        # Reset/clean leaderboard first
        response = requests.delete(
            f"{self.base_url}/leaderboard",
            json={'name': 'TestPlayer'}
        )
        
        # Add test entry
        response = requests.post(
            f"{self.base_url}/leaderboard", 
            json=self.test_data
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'success')
        
    def test_3_get_leaderboard(self):
        # Make sure test data exists first
        requests.post(
            f"{self.base_url}/leaderboard", 
            json=self.test_data
        )
        
        # Now test getting the leaderboard
        response = requests.get(f"{self.base_url}/leaderboard")
        self.assertEqual(response.status_code, 200)
        
        # Parse JSON response
        data = response.json()
        
        # Check structure - should be a list of objects
        self.assertIsInstance(data, list)
        
        # Find our test player
        test_player = next((item for item in data if item["name"] == "TestPlayer"), None)
        
        # Check that test player exists and has the correct score
        self.assertIsNotNone(test_player)
        self.assertEqual(test_player["score"], 100)
        
        # Check that IP address is not included
        self.assertNotIn("ip_address", test_player)
        
    def test_4_delete_score(self):
        # Test deleting existing entry
        response = requests.delete(
            f"{self.base_url}/leaderboard",
            json={'name': 'TestPlayer'}
        )
        self.assertEqual(response.status_code, 200)
        
        # Verify deletion
        response = requests.get(f"{self.base_url}/leaderboard")
        data = response.json()
        test_player = next((item for item in data if item["name"] == "TestPlayer"), None)
        self.assertIsNone(test_player)
        
        # Test deleting non-existent entry
        response = requests.delete(
            f"{self.base_url}/leaderboard",
            json={'name': 'NonExistentPlayer'}
        )
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__': 
    unittest.main()