try:
    import cv2
    print(f"OpenCV version: {cv2.__version__}")
    print("OpenCV installed successfully!")
    
    # Test face detection
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    print("Face detection classifier loaded successfully!")
    
except ImportError as e:
    print(f"Error importing OpenCV: {e}")
    print("Please install OpenCV with: pip install opencv-python")