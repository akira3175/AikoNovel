from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        # Create user with hashed password
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        # Create User Info from User
        UserInfo.objects.create(user=user, full_name=user.username)
        
        return user
 
class UserInfoSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')  # Lấy username từ User model

    class Meta:
        model = UserInfo
        fields = ['username', 'full_name', 'img_avatar', 'img_background', 'img_background_position']

class UpdateFullNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ['full_name']


class UpdateAvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ['img_avatar']

    def validate_img_avatar(self, value):
        if value and not value.startswith("http"):
            raise serializers.ValidationError("Avatar must be a valid URL.")
        return value


class UpdateBackgroundSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ['img_background']

    def validate_img_background(self, value):
        if value and not value.startswith("http"):
            raise serializers.ValidationError("Background must be a valid URL.")
        return value