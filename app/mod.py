from .database import db

class Donor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    school_id = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True , nullable=False )
    password_hash = db.Column(db.String(255), nullable=False)
    cellphone = db.Column(db.String(20), nullable=False)
    blood_group = db.Column(db.String(5), nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
