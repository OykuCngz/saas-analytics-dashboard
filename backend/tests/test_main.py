from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_get_stats():
    response = client.get("/stats")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
