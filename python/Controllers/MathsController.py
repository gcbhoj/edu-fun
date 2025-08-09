from flask import Blueprint, jsonify

from Maths.Levels.SimpleAddition.Level1Addition import level1_Questions

maths_bp = Blueprint('maths_bp',__name__)

@maths_bp.route('/api/py/math-quiz/level1',methods =['GET'])
def get_level1_questions():
    questions = level1_Questions()

    return jsonify({
    "status":"success",
    "message": "Level 1 Questions Fetched",
    "details":questions
})