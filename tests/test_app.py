import pytest
from flask import json
from app import create_app
from config import TestConfig

@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    app = create_app(TestConfig)  # Pass TestConfig when creating the app
    return app

@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()


@pytest.fixture
def init_database():
    # Set up the database before tests run
    Media.objects.delete()  # Clear the Media collection before each test
    
    # You can also add some predefined data here if needed
    yield

    # Teardown logic after tests
    Media.objects.delete()

def test_home(client):
    response = client.get('/')
    assert response.status_code == 200
    assert b"Welcome to Kodi Kontroller API" in response.data

def test_add_media(client, init_database):
    # Test adding a new media
    media_data = json.dumps({
        "name": "Test Media",
        "description": "Test Description",
        "path": "/test/path",
        "url": "http://example.com",
        "type": "video"
    })
    response = client.post('/media/add', data=media_data, content_type='application/json')
    assert response.status_code == 201
    assert b"Media added successfully" in response.data

def test_get_media(client, init_database):
    # First, insert a media item
    Media(name="Test Media", description="Test", path="/path", url="http://url", type="video").save()

    # Now, retrieve the media item
    response = client.get('/media')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) > 0  # Ensure the data list is not empty

def test_update_media(client, init_database):
    # First, insert a media item
    media = Media(name="Update Media", description="Before Update", path="/update/path", url="http://update", type="video").save()

    # Attempt to update the media item
    update_data = json.dumps({"description": "After Update"})
    response = client.put(f'/media/update/{media.id}', data=update_data, content_type='application/json')
    assert response.status_code == 200
    assert b"Media updated successfully" in response.data

def test_delete_media(client, init_database):
    # First, insert a media item
    media = Media(name="Delete Media", description="To be deleted", path="/delete/path", url="http://delete", type="video").save()

    # Now, delete the media item
    response = client.delete(f'/media/delete/{media.id}')
    assert response.status_code == 200
    assert b"Media deleted successfully" in response.data
