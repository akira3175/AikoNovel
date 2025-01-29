import django_filters
from rest_framework import serializers
from .models import *
from contributors.serializers import AuthorSerializer

class CategorySerializer(serializers.ModelSerializer):
    name = django_filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Category
        fields = '__all__'

class BookSerializer(serializers.ModelSerializer):
    authors = AuthorSerializer(many=True)
    categories = CategorySerializer(many=True)

    class Meta:
        model = Book
        fields = '__all__'

class CreateBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['title']

    def create(self, validated_data):
        # Tạo sách mới
        book = Book.objects.create(**validated_data)

        # Lấy user hiện tại (tác giả)
        user = self.context['request'].user

        # Kiểm tra xem user có phải là tác giả không
        try:
            author = Author.objects.get(user=user)
        except Author.DoesNotExist:
            raise serializers.ValidationError("User is not an author.")

        # Thêm tác giả vào sách và đánh dấu là tác giả chính
        BookAuthor.objects.create(book=book, author=author, is_main_author=True)

        return book
    
class UpdateBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = [
            'description', 'another_name', 'img', 'authors', 
            'artist', 'status', 'note', 'quantity_volume', 'categories'
        ]
