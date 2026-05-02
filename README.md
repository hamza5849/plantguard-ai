# PlantGuard AI - Plant Disease Detector

PlantGuard AI is a web application that uses artificial intelligence to detect plant diseases from leaf photos. Upload a photo of any plant leaf and the AI will identify possible diseases within seconds.

## Live Demo

https://plantguard-ai-t3fh.onrender.com

## Features

- Detects 38+ plant diseases across 14 different species
- Instant AI-powered analysis
- Clean and responsive web interface
- Works on mobile and desktop
- Private and secure - images are never stored

## Supported Plants

Apple, Blueberry, Cherry, Corn, Grape, Orange, Peach, Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, Tomato

## Tech Stack

- Python
- Flask
- PyTorch
- MobileNetV2
- HTML, CSS, JavaScript

## How to Run Locally

1. Clone the repository
   git clone https://github.com/hamza5849/plantguard-ai.git

2. Navigate to the project folder
   cd plantguard-ai

3. Install dependencies
   pip install -r requirements.txt

4. Run the server
   python server.py

5. Open your browser at http://localhost:5000

## Project Structure

plantguard-ai/
├── server.py
├── model.py
├── requirements.txt
├── Procfile
├── templates/
│   └── index.html
└── static/
    ├── css/
    │   └── style.css
    └── js/
        └── app.js

## How It Works

1. Upload a clear photo of a plant leaf
2. The AI model analyzes the image
3. Results are shown with confidence scores

## Author

Hamza
GitHub: https://github.com/hamza5849
