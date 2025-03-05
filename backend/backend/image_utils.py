import base64
from io import BytesIO
from PIL import Image
from django.core.files.base import ContentFile

def is_base64_string(data):
    """Kiểm tra xem dữ liệu có phải base64 hay không"""
    try:
        base64.b64decode(data)
        return True
    except Exception:
        return False

def save_base64_image(base64_string):
    """Chuyển đổi base64 thành file image và trả về file object"""
    try:
        # Giải mã base64 thành bytes
        image_data = base64.b64decode(base64_string.split('base64,')[-1])
        image = Image.open(BytesIO(image_data))

        # Tạo tên file cho ảnh
        image_name = 'uploaded_image.png'
        
        # Save to a ContentFile (file object)
        image_io = BytesIO()
        image.save(image_io, format='PNG')
        image_file = ContentFile(image_io.getvalue(), name=image_name)
        
        return image_file
    except Exception as e:
        raise Exception(f"Error processing base64 image: {str(e)}")