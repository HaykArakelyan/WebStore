from flask import request, jsonify

import helpers
from app import app


@app.route('/contact-us', methods=['POST'])
def contact_us():
    data = request.json
    name = data.get("name")
    phone = data.get("phone")
    email = data.get("email")
    message = data.get("message")
    subject = data.get("subject")
    if not name and phone and email and message:
        return jsonify(message="Missing Fields"), 200
    helpers.contactus_email(name, phone, email, message, subject)

    return jsonify(message="Message Sent Successfully"), 200

