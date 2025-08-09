from flask import Blueprint, jsonify
from Services.AgeUpdateServices import updateAge
from datetime import datetime

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/api/update-ages', methods=['POST'])
def update_ages():
    updated_count = updateAge()

    if updated_count > 0:
        return jsonify({
        "status": "success",
        "message": "Age updated for users.",
        "details": f"{updated_count} of Age Updates as of {datetime.now()}"
    }), 200
    else:
        return jsonify({
            "status":"success",
            "message": "None Updated",
            "details":f"Age's Intact.\nNothing to Update."
        })
