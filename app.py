from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

# PostgreSQL configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123456789@localhost:5433/doc_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# SocketIO
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")

# ---------------- DATABASE -----------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    documents = db.relationship('Document', backref='owner', lazy=True)

class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

with app.app_context():
    db.create_all()
    # Create default admin if no users
    if not User.query.first():
        admin = User(username="admin", password_hash=generate_password_hash("123"))
        db.session.add(admin)
        db.session.commit()
        print("✅ Default user created (username: admin, password: 123)")

# ---------------- AUTH -----------------
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username exists"}), 400
    user = User(username=username, password_hash=generate_password_hash(password))
    db.session.add(user)
    db.session.commit()
    return jsonify({"status": "registered"})

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid credentials"}), 401
    return jsonify({"status": "ok", "user_id": user.id})

# ---------------- DOCUMENTS -----------------
@app.route("/documents/<int:user_id>")
def get_documents(user_id):
    docs = Document.query.filter_by(owner_id=user_id).all()
    return jsonify([{"id": d.id, "title": d.title} for d in docs])

@app.route("/document/<int:doc_id>")
def get_document(doc_id):
    doc = Document.query.get(doc_id)
    if doc:
        return jsonify({"id": doc.id, "title": doc.title, "content": doc.content})
    return jsonify({"error": "Document not found"}), 404

@app.route("/document", methods=["POST"])
def create_document():
    data = request.json
    user_id = data.get("user_id")
    title = data.get("title", "Untitled")
    doc = Document(title=title, content="", owner_id=user_id)
    db.session.add(doc)
    db.session.commit()
    return jsonify({"id": doc.id, "title": doc.title})

@app.route("/document/<int:doc_id>", methods=["POST"])
def save_document(doc_id):
    data = request.json
    doc = Document.query.get(doc_id)
    if doc:
        doc.content = data.get("content", "")
        db.session.commit()
        return jsonify({"status": "saved"})
    return jsonify({"error": "Document not found"}), 404

# ---------------- SOCKET.IO -----------------
@socketio.on("join_document")
def join_document(data):
    doc_id = str(data.get("doc_id"))
    join_room(doc_id)
    print(f"User joined document {doc_id}")

@socketio.on("update")
def handle_update(data):
    doc_id = str(data.get("doc_id"))
    content = data.get("content")

    doc = Document.query.get(int(doc_id))
    if doc:
        doc.content = content
        db.session.commit()

    emit("update", {"doc_id": doc_id, "content": content}, room=doc_id, include_self=False)

# ---------------- MAIN -----------------
if __name__ == "__main__":
    print("Starting server...")
    socketio.run(app, host="127.0.0.1", port=5001, debug=True)