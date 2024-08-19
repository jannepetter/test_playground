from rest_framework import serializers
from blogs.models import Blog


class BlogSerializer(  # pylint: disable=too-few-public-methods
    serializers.ModelSerializer
):
    class Meta:
        model = Blog
        fields = ["id", "title", "content", "created_at", "updated_at"]
