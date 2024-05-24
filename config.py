class Config:
    # MongoDB settings
    MONGODB_DB = 'kodikontroller'        # Name of your database
    MONGODB_HOST = '10.0.3.12'           # Hostname or IP of the MongoDB server
    MONGODB_PORT = 27017                 # Port number (default is 27017 for MongoDB)
    #MONGODB_USERNAME = None              # Optional: specify if your MongoDB is secured
    #MONGODB_PASSWORD = None              # Optional: specify if your MongoDB is secured
    #MONGODB_AUTH_SOURCE = 'admin'        # Optional: specify the database to authenticate against

class TestConfig(Config):
    TESTING = True
    MONGODB_SETTINGS = {'db': 'kk_test_db', 'host': '10.0.3.12', 'port': 27017}
