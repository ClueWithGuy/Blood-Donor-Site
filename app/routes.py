from flask import Blueprint, jsonify, request, render_template
from .database import db
from .models import Donor
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


