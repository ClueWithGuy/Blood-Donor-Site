from flask import Blueprint, jsonify, request, render_template
from .database import db
from .models import Donor, Donation, BloodRequest, Message
from werkzeug.security import generate_password_hash, check_password_hash

main = Blueprint("main", __name__)

@main.route("/api/health")
def health():
    return jsonify({
        "message": "Backend is running successfully"
    })


@main.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    
    required_fields = [
        "school_id",
        "name",
        "email",
        "password",
        "cellphone",
        "blood_group"
    ]

    for field in required_fields:
        if not data.get(field):
            return jsonify({
                "error" : f"{field} is required",
            }), 400

    password_hash = generate_password_hash(data["password"])

    existing_donor = Donor.query.filter((Donor.school_id == data["school_id"]) | (Donor.email == data["email"])).first()
    if existing_donor:
        return jsonify({
            "error": "School ID or email is already registered",
        }), 409

    donor = Donor(
        school_id = data["school_id"],
        name = data["name"],
        email = data["email"],
        password_hash = password_hash,
        cellphone = data["cellphone"],
        blood_group = data["blood_group"]
    )

    db.session.add(donor)
    db.session.commit()

    return jsonify({
        "message" : "Donor Registered Successfully",
        "school_id" : donor.school_id
    }), 201

@main.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()

    school_id = data.get("school_id")
    password = data.get("password")

    if not school_id or not password:
        return jsonify({
            "error" : "School ID or password are required"
        }), 400

    donor = Donor.query.filter_by(school_id=school_id).first()

    if not donor:
        return jsonify({
            "error" : "Invalid school ID or password"
        }), 401

    if not check_password_hash(donor.password_hash, password):
        return jsonify({
            "error" : "Invalid school ID or password"
        }), 401

    return jsonify({
        "message" : "Login Successful",
        "school_id" : donor.school_id,
        "name" : donor.name,
        "email" : donor.email
    })

@main.route("/api/donors", methods=["GET"])
def get_donors():
    blood_group = request.args.get("blood_group")

    if blood_group:
        donors = Donor.query.filter_by(
            blood_group=blood_group,
            is_active=True
        ).all()
    else:
        donors = Donor.query.filter_by(is_active=True).all()

    donor_list = []

    for donor in donors:
        donor_list.append({
            "school_id": donor.school_id,
            "name": donor.name,
            "email": donor.email,
            "cellphone": donor.cellphone,
            "blood_group": donor.blood_group
        })

    return jsonify(donor_list), 200

@main.route("/api/donors/<school_id>", methods=["PUT"])
def update_donor(school_id):
    data = request.get_json()

    donor = Donor.query.filter_by(
        school_id = school_id
    ).first()

    if not donor:
        return jsonify({
            "error": "Donor not found"
        }), 404

    if data.get("name"):
        donor.name = data["name"]
    if data.get("email"):
        donor.email = data["email"]
    if data.get("cellphone"):
        donor.cellphone = data["cellphone"]
    if data.get("blood_group"):
        donor.blood_group = data["blood_group"]

    db.session.commit()

    return jsonify({
        "message": "Donor updated successfully",
        "school_id": school_id
    }), 200

@main.route("/api/donors/<school_id>/availability", methods=["PUT"])
def update_availability(school_id):
    data = request.get_json()

    donor = Donor.query.filter_by(
        school_id=school_id
    ).first()

    if not donor:
        return jsonify({
            "error": "Donor not found"
        }), 404

    if "is_active" not in data:
        return jsonify({
            "error": "is_active is required"
        }), 400

    donor.is_active = data["is_active"]

    db.session.commit()

    return jsonify({
        "message" : "Donor availability updated successfully",
        "school_id": donor.school_id,
        "is_active": donor.is_active
    })

@main.route("/api/donors/<school_id>", methods=["GET"])
def get_donor(school_id):
    donor = Donor.query.filter_by(
        school_id=school_id
    ).first()

    if not donor:
        return jsonify({
            "error": "donor not found"
        }), 404

    return jsonify({
        "school_id": donor.school_id,
        "name": donor.name,
        "email": donor.email,
        "cellphone": donor.cellphone,
        "blood_group": donor.blood_group,
        "is_active": donor.is_active,
    }), 200


@main.route("/api/donors/<school_id>/donations", methods=["GET"])
def get_donations(school_id):
    donor = Donor.query.filter_by(
        school_id=school_id
    ).first()

    if not donor:
        return jsonify({
            "error": "Donor not found"
        }), 404

    donations = Donation.query.filter_by(
        donor_school_id=school_id
    ).order_by(
        Donation.donation_date.desc()
    ).all()

    donation_list = []

    for donation in donations:
        donation_list.append({
            "id": donation.id,
            "donation_date": donation.donation_date.isoformat(),
            "notes": donation.notes
        })

    return jsonify(donation_list), 200


@main.route("/api/donors/<school_id>/donations", methods=["POST"])
def create_donation(school_id):
    donor = Donor.query.filter_by(
        school_id=school_id
    ).first()

    if not donor:
        return jsonify({
            "error": "Donor not found"
        }), 404

    data = request.get_json() or {}

    donation = Donation(
        donor_school_id=school_id,
        notes=data.get("notes")
    )

    db.session.add(donation)
    db.session.commit()

    return jsonify({
        "message": "Donation logged successfully",
        "donation": {
            "id": donation.id,
            "donation_date": donation.donation_date.isoformat(),
            "notes": donation.notes
        }
    }), 201

@main.route("/api/requests", methods=["GET"])
def get_requests():
    requests = BloodRequest.query.filter_by(
        status="open"
    ).order_by(
        BloodRequest.created_at.desc()
    ).all()

    request_list = []

    for blood_request in requests:
        request_list.append({
            "id": blood_request.id,
            "requester_school_id": blood_request.requester_school_id,
            "patient_name": blood_request.patient_name,
            "blood_group": blood_request.blood_group,
            "hospital": blood_request.hospital,
            "contact": blood_request.contact,
            "urgency": blood_request.urgency,
            "status": blood_request.status,
            "created_at": blood_request.created_at.isoformat()
        })

    return jsonify(request_list), 200


@main.route("/api/requests", methods=["POST"])
def create_request():
    data = request.get_json() or {}

    required_fields = [
        "requester_school_id",
        "patient_name",
        "blood_group",
        "hospital",
        "contact"
    ]

    for field in required_fields:
        if not data.get(field):
            return jsonify({
                "error": f"{field} is required"
            }), 400

    donor = Donor.query.filter_by(
        school_id=data["requester_school_id"]
    ).first()

    if not donor:
        return jsonify({
            "error": "Requester not found"
        }), 404

    blood_request = BloodRequest(
        requester_school_id=data["requester_school_id"],
        patient_name=data["patient_name"],
        blood_group=data["blood_group"],
        hospital=data["hospital"],
        contact=data["contact"],
        urgency=data.get("urgency", "normal"),
        status="open"
    )

    db.session.add(blood_request)
    db.session.commit()

    return jsonify({
        "message": "Blood request created successfully",
        "request": {
            "id": blood_request.id,
            "patient_name": blood_request.patient_name,
            "blood_group": blood_request.blood_group,
            "hospital": blood_request.hospital,
            "urgency": blood_request.urgency,
            "status": blood_request.status
        }
    }), 201

@main.route("/api/messages", methods=["GET"])
def get_messages():
    school_id = request.args.get("school_id")

    if not school_id:
        return jsonify({
            "error": "school_id is required"
        }), 400

    donor = Donor.query.filter_by(
        school_id=school_id
    ).first()

    if not donor:
        return jsonify({
            "error": "Donor not found"
        }), 404

    messages = Message.query.filter(
        (Message.sender_school_id == school_id) |
        (Message.receiver_school_id == school_id)
    ).order_by(
        Message.created_at.desc()
    ).all()

    message_list = []

    for message in messages:
        message_list.append({
            "id": message.id,
            "sender_school_id": message.sender_school_id,
            "receiver_school_id": message.receiver_school_id,
            "message": message.message,
            "is_read": message.is_read,
            "created_at": message.created_at.isoformat()
        })

    unread_count = Message.query.filter_by(
        receiver_school_id=school_id,
        is_read=False
    ).count()

    return jsonify({
        "messages": message_list,
        "unread_count": unread_count
    }), 200


