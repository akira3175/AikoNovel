from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Author
from .serializers import *

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
        
class UpdatePenNameView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def put(self, request, *args, **kwargs):
        user = request.user
        try:
            # Fetch the Author object related to the authenticated user
            author = Author.objects.get(user=user)
        except Author.DoesNotExist:
            return Response({"detail": "Author not found."}, status=status.HTTP_404_NOT_FOUND)

        # Validate the input data
        serializer = UpdatePenNameSerializer(data=request.data)
        if serializer.is_valid():
            # Update the pen_name of the Author object
            author.pen_name = serializer.validated_data['pen_name']
            author.save()
            return Response({"detail": "Pen name updated successfully."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CreateTranslateTeamView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = TranslateTeamSerializer(data=request.data)
        if serializer.is_valid():
            team = serializer.save()
            return Response({
                "message": "Translate team created successfully",
                "id": team.id,
                "name": team.name
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AddMemberToTeamView(APIView):
    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        team_id = request.data.get('team_id')
        role_name = request.data.get('role_name')

        try:
            user = User.objects.get(id=user_id)
            team = TranslateTeam.objects.get(id=team_id)
            role = Role.objects.get(name=role_name)
        except (User.DoesNotExist, TranslateTeam.DoesNotExist, Role.DoesNotExist):
            return Response({"error": "Invalid user, team, or role"}, status=status.HTTP_400_BAD_REQUEST)

        team_member = TeamMember.objects.create(user=user, team=team, role=role)
        return Response({
            "message": "Member added to team successfully",
            "user": user.username,
            "team": team.name,
            "role": role.name
        }, status=status.HTTP_201_CREATED)