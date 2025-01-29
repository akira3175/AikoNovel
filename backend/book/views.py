from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from .models import *
from .serializers import *
from .permissions import *
from django_filters.rest_framework import DjangoFilterBackend

class BookDetailView(APIView):
    """
    API view to retrieve details of a book by its ID.
    """
    def get(self, request, book_id, *args, **kwargs):
        try:
            # Lấy thông tin quyển sách từ database theo ID
            book = Book.objects.get(id=book_id)
        except Book.DoesNotExist:
            # Nếu không tìm thấy quyển sách, trả về lỗi 404
            return Response({"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)

        # Serialize dữ liệu của quyển sách
        serializer = BookSerializer(book)

        # Trả về thông tin quyển sách dưới dạng JSON
        return Response(serializer.data, status=status.HTTP_200_OK)

class BooksByPenNameView(APIView):
    """
    API view to retrieve all books by a specific author based on their pen name.
    """
    def get(self, request, pen_name, *args, **kwargs):
        try:
            # Lấy tác giả theo pen_name
            author = Author.objects.get(pen_name=pen_name)
        except Author.DoesNotExist:
            return Response({"error": "Author not found"}, status=status.HTTP_404_NOT_FOUND)

        # Lấy tất cả các sách mà tác giả này tham gia sáng tác
        books = Book.objects.filter(authors=author)

        # Serialize danh sách sách
        serializer = BookSerializer(books, many=True)

        # Trả về danh sách sách của tác giả
        return Response(serializer.data, status=status.HTTP_200_OK)

class CreateBookByAuthorView(APIView):
    permission_classes = [IsAuthor]  # Chỉ cho phép tác giả tạo truyện

    def post(self, request, *args, **kwargs):
        serializer = CreateBookSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            book = serializer.save()
            return Response({
                "message": "Book created successfully by Author",
                "id": book.id,
                "title": book.title
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateBookByLeaderView(APIView):
    permission_classes = [IsLeaderOfTeam]  # Chỉ cho phép trưởng nhóm tạo truyện

    def post(self, request, *args, **kwargs):
        serializer = CreateBookSerializer(data=request.data)
        if serializer.is_valid():
            book = serializer.save()
            return Response({
                "message": "Book created successfully by Team Leader",
                "id": book.id,
                "title": book.title
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateBookView(APIView):
    def put(self, request, book_id, *args, **kwargs):
        try:
            book = Book.objects.get(id=book_id)
        except Book.DoesNotExist:
            return Response({"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UpdateBookSerializer(book, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Book updated successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['name']
