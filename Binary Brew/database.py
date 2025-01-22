import psycopg2
from user import User

class Database:
    def __init__(self):
        self.connect = psycopg2.connect('postgres://avnadmin:AVNS_IMr3mTXL81VOH9I4Eo7@pg-3c581a77-vehicles09.g.aivencloud.com:21946/defaultdb?sslmode=require')
        self.cursor = connect.cursor()

    def insertUser(user):
        print(f"password recived: {user.password}")
