from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from backend.base.viewset import BaseModelViewSet

from .models import Blog
from .serializers import BlogResponseSerializer, BlogSerializer
from .tasks import add


class BlogViewSet(BaseModelViewSet):
    queryset = Blog.objects.all().select_related("user")
    serializer_class = BlogSerializer
    response_serializer_class = BlogResponseSerializer
    http_method_names = ["get", "post", "put", "patch", "delete"]