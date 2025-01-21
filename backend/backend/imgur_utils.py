import os
import requests
from PIL import Image
import io
import pillow_avif 
import PIL

# Retrieve the Imgur Client ID from environment variables
IMGUR_CLIENT_ID = os.getenv('IMGUR_CLIENT_ID')

def upload_image_to_imgur(image_file):
    """
    Uploads an image to Imgur from a Django UploadedFile.
    Converts unsupported formats to PNG before uploading.
    """
    headers = {'Authorization': f'Client-ID {IMGUR_CLIENT_ID}'}
    
    try:
        # Reset the file pointer to the beginning
        image_file.seek(0)
        
        # Attempt to open the image and handle any errors
        try:
            image = Image.open(image_file)
        except (IOError, SyntaxError) as e:
            raise Exception(f"Invalid image file: {str(e)}")
        
        # Reset the pointer after verification
        image_file.seek(0)
        
        # Create a BytesIO object to hold the image data
        img_byte_arr = io.BytesIO()
        
        # Check if the image format is supported
        if image.format not in ['JPEG', 'PNG', 'GIF', 'BMP']:
            # Convert to PNG if the format is not supported
            image.save(img_byte_arr, format='PNG')
        else:
            # Save the image in its original format
            image.save(img_byte_arr, format=image.format)
        
        # Reset the pointer to the beginning of the BytesIO object
        img_byte_arr.seek(0)
        
        # Prepare the files for upload
        files = {
            'image': ('image', img_byte_arr, f'image/{image.format.lower()}')
        }
        
        # Send the image to Imgur
        response = requests.post(
            'https://api.imgur.com/3/image',
            headers=headers,
            files=files
        )
        
        # Debugging: Print response status and text
        print(f"Upload status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            # Return the image URL if the upload is successful
            return response.json()['data']['link']
        else:
            # Raise an exception if the upload failed
            error_msg = response.json().get('data', {}).get('error', 'Unknown error')
            raise Exception(f"Imgur upload failed: {response.status_code}, {error_msg}")
            
    except requests.exceptions.RequestException as e:
        # Handle any network-related errors
        print(f"Request error: {str(e)}")
        raise Exception(f"Error uploading image to Imgur: {str(e)}")
    
    except Exception as e:
        # Handle any other errors
        print(f"Error details: {str(e)}")
        raise Exception(f"Error processing image: {str(e)}")
