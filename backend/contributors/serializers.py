from rest_framework import serializers
from .models import *

class AuthorSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    
    class Meta:
        model = Author
        fields = ['id', 'pen_name', 'username']  

    def get_username(self, obj):
        # Lấy username từ user liên kết với Author
        return obj.user.username if obj.user else None

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class UpdatePenNameSerializer(serializers.Serializer):
    pen_name = serializers.CharField(max_length=100)

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name', 'description']

class TeamMemberSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  
    role = RoleSerializer()

    class Meta:
        model = TeamMember
        fields = ['user', 'role', 'team']

class TeamSerializer(serializers.ModelSerializer):
    members = TeamMemberSerializer(source='teammember_set', many=True)

    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'members', 'type']