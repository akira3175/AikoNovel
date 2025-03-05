from django.urls import path
from .views import *

urlpatterns = [
    path('create-book/author/', CreateBookByAuthorView.as_view(), name='create-book-author'),
    path('create-book/leader/<int:team_id>/', CreateBookByLeaderView.as_view(), name='create-book-leader'),
    path('update-book/<int:pk>/', BookPartialUpdateView.as_view(), name='book-update'),
    path('create-volume/', CreateVolumeAPIView.as_view(), name='create-volume'),
    path('author/pen_name/<str:pen_name>/', BooksByPenNameView.as_view(), name='books-by-pen-name'), 
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('bookstatus/', BookStatusListAPIView.as_view(), name='bookstatus-list'),
    path('<int:book_id>/', BookDetailView.as_view(), name='book-detail'),
]
