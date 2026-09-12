Blood Donor Backend

Basic Flask backend for a student blood donor registration system.

API Base URL
http://127.0.0.1:5000

API Endpoints
Purpose	Method	Endpoint
Health/Home	GET	/
Register donor	POST	/api/register
Login	POST	/api/login
Get/Search donors	GET	/api/donors
Get one donor	GET	/api/donors/<school_id>
Update donor	PUT	/api/donors/<school_id>
Change availability	PUT	/api/donors/<school_id>/availability
1. Health Check

GET

/


Response:

{
    "message": "Blood donor backend is running"
}

2. Register Donor

POST

/api/register


Request body:

{
    "school_id": "STU001",
    "name": "Rahim Ahmed",
    "email": "rahim@example.com",
    "password": "123456",
    "cellphone": "01711111111",
    "blood_group": "A+"
}


Success response:

{
    "message": "Donor Registered Successfully",
    "school_id": "STU001"
}

3. Login

POST

/api/login


Request body:

{
    "school_id": "STU001",
    "password": "123456"
}


Success response:

{
    "message": "Login Successful",
    "school_id": "STU001",
    "name": "Rahim Ahmed",
    "email": "rahim@example.com"
}

4. Get/Search Donors
Get all active donors

GET

/api/donors

Search by blood group

GET

/api/donors?blood_group=O+


Possible blood groups:

A+
A-
B+
B-
AB+
AB-
O+
O-


Only donors with is_active = true are returned.

5. Get One Donor

GET

/api/donors/<school_id>


Example:

/api/donors/STU001


Response:

{
    "school_id": "STU001",
    "name": "Rahim Ahmed",
    "email": "rahim@example.com",
    "cellphone": "01711111111",
    "blood_group": "A+",
    "is_active": true
}

6. Update Donor

PUT

/api/donors/<school_id>


Example:

/api/donors/STU001


Request body:

{
    "name": "Rahim Ahmed",
    "email": "newemail@example.com",
    "cellphone": "01811111111",
    "blood_group": "A+"
}


The frontend can send only the fields that need to be changed.

7. Change Donor Availability

PUT

/api/donors/<school_id>/availability


Set donor as unavailable:

{
    "is_active": false
}


Set donor as available:

{
    "is_active": true
}

Frontend Notes

The frontend should use the API endpoints above rather than directly accessing the database.

For example, to search for O+ donors:

fetch("/api/donors?blood_group=O+")


To register a donor:

fetch("/api/register", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        school_id: "STU001",
        name: "Rahim Ahmed",
        email: "rahim@example.com",
        password: "123456",
        cellphone: "01711111111",
        blood_group: "A+"
    })
})

Project Structure
myprojects/
├── app/
│   ├── __init__.py
│   ├── database.py
│   ├── models.py
│   └── routes.py
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── dashboard.html
│   ├── login.html
│   └── register.html
│
├── instance/
├── myvenv/
├── requirements.txt
├── run.py
└── README.md