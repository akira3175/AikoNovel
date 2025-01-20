from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import UserInfo
from .serializers import *

class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_info = UserInfo.objects.get(user=user)
        user_info = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'fullname': user_info.full_name,
            'img_avatar': user_info.img_avatar,
            'img_background': user_info.img_background,
            'img_background_position': user_info.img_background_position,
        }
        return Response(user_info)
    
class LoginAPIView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        # Xác thực người dùng
        user = authenticate(username=username, password=password)

        if user is not None:
            # Tạo token
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Login successful",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "username": user.username,
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "message": "Invalid username or password"
            }, status=status.HTTP_401_UNAUTHORIZED)
        
class RegisterView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CheckUsernameView(APIView):
    def get(self, request, *args, **kwargs):
        username = request.query_params.get('username', None)
        if username is None:
            return Response({'error': 'Username parameter is required'}, status=400)
        
        exists = User.objects.filter(username=username).exists()
        return Response({'exists': exists})

class CheckEmailView(APIView):
    def get(self, request, *args, **kwargs):
        email = request.query_params.get('email', None)
        if email is None:
            return Response({'error': 'Email parameter is required'}, status=400)
        
        exists = User.objects.filter(email=email).exists()
        return Response({'exists': exists})