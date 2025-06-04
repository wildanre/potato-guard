from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from flask_cors import CORS
import os
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# Kelas label
CLASS_NAMES = ['Early_Blight', 'Healthy', 'Late_Blight']

# Load model
try:
    MODEL_DIR = os.path.join('models')
    model = tf.saved_model.load(MODEL_DIR)
    predict_fn = model.signatures['serving_default']  # Get the serving signature
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {str(e)}")
    model = None
    predict_fn = None

def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((224, 224))  # ubah sesuai input model
    img_array = np.array(img) / 255.0  # normalisasi
    img_tensor = tf.convert_to_tensor([img_array], dtype=tf.float32)  # batch size 1
    return img_tensor

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500

    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    try:
        image_file = request.files['image']
        image_bytes = image_file.read()
        input_tensor = preprocess_image(image_bytes)
        
        # Prediksi menggunakan model dengan serving signature
        predictions = predict_fn(tf.constant(input_tensor))
        # Get the output tensor (you might need to adjust the key based on your model's output)
        output_key = list(predictions.keys())[0]  # Get the first output key
        predictions_array = predictions[output_key].numpy()
        predicted_index = np.argmax(predictions_array[0])
        predicted_label = CLASS_NAMES[predicted_index]
        confidence = float(np.max(predictions_array[0]))

        return jsonify({
            'status': 'success',
            'prediction': predicted_label,
            'confidence': confidence
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
