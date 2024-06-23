from mongoengine import Document, StringField, DateTimeField, BooleanField, IntField, ListField, ReferenceField
from datetime import datetime

class Media(Document):
    name = StringField(required=True, unique=True)
    description = StringField()
    type = StringField(required=True, choices=('audio', 'video', 'image', 'youtube', 'videobg'))
    path = StringField()
    url = StringField(unique=True)
    duration = IntField()

class Group(Document):
    name = StringField(required=True)
    description = StringField()
    members = ListField(ReferenceField('Host'))  # List of host references

class Host(Document):
    name = StringField(required=True)
    ip = StringField(required=True)
    port = IntField(required=True)
    username = StringField()
    password = StringField()
    group = StringField()  # Temporarily removed for now
    cec = StringField()  # Consumer Electronics Control (optional)
    status = StringField(required=True, choices=('new', 'active', 'inactive', 'error'))
    schedule = ReferenceField('Schedule')  # Link to a Schedule if applicable
    os = StringField()  # Operating system
    location = StringField()  # Physical or logical location
    defaultImage = ReferenceField('Media')  # Reference to a Media document for default image
    last_inactive_time = DateTimeField(default=None)
    player = StringField(default='')  # Adds a player attribute to store the media info

class Schedule(Document):
    name = StringField(required=True)
    description = StringField()
    startDate = DateTimeField(required=True)
    endDate = DateTimeField(required=True)
    playlist = ListField(ReferenceField('Playlist'))  # List of media references
    shuffle = BooleanField(default=False)

class Playlist(Document):
    name = StringField(required=True)
    description = StringField()
    createDate = DateTimeField(required=True)
    content = ListField(ReferenceField('Media'))
