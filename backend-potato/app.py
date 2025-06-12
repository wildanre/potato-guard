from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from flask_cors import CORS
import os
from PIL import Image
import io
from image_enhancement import enhance_image_quality, apply_test_time_augmentation, calculate_image_metrics, calibrate_confidence

app = Flask(__name__)
# Konfigurasi CORS dengan opsi lebih spesifik
CORS(app, resources={r"/*": {"origins": "*", "allow_headers": ["Content-Type", "ngrok-skip-browser-warning"], "methods": ["GET", "POST", "OPTIONS"]}})

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
    
    # Enhanced preprocessing for better accuracy
    # 1. Center crop to make it square if needed
    width, height = img.size
    if width != height:
        # Crop to square from center
        size = min(width, height)
        left = (width - size) // 2
        top = (height - size) // 2
        img = img.crop((left, top, left + size, top + size))
    
    # 2. Resize with high-quality resampling
    img = img.resize((224, 224), Image.Resampling.LANCZOS)
    
    # 3. Enhanced normalization (using ImageNet statistics)
    img_array = np.array(img, dtype=np.float32)
    
    # Normalize to [0, 1] first
    img_array = img_array / 255.0
    
    # Apply ImageNet normalization (if your model was trained with this)
    # Uncomment if your model expects ImageNet normalized inputs
    # mean = np.array([0.485, 0.456, 0.406])
    # std = np.array([0.229, 0.224, 0.225])
    # img_array = (img_array - mean) / std
    
    # Convert to tensor with batch dimension
    img_tensor = tf.convert_to_tensor([img_array], dtype=tf.float32)
    return img_tensor

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500

    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    try:
        image_file = request.files['image']
        
        # Validate file
        if image_file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Check file size (max 10MB)
        if len(image_file.read()) > 10 * 1024 * 1024:
            return jsonify({'error': 'File too large. Maximum size is 10MB'}), 400
        
        # Reset file pointer
        image_file.seek(0)
        image_bytes = image_file.read()
        
        # Validate that it's actually an image
        try:
            from PIL import Image
            test_img = Image.open(io.BytesIO(image_bytes))
            test_img.verify()  # Verify it's a valid image
        except Exception:
            return jsonify({'error': 'Invalid image file'}), 400
        
        # Reset for processing
        input_tensor = preprocess_image(image_bytes)
          # Prediksi menggunakan model dengan serving signature
        predictions = predict_fn(tf.constant(input_tensor))
        # Get the output tensor (you might need to adjust the key based on your model's output)
        output_key = list(predictions.keys())[0]  # Get the first output key
        predictions_array = predictions[output_key].numpy()
        
        # Get top predictions for better analysis
        top_indices = np.argsort(predictions_array[0])[::-1]
        top_confidences = predictions_array[0][top_indices]
        
        predicted_index = top_indices[0]
        predicted_label = CLASS_NAMES[predicted_index]
        confidence = float(top_confidences[0])
        
        # Calculate confidence threshold and uncertainty
        second_confidence = float(top_confidences[1]) if len(top_confidences) > 1 else 0.0
        confidence_gap = confidence - second_confidence
          # Add uncertainty flag for low confidence or close predictions
        is_uncertain = confidence < 0.7 or confidence_gap < 0.2
        
        response_data = {
            'status': 'success',
            'prediction': predicted_label,
            'confidence': confidence,
            'is_uncertain': is_uncertain,
            'all_predictions': {
                CLASS_NAMES[top_indices[i]]: float(top_confidences[i]) 
                for i in range(min(3, len(CLASS_NAMES)))  # Top 3 predictions
            }
        }
        
        # Add warning for uncertain predictions
        if is_uncertain:
            response_data['warning'] = 'Hasil prediksi kurang pasti. Pertimbangkan untuk menggunakan gambar dengan kualitas lebih baik.'
        return jsonify(response_data)
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

if __name__ == '__main__':
    # Untuk production, set debug=False
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
