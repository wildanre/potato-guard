import numpy as np
import cv2 
from PIL import Image, ImageEnhance, ImageFilter
import io

def enhance_image_quality(image_bytes):
    """
    Apply image enhancement techniques to improve detection accuracy
    """
    # Open image
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img_array = np.array(img)
    
    # Apply multiple enhancement techniques
    enhanced_images = []
    
    # Original image
    enhanced_images.append(img_array)
    
    # Contrast enhancement
    enhancer = ImageEnhance.Contrast(img)
    contrast_img = enhancer.enhance(1.2)
    enhanced_images.append(np.array(contrast_img))
    
    # Brightness adjustment
    enhancer = ImageEnhance.Brightness(img)
    bright_img = enhancer.enhance(1.1)
    enhanced_images.append(np.array(bright_img))
    
    # Sharpening
    sharp_img = img.filter(ImageFilter.SHARPEN)
    enhanced_images.append(np.array(sharp_img))
    
    # Color saturation
    enhancer = ImageEnhance.Color(img)
    color_img = enhancer.enhance(1.1)
    enhanced_images.append(np.array(color_img))
    
    return enhanced_images

def apply_test_time_augmentation(img_array):
    """
    Apply test-time augmentation for more robust predictions
    """
    augmented_images = []
    
    # Original
    augmented_images.append(img_array)
    
    # Horizontal flip
    augmented_images.append(np.fliplr(img_array))
    
    # Small rotations
    for angle in [-5, 5]:
        h, w = img_array.shape[:2]
        center = (w // 2, h // 2)
        matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
        rotated = cv2.warpAffine(img_array, matrix, (w, h))
        augmented_images.append(rotated)
    
    # Small zoom (crop and resize)
    h, w = img_array.shape[:2]
    crop_size = int(min(h, w) * 0.9)
    start_h = (h - crop_size) // 2
    start_w = (w - crop_size) // 2
    cropped = img_array[start_h:start_h+crop_size, start_w:start_w+crop_size]
    zoomed = cv2.resize(cropped, (w, h))
    augmented_images.append(zoomed)
    
    return augmented_images

def calculate_image_metrics(img_array):
    """
    Calculate image quality metrics
    """
    # Convert to grayscale for some calculations
    gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
    
    # Sharpness (Laplacian variance)
    sharpness = cv2.Laplacian(gray, cv2.CV_64F).var()
    
    # Brightness
    brightness = np.mean(img_array)
    
    # Contrast (standard deviation)
    contrast = np.std(gray)
    
    # Color distribution
    color_std = np.std(img_array, axis=(0, 1))
    color_balance = np.mean(color_std)
    
    return {
        'sharpness': float(sharpness),
        'brightness': float(brightness),
        'contrast': float(contrast),
        'color_balance': float(color_balance)
    }

def calibrate_confidence(raw_confidence, image_metrics):
    """
    Calibrate confidence based on image quality metrics
    """
    # Base confidence
    calibrated = raw_confidence
    
    # Adjust based on sharpness
    if image_metrics['sharpness'] < 100:  # Low sharpness
        calibrated *= 0.85
    elif image_metrics['sharpness'] > 500:  # Good sharpness
        calibrated *= 1.05
    
    # Adjust based on brightness
    brightness = image_metrics['brightness']
    if brightness < 50 or brightness > 200:  # Too dark or too bright
        calibrated *= 0.9
    
    # Adjust based on contrast
    if image_metrics['contrast'] < 30:  # Low contrast
        calibrated *= 0.8
    
    return min(calibrated, 1.0)  # Cap at 1.0
