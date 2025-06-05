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
    predict_fn = model.signatures['serving_default']
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {str(e)}")
    model = None
    predict_fn = None

def calculate_image_quality_score(img_array):
    """Calculate basic image quality metrics"""
    # Brightness
    brightness = np.mean(img_array)
    
    # Contrast (standard deviation)
    gray = np.mean(img_array, axis=2)
    contrast = np.std(gray)
    
    # Simple sharpness metric
    laplacian_var = np.var(np.gradient(gray))
    
    quality_score = 1.0
    
    # Penalize poor brightness
    if brightness < 50 or brightness > 200:
        quality_score *= 0.8
    
    # Penalize low contrast
    if contrast < 30:
        quality_score *= 0.7
    
    # Penalize blurry images
    if laplacian_var < 100:
        quality_score *= 0.6
    
    return quality_score

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
    
    # 3. Enhanced normalization
    img_array = np.array(img, dtype=np.float32)
    
    # Normalize to [0, 1] first
    img_array = img_array / 255.0
    
    # Convert to tensor with batch dimension
    img_tensor = tf.convert_to_tensor([img_array], dtype=tf.float32)
    return img_tensor, img_array

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
        
        image_bytes = image_file.read()
        
        # Check file size (max 10MB)
        if len(image_bytes) > 10 * 1024 * 1024:
            return jsonify({'error': 'File too large. Maximum size is 10MB'}), 400
        
        # Validate that it's actually an image
        try:
            test_img = Image.open(io.BytesIO(image_bytes))
            test_img.verify()
        except Exception:
            return jsonify({'error': 'Invalid image file'}), 400
        
        # Preprocess image
        input_tensor, img_array = preprocess_image(image_bytes)
        
        # Calculate image quality
        quality_score = calculate_image_quality_score(img_array)
        
        # Prediksi menggunakan model dengan serving signature
        predictions = predict_fn(tf.constant(input_tensor))
        output_key = list(predictions.keys())[0]
        predictions_array = predictions[output_key].numpy()
        
        # Get top predictions for better analysis
        top_indices = np.argsort(predictions_array[0])[::-1]
        top_confidences = predictions_array[0][top_indices]
        
        predicted_index = top_indices[0]
        predicted_label = CLASS_NAMES[predicted_index]
        raw_confidence = float(top_confidences[0])
        
        # Apply quality-based confidence calibration
        calibrated_confidence = raw_confidence * quality_score
        
        # Calculate confidence threshold and uncertainty
        second_confidence = float(top_confidences[1]) if len(top_confidences) > 1 else 0.0
        confidence_gap = calibrated_confidence - second_confidence
          # Add uncertainty flag for low confidence or close predictions
        is_uncertain = calibrated_confidence < 0.7 or confidence_gap < 0.2 or quality_score < 0.8
        
        response_data = {
            'status': 'success',
            'prediction': predicted_label,
            'confidence': calibrated_confidence,
            'raw_confidence': raw_confidence,
            'quality_score': quality_score,
            'is_uncertain': is_uncertain,
            'all_predictions': {
                CLASS_NAMES[top_indices[i]]: float(top_confidences[i]) 
                for i in range(min(3, len(CLASS_NAMES)))
            }
        }
        
        # Add warning for uncertain predictions
        if is_uncertain:
            if quality_score < 0.8:
                response_data['warning'] = 'Kualitas gambar kurang baik. Coba gunakan pencahayaan yang lebih baik dan pastikan gambar tidak blur.'
            else:
                response_data['warning'] = 'Hasil prediksi kurang pasti. Pertimbangkan untuk mengambil foto dari sudut yang berbeda.'
        
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
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
