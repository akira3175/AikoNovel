from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import *

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('info/', UserInfoView.as_view(), name='user-info'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('check-username/', CheckUsernameView.as_view(), name='check-username'),
    path('check-email/', CheckEmailView.as_view(), name='check-email'),
    path('update-fullname/', UpdateFullNameView.as_view(), name='update-fullname'),
    path('update-avatar/', UpdateAvatarView.as_view(), name='update-avatar'),
    path('update-background/', UpdateBackgroundView.as_view(), name='update-background'),
    path('<str:username>/', UserInfoByUsernameView.as_view(), name='user-info'),
]
