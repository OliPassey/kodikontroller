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
    members = ListField(ReferenceField('Host'))  

class Host(Document):
    name = StringField(required=True)
    ip = StringField(required=True)
    port = IntField(required=True)
    username = StringField()
    password = StringField()
    group = StringField()  
    cec = StringField()  
    status = StringField(required=True, choices=('new', 'active', 'inactive', 'error'))
    schedule = ReferenceField('Schedule') 
    os = StringField()  
    location = StringField()  
    defaultImage = ReferenceField('Media') 
    last_inactive_time = DateTimeField(default=None)
    player = StringField(default='') 

class Schedule(Document):
    name = StringField(required=True)
    description = StringField()
    startDate = DateTimeField(required=True)
    endDate = DateTimeField(required=True)
    playlist = ListField(ReferenceField('Playlist')) 
    shuffle = BooleanField(default=False)

class Playlist(Document):
    name = StringField(required=True)
    description = StringField()
    createDate = DateTimeField(required=True)
    content = ListField(ReferenceField('Media'))
