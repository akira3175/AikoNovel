from rest_framework.permissions import BasePermission
from .models import TeamMember
from contributors.models import Author

class IsAuthor(BasePermission):
    """
    Permission to check if the user is an author.
    """
    def has_permission(self, request, view):
        user = request.user
        # Kiểm tra nếu người dùng có đối tượng Author
        return Author.objects.filter(user=user).exists()

class IsLeaderOfTeam(BasePermission):
    """
    Permission to check if the user is the leader of a specific team.
    """
    def has_permission(self, request, view):
        user = request.user
        team_id = view.kwargs.get('team_id')  # Lấy id nhóm từ URL
        if not team_id:
            return False
        
        # Kiểm tra nếu người dùng là trưởng nhóm của nhóm dịch
        return TeamMember.objects.filter(user=user, team_id=team_id, role__name='Leader').exists()