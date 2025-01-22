from django.urls import path
from .views import *
urlpatterns = [
    path('register-author/', RegisterAuthorView.as_view(), name='register-author'),
    path('get-pen-name/', GetPenNameView.as_view(), name='get-pen-name'),
]
