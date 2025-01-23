from django.urls import path
from .views import *
urlpatterns = [
    path('register-author/', RegisterAuthorView.as_view(), name='register-author'),
    path('get-pen-name/', GetPenNameView.as_view(), name='get-pen-name'),
    path('update-pen-name/', UpdatePenNameView.as_view(), name='update-pen-name'),
    path('create-team/', CreateTranslateTeamView.as_view(), name='create-team'),
    path('add-member/', AddMemberToTeamView.as_view(), name='add-member'),
]
