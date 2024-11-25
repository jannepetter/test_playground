from rest_framework import serializers
from users.serializers import UserRelatedSerializer

from blogs.models import Blog


class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ["id", "title", "content", "created_at", "updated_at"]


class BlogResponseSerializer(serializers.ModelSerializer):
    user = UserRelatedSerializer()

    class Meta:
        model = Blog
        fields = ["id", "title", "content", "created_at", "updated_at", "user"]
