from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import *

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('info/', UserInfoView.as_view(), name='user_info'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('check-username/', CheckUsernameView.as_view(), name='check-username'),
    path('check-email/', CheckEmailView.as_view(), name='check-email'),
]
