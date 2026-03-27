# server/create_db.py
from app import db
db.create_all()
print("Tables created!")