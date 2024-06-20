from flask import Flask
from .extensions import db
from celery import Celery
from mongoengine import connect
def make_celery(app):
    celery = Celery(app.import_name, broker=app.config['CELERY_BROKER_URL'])
    celery.conf.update(app.config)
    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)
    celery.Task = ContextTask
    return celery

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')  # Load configuration

    # Connect to MongoDB
    connect(
        db=app.config['MONGODB_DB'],
        host=app.config['MONGODB_HOST'],
        port=app.config['MONGODB_PORT'],
        username=app.config['MONGODB_USERNAME'],
        password=app.config['MONGODB_PASSWORD'],
        authentication_source=app.config['MONGODB_AUTH_SOURCE']
    )

    # Celery
    celery = make_celery(app)

    # Import blueprints
    from .routes import main
    app.register_blueprint(main)

    return app

def send_to_kodi(host, media):
    # Base URL construction
    base_url = f"http://{host.ip}:{host.port}/api/"
    
    # Determine the type of media and construct the API endpoint
    if media.type == 'video':
        url = f"{base_url}play_video"
    elif media.type == 'audio':
        url = f"{base_url}play_audio"
    elif media.type == 'youtube':
        url = f"{base_url}play_youtube"
    elif media.type == 'image':
        url = f"{base_url}display_image"
        payload = {'url': media.url, 'duration': media.duration}
    else:
        url = f"{base_url}play_media"  # A generic endpoint if applicable
        payload = {'url': media.url}
    
    # Send request to the specific host's endpoint
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Failed to send media to Kodi: {e}")
        return None