@main.route("/api/messages", methods=["POST"])
def create_message():
    data = request.get_json() or {}

    required_fields = [
        "sender_school_id",
        "receiver_school_id",
        "message"
    ]

    for field in required_fields:
        if not data.get(field):
            return jsonify({
                "error": f"{field} is required"
            }), 400

    sender = Donor.query.filter_by(
        school_id=data["sender_school_id"]
    ).first()

    receiver = Donor.query.filter_by(
        school_id=data["receiver_school_id"]
    ).first()

    if not sender or not receiver:
        return jsonify({
            "error": "Sender or receiver not found"
        }), 404

    new_message = Message(
        sender_school_id=data["sender_school_id"],
        receiver_school_id=data["receiver_school_id"],
        message=data["message"]
    )

    db.session.add(new_message)
    db.session.commit()

    return jsonify({
        "message": "Message sent successfully",
        "data": {
            "id": new_message.id,
            "sender_school_id": new_message.sender_school_id,
            "receiver_school_id": new_message.receiver_school_id,
            "message": new_message.message,
            "is_read": new_message.is_read,
            "created_at": new_message.created_at.isoformat()
        }
    }), 201


@main.route("/api/messages/<int:message_id>/read", methods=["PUT"])
def mark_message_read(message_id):
    message = Message.query.get(message_id)

    if not message:
        return jsonify({
            "error": "Message not found"
        }), 404

    message.is_read = True

    db.session.commit()

    return jsonify({
        "message": "Message marked as read",
        "id": message.id,
        "is_read": message.is_read
    }), 200


@main.route("/api/dashboard/<school_id>", methods=["GET"])
def get_dashboard(school_id):
    donor = Donor.query.filter_by(
        school_id=school_id
    ).first()

    if not donor:
        return jsonify({
            "error": "Donor not found"
        }), 404

    donations = Donation.query.filter_by(
        donor_school_id=school_id
    ).order_by(
        Donation.donation_date.desc()
    ).all()

    open_requests = BloodRequest.query.filter_by(
        status="open"
    ).order_by(
        BloodRequest.created_at.desc()
    ).all()

    unread_messages = Message.query.filter_by(
        receiver_school_id=school_id,
        is_read=False
    ).count()

    available_donors = Donor.query.filter_by(
        is_active=True
    ).count()

    donation_count = len(donations)

    badges = {
        "first_pint": donation_count >= 1,
        "regular": donation_count >= 3,
        "recruiter": False
    }

    return jsonify({
        "donor": {
            "school_id": donor.school_id,
            "name": donor.name,
            "email": donor.email,
            "cellphone": donor.cellphone,
            "blood_group": donor.blood_group,
            "is_active": donor.is_active
        },

        "donations": [
            {
                "id": donation.id,
                "donation_date": donation.donation_date.isoformat(),
                "notes": donation.notes
            }
            for donation in donations
        ],

        "open_requests": [
            {
                "id": blood_request.id,
                "requester_school_id": blood_request.requester_school_id,
                "patient_name": blood_request.patient_name,
                "blood_group": blood_request.blood_group,
                "hospital": blood_request.hospital,
                "contact": blood_request.contact,
                "urgency": blood_request.urgency,
                "status": blood_request.status,
                "created_at": blood_request.created_at.isoformat()
            }
            for blood_request in open_requests
        ],

        "stats": {
            "open_requests": len(open_requests),
            "available_donors": available_donors,
            "unread_messages": unread_messages,
            "donation_count": donation_count
        },

        "badges": badges
    }), 200

