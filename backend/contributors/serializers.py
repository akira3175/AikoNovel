from rest_framework import serializers
from .models import Author

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'pen_name']  

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
