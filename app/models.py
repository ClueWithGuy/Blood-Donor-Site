from .database import db
from datetime import datetime


class Donor(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    school_id = db.Column(
        db.String(50),
        unique=True,
        nullable=False
    )

    name = db.Column(
        db.String(100),
        nullable=False
    )

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False
    )

    cellphone = db.Column(
        db.String(20),
        nullable=False
    )

    blood_group = db.Column(
        db.String(5),
        nullable=False
    )

    is_active = db.Column(
        db.Boolean,
        default=True,
        nullable=False
    )


class Donation(db.Model):
    id = db.Column(
        db.Integer,
        primary_key=True
    )

    donor_school_id = db.Column(
        db.String(50),
        nullable=False
    )

    donation_date = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    notes = db.Column(
        db.String(500),
        nullable=True
    )


class BloodRequest(db.Model):
    id = db.Column(
        db.Integer,
        primary_key=True
    )

    requester_school_id = db.Column(
        db.String(50),
        nullable=False
    )

    patient_name = db.Column(
        db.String(100),
        nullable=False
    )

    blood_group = db.Column(
        db.String(5),
        nullable=False
    )

    hospital = db.Column(
        db.String(150),
        nullable=False
    )

    contact = db.Column(
        db.String(20),
        nullable=False
    )

    urgency = db.Column(
        db.String(20),
        nullable=False,
        default="normal"
    )

    status = db.Column(
        db.String(20),
        nullable=False,
        default="open"
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )


class Message(db.Model):
    id = db.Column(
        db.Integer,
        primary_key=True
    )

    sender_school_id = db.Column(
        db.String(50),
        nullable=False
    )

    receiver_school_id = db.Column(
        db.String(50),
        nullable=False
    )

    message = db.Column(
        db.Text,
        nullable=False
    )

    is_read = db.Column(
        db.Boolean,
        default=False,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )
