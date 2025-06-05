# Potato Guardian Backend

A Flask-based REST API server that provides machine learning-powered potato disease detection capabilities. This backend service uses TensorFlow to analyze potato leaf images and classify them into healthy or diseased categories.

## Features

- 🤖 **TensorFlow Model Integration**: Utilizes trained deep learning models for accurate disease detection
- 🔍 **Multi-class Classification**: Detects Early Blight, Late Blight, and Healthy potato leaves
- 📊 **Confidence Scoring**: Provides prediction confidence levels and uncertainty flags
- 🖼️ **Advanced Image Processing**: Enhanced preprocessing with quality optimization
- 🚀 **RESTful API**: Clean, well-documented API endpoints
- 🔒 **Input Validation**: Comprehensive file validation and error handling
- 🌐 **CORS Support**: Cross-origin resource sharing for web applications
- 📈 **Health Monitoring**: Service health check endpoints

## Disease Classification

The model can classify potato leaves into three categories:

1. **Early Blight** - Fungal disease characterized by dark spots with concentric rings
2. **Late Blight** - Destructive disease causing dark, water-soaked lesions
3. **Healthy** - Normal, disease-free potato leaves

## Technology Stack

- **Framework**: Flask 2.3.3
- **Machine Learning**: TensorFlow 2.10.0
- **Image Processing**: PIL (Pillow) 9.5.0
- **Numerical Computing**: NumPy 1.23.5
- **Cross-Origin Support**: Flask-CORS 4.0.0

## Prerequisites

- Python 3.8 or higher
- pip package manager
- Trained TensorFlow model (saved in `models/` directory)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend-potato
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Verify model files**
   Ensure the `models/` directory contains:
   - `saved_model.pb`
   - `variables/` directory with model weights

5. **Run the server**
   ```bash
   python app.py
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### POST /predict

Analyzes an uploaded potato leaf image and returns disease prediction.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with `image` field containing the image file

**Response:**
```json
{
  "status": "success",
  "prediction": "Early_Blight",
  "confidence": 0.85,
  "is_uncertain": false,
  "all_predictions": {
    "Early_Blight": 0.85,
    "Late_Blight": 0.10,
    "Healthy": 0.05
  },
  "warning": "Hasil prediksi kurang pasti. Pertimbangkan untuk menggunakan gambar dengan kualitas lebih baik."
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input or processing error
- `500 Internal Server Error`: Model not loaded or server error

### GET /health

Returns the health status of the service and model availability.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

## Image Processing Pipeline

1. **Input Validation**
   - File format verification (JPEG, PNG, WebP)
   - File size limit (10MB maximum)
   - Image integrity check

2. **Preprocessing**
   - Convert to RGB format
   - Center crop to square aspect ratio
   - Resize to 224x224 pixels using LANCZOS resampling
   - Normalize pixel values to [0, 1] range
   - Convert to TensorFlow tensor format

3. **Prediction**
   - Forward pass through the TensorFlow model
   - Extract confidence scores for all classes
   - Apply uncertainty detection logic

4. **Post-processing**
   - Calculate confidence gaps between top predictions
   - Flag uncertain predictions (confidence < 0.7 or gap < 0.2)
   - Format response with top-3 predictions

## Configuration

### Environment Variables

```bash
# Server configuration
PORT=5000
FLASK_ENV=production

# Model configuration
MODEL_DIR=models
```

### Model Requirements

The model should be a TensorFlow SavedModel with:
- Input shape: (batch_size, 224, 224, 3)
- Output: Softmax probabilities for 3 classes
- Serving signature: 'serving_default'

## File Structure

```
backend-potato/
├── app.py                  # Main Flask application
├── image_enhancement.py    # Image processing utilities
├── requirements.txt        # Python dependencies
├── models/                # TensorFlow model files
│   ├── saved_model.pb     # Model architecture
│   └── variables/         # Model weights
│       ├── variables.data-00000-of-00001
│       └── variables.index
└── README.md              # This file
```

## Dependencies

```txt
flask==2.3.3          # Web framework
tensorflow==2.10.0    # Machine learning library
Pillow==9.5.0         # Image processing
numpy==1.23.5         # Numerical computing
flask-cors==4.0.0     # Cross-origin resource sharing
```

## Error Handling

The API implements comprehensive error handling for:

- **Invalid file uploads**: Missing files, empty filenames
- **File size limits**: Files exceeding 10MB
- **Invalid image formats**: Non-image files or corrupted images
- **Model errors**: Model loading failures or prediction errors
- **Server errors**: Unexpected exceptions with detailed logging

## Security Considerations

- File size limits to prevent DoS attacks
- File format validation to prevent malicious uploads
- Input sanitization and validation
- Error message sanitization to prevent information leakage

## Performance Optimization

- Efficient image preprocessing pipeline
- Model loaded once at startup
- Optimized tensor operations
- Memory-efficient image handling

## Deployment

### Development
```bash
python app.py
```

### Production (using Gunicorn)
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Docker Deployment
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["python", "app.py"]
```

### Cloud Deployment

**Heroku:**
```bash
# Create Procfile
echo "web: python app.py" > Procfile

# Deploy
heroku create your-app-name
git push heroku main
```

## Monitoring and Logging

- Health check endpoint for service monitoring
- Comprehensive error logging
- Model loading status tracking
- Request/response logging for debugging

## Testing

### Manual Testing
```bash
# Test health endpoint
curl http://localhost:5000/health

# Test prediction endpoint
curl -X POST -F "image=@test_image.jpg" http://localhost:5000/predict
```

### Automated Testing
```bash
# Install testing dependencies
pip install pytest requests-mock

# Run tests
pytest tests/
```

## Troubleshooting

### Common Issues

1. **Model Loading Failed**
   - Verify model files exist in `models/` directory
   - Check TensorFlow compatibility
   - Ensure sufficient memory for model loading

2. **Import Errors**
   - Verify all dependencies are installed
   - Check Python version compatibility
   - Activate virtual environment

3. **Memory Issues**
   - Reduce batch size for large images
   - Monitor memory usage during processing
   - Consider model optimization

4. **CORS Errors**
   - Verify Flask-CORS configuration
   - Check allowed origins in production

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Implement changes with tests
4. Commit changes: `git commit -am 'Add feature'`
5. Push to branch: `git push origin feature-name`
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For technical support:
- Open an issue in the repository
- Contact the development team
- Check documentation and troubleshooting guides
