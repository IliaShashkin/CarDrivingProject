import requests
import sys

def health_check():
    try:
        # Test basic server response
        response = requests.get("http://localhost:9501/leaderboard")
        if response.status_code != 200:
            return False

        # Test authentication
        response = requests.post(
            "http://localhost:9501/authenticate",
            data={'password': 'memgame'}
        )
        if response.status_code != 200 or response.json()['status'] != 'success':
            return False

        return True
    except Exception as e:
        print(f"Health check failed: {e}", file=sys.stderr)
        return False

if __name__ == '__main__':
    if not health_check():
        sys.exit(1)
    sys.exit(0)