from flask import Flask, send_from_directory
from .database import db
import os

def create_app():
  app = Flask(__name__)

  app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
  db.init_app(app)

  from .models import Donor
  with app.app_context():
    db.create_all()

  from .routes import main
  app.register_blueprint(main)

  frontend_folder = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "frontend-arman")
  )

  @app.route("/")
  def home_page():
    return send_from_directory(frontend_folder, "index.html")
  
  @app.route("/register")
  def register_page():
    return send_from_directory(frontend_folder, "register.html")

  @app.route("/login")
  def login_page():
    return send_from_directory(frontend_folder, "login.html")

  @app.route("/dashboard")
  def dashborad_page():
    return send_from_directory(frontend_folder, "dashboard.html")

  @app.route("/requests")
  def requests_page():
    return send_from_directory(frontend_folder, "requests.html")

  @app.route("/find_donor")
  def find_donor_page():
    return send_from_directory(frontend_folder, "find_donor.html")

  # CSS files
  @app.route("/css/<path:filename>")
  def css_files(filename):
    return send_from_directory(
      os.path.join(frontend_folder, "css"),
      filename
    )

  # JavaScript files
  @app.route("/js/<path:filename>")
  def js_files(filename):
    return send_from_directory(
      os.path.join(frontend_folder, "js"),
      filename
    )

  @app.route("/team")
  def team_page():
    return send_from_directory(frontend_folder, "team.html")

  
  return app


    
