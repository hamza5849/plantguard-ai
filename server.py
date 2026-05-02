from flask import Flask, request, jsonify, render_template
from model import load_model, predict
import base64

app = Flask(__name__)
model = load_model()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict_disease():
    data = request.get_json()
    image_bytes = base64.b64decode(data['image'])
    results = predict(model, image_bytes)
    return jsonify(results)

if __name__ == '__main__':
    print("Starting PlantGuard AI Server...")
    print("Open your browser at: http://localhost:5000")
    app.run(debug=False, port=5000)