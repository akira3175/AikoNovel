from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
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