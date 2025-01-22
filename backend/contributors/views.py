from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Author
from .serializers import AuthorSerializer

class RegisterAuthorView(APIView):
    permission_classes = [IsAuthenticated] 

    def post(self, request):
        if Author.objects.filter(user=request.user).exists():
            return Response({"error": "User is already registered as an author."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = AuthorSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save() 
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class GetPenNameView(APIView):
    permission_classes = [IsAuthenticated]  

    def get(self, request):
        try:
            author = Author.objects.get(user=request.user)
            return Response({"pen_name": author.pen_name}, status=200)
        except Author.DoesNotExist:
            return Response({"error": "User does not have a pen name."}, status=404)