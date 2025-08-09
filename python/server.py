from flask import Flask
from Controllers.UserController import user_bp
from Controllers.MathsController import maths_bp

app = Flask(__name__)


app.register_blueprint(user_bp)
app.register_blueprint(maths_bp)

if __name__ == "__main__":
    app.run(debug=True)
