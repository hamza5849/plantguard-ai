import torchvision.transforms as transforms
from torchvision import models
from PIL import Image
from io import BytesIO
import torch

CLASSES = [
    'Apple - Apple Scab', 'Apple - Black Rot', 'Apple - Cedar Apple Rust', 'Apple - Healthy',
    'Blueberry - Healthy', 'Cherry - Powdery Mildew', 'Cherry - Healthy',
    'Corn - Cercospora Leaf Spot', 'Corn - Common Rust', 'Corn - Northern Leaf Blight', 'Corn - Healthy',
    'Grape - Black Rot', 'Grape - Esca (Black Measles)', 'Grape - Leaf Blight', 'Grape - Healthy',
    'Orange - Citrus Greening', 'Peach - Bacterial Spot', 'Peach - Healthy',
    'Pepper - Bacterial Spot', 'Pepper - Healthy',
    'Potato - Early Blight', 'Potato - Late Blight', 'Potato - Healthy',
    'Raspberry - Healthy', 'Soybean - Healthy', 'Squash - Powdery Mildew',
    'Strawberry - Leaf Scorch', 'Strawberry - Healthy',
    'Tomato - Bacterial Spot', 'Tomato - Early Blight', 'Tomato - Late Blight',
    'Tomato - Leaf Mold', 'Tomato - Septoria Leaf Spot', 'Tomato - Spider Mites',
    'Tomato - Target Spot', 'Tomato - Yellow Leaf Curl Virus', 'Tomato - Mosaic Virus', 'Tomato - Healthy'
]

def load_model():
    print("Loading PlantGuard AI Model...")
    model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.DEFAULT)
    model.classifier[1] = torch.nn.Linear(model.last_channel, len(CLASSES))
    model.eval()
    print("Model Ready!")
    return model

def predict(model, image_bytes):
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    img = Image.open(BytesIO(image_bytes)).convert('RGB')
    tensor = transform(img).unsqueeze(0)
    with torch.no_grad():
        outputs = model(tensor)
        probs = torch.nn.functional.softmax(outputs[0], dim=0)
        top3 = torch.topk(probs, 3)
    results = []
    for i in range(3):
        results.append({
            'disease': CLASSES[top3.indices[i].item()],
            'confidence': round(top3.values[i].item() * 100, 1)
        })
    return results