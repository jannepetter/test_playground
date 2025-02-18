from backend.base.viewset import BaseModelViewSet
import django_filters
from .models import Blog
from .serializers import BlogResponseSerializer, BlogSerializer


class BlogFilter(django_filters.FilterSet):
    """
    Blogfilter.
    """
    username = django_filters.CharFilter(
        field_name="user__username", lookup_expr="exact")

    class Meta:
        model = Blog
        fields = []


class BlogViewSet(BaseModelViewSet):
    queryset = Blog.objects.all().select_related("user").order_by("id")
    serializer_class = BlogSerializer
    response_serializer_class = BlogResponseSerializer
    http_method_names = ["get", "post", "put", "patch", "delete"]

    def get_queryset(self):
        queryset = super().get_queryset()
        filterset = BlogFilter(self.request.GET, queryset=queryset)

        if filterset.is_valid():
            queryset = filterset.qs

        return queryset
