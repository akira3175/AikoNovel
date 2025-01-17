import os
import requests

# Get Client ID from file .env
IMGUR_CLIENT_ID = os.getenv('IMGUR_CLIENT_ID')

def upload_image_to_imgur(image_file):
    """
    Tải ảnh lên Imgur và trả về URL của ảnh.
    """
    headers = {'Authorization': f'Client-ID {IMGUR_CLIENT_ID}'}
    
    # Send request to Imgur API for download image
    response = requests.post(
        'https://api.imgur.com/3/image',
        headers=headers,
        files={'image': image_file}
    )

    print(response.status_code)
    print(response.text)

    if response.status_code == 200:
        data = response.json()
        return data['data']['link']  # Get image URL 
    else:
        raise Exception(f"Error uploading image: {response.status_code}")
