from backend.base.viewset import BaseModelViewSet

from .models import Blog
from .serializers import BlogResponseSerializer, BlogSerializer

class BlogViewSet(BaseModelViewSet):
    queryset = Blog.objects.all().select_related("user").order_by("id")
    serializer_class = BlogSerializer
    response_serializer_class = BlogResponseSerializer
    http_method_names = ["get", "post", "put", "patch", "delete"]