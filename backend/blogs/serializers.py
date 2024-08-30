from rest_framework import serializers
from blogs.models import Blog
from users.serializers import UserRelatedSerializer


class BlogSerializer(  # pylint: disable=too-few-public-methods
    serializers.ModelSerializer
):
    class Meta:
        model = Blog
        fields = ["id", "title", "content", "created_at", "updated_at"]


class BlogResponseSerializer(  # pylint: disable=too-few-public-methods
    serializers.ModelSerializer
):
    user = UserRelatedSerializer()

    class Meta:
        model = Blog
        fields = ["id", "title", "content", "created_at", "updated_at", "user"]
