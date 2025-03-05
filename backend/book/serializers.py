import django_filters
from rest_framework import serializers
from .models import *
from contributors.serializers import AuthorSerializer, TeamSerializer
from backend.image_utils import is_base64_string, save_base64_image

class CategorySerializer(serializers.ModelSerializer):
    name = django_filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Category
        fields = '__all__'

class BookSerializer(serializers.ModelSerializer):
    authors = AuthorSerializer(many=True)
    categories = CategorySerializer(many=True)
    teams = TeamSerializer(many=True)

    class Meta:
        model = Book
        fields = '__all__'

class BookStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookStatus
        fields = ['id', 'name', 'code', 'description']

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
    
class BookUpdateSerializer(serializers.ModelSerializer):
    authors = serializers.PrimaryKeyRelatedField(queryset=Author.objects.all(), many=True, required=False)
    teams = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all(), many=True, required=False)
    categories = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), many=True, required=False)
    status = serializers.PrimaryKeyRelatedField(queryset=BookStatus.objects.all(), required=False)
    img = serializers.CharField(required=False)

    class Meta:
        model = Book
        fields = ['title', 'description', 'another_name', 'img', 'authors', 'artist', 'status', 'teams', 'note', 'categories']

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.another_name = validated_data.get('another_name', instance.another_name)
        instance.artist = validated_data.get('artist', instance.artist)
        instance.status = validated_data.get('status', instance.status)
        instance.note = validated_data.get('note', instance.note)

        # Upload the image to Imgur
        img_data = validated_data.get('img', None)
        if img_data:
            if isinstance(img_data, str):
                if img_data.startswith('http'):
                    # Nếu img là URL, lưu trực tiếp
                    instance.img = img_data
                elif is_base64_string(img_data):
                    # Nếu img là base64, lưu ảnh từ base64
                    image_file = save_base64_image(img_data)
                    # Giả sử bạn lưu ảnh vào hệ thống hoặc dịch vụ cloud
                    instance.img = upload_image_to_imgur(image_file)  # Ví dụ upload lên Imgur
                else:
                    raise Exception("Invalid image data format.")

        # Many - Many Relationship
        if 'authors' in validated_data:
            instance.authors.set(validated_data['authors'])
        if 'teams' in validated_data:
            instance.teams.set(validated_data['teams'])
        if 'categories' in validated_data:
            instance.categories.set(validated_data['categories'])

        instance.save()
        return instance