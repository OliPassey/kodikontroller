import os

class Config:
    # MongoDB settings
    MONGODB_DB = os.environ.get('MONGODB_DB', 'kodikontroller') 
    MONGODB_HOST = os.environ.get('MONGODB_HOST', '10.0.3.12')  
    MONGODB_PORT = int(os.environ.get('MONGODB_PORT', 27017))   
    MONGODB_USERNAME = os.environ.get('MONGODB_USERNAME', None) 
    MONGODB_PASSWORD = os.environ.get('MONGODB_PASSWORD', None) 
    MONGODB_AUTH_SOURCE = os.environ.get('MONGODB_AUTH_SOURCE', 'admin')
