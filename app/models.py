from mongoengine import Document, StringField, IntField, DateTimeField, ListField, ReferenceField, BooleanField, EmbeddedDocument, EmbeddedDocumentField
from .extensions import db

class Media(db.Document):
    name = db.StringField(required=True, unique=True)
    description = db.StringField()
    type = db.StringField(required=True, choices=('audio', 'video', 'image', 'youtube'))
    path = db.StringField()
    url = db.StringField(unique=True)

class Group(db.Document):
    name = db.StringField(required=True)
    description = db.StringField()
    members = db.ListField(db.ReferenceField('Host'))  # List of host references

class Host(db.Document):
    name = db.StringField(required=True)
    ip = db.StringField(required=True)
    port = db.IntField(required=True)
    username = db.StringField()
    password = db.StringField()
    group = db.StringField()  # Removed for now
    cec = db.StringField()  # Consumer Electronics Control (optional)
    status = db.StringField(required=True, choices=('active', 'inactive', 'error'))
    schedule = db.ReferenceField('Schedule')  # Link to a Schedule if applicable
    os = db.StringField()  # Operating system
    location = db.StringField()  # Physical or logical location

class Schedule(db.Document):
    name = db.StringField(required=True)
    description = db.StringField()
    startDate = db.DateTimeField(required=True)
    endDate = db.DateTimeField(required=True)
    playlist = db.ListField(db.ReferenceField('Playlist'))  # List of media references
    shuffle = db.BooleanField(default=False)

class ContentItem(EmbeddedDocument):
    player = db.IntField(required=True, choices=(1, 2, 3))
    path = db.StringField()
    url = db.StringField(regex='^http[s]?://')

class Playlist(db.Document):
    name = db.StringField(required=True)
    description = db.StringField()
    createDate = db.DateTimeField(required=True)
    content = db.ListField(EmbeddedDocumentField(ContentItem))
