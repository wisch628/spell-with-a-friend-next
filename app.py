from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])  # Allow requests from Next.js frontend

# PostgreSQL Connection
conn = psycopg2.connect(
    dbname="postgres",
    user="postgres",
    password="spellwithafriend",
    host="spell-with-a-friend.cluster-ck75izwfyrkk.us-east-2.rds.amazonaws.com",
    port="5432"
)
cursor = conn.cursor()
conn.commit()

# Routes
@app.route('/')
def home():
    return jsonify({"message": "Hello from Flask Backend"})

@app.route('/items', methods=['GET'])
def get_items():
    cursor.execute("SELECT * FROM items;")
    items = cursor.fetchall()
    return jsonify([{"id": item[0], "name": item[1], "description": item[2]} for item in items])

@app.route('/items/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    cursor.execute("DELETE FROM items WHERE id = %s;", (item_id,))
    conn.commit()
    return jsonify({"message": f"Item {item_id} deleted"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)