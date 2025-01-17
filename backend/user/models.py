from django import forms
from django.db import models
from django.contrib.auth.models import User
from backend.imgur_utils import upload_image_to_imgur

class UserInfo(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, db_index=True, primary_key=True)
    full_name = models.CharField(max_length=100, null=True)
    img_avatar = models.CharField(max_length=255, null=True, blank=True, default='https://i.imgur.com/default-avatar.jpg')  # Sử dụng CharField để lưu URL
    img_background = models.CharField(max_length=255, null=True, blank=True)
    img_background_position = models.IntegerField(default=0)

    def save(self, *args, **kwargs):
        # Save image to Imgur 
        if self.img_avatar and hasattr(self.img_avatar, 'file'):
            if not self.img_avatar.startswith('http'):
                image_file = self.img_avatar.file
                img_url = upload_image_to_imgur(image_file)
                self.img_avatar = img_url

        if self.img_background and hasattr(self.img_background, 'file'):
            if not self.img_background.startswith('http'):
                image_file = self.img_background.file
                img_url = upload_image_to_imgur(image_file)
                self.img_background = img_url  

        super().save(*args, **kwargs)  

    def __str__(self):
        return self.user.username
