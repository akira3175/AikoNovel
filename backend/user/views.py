from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import UserInfo

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