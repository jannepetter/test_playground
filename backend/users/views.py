from backend.base.viewset import BaseModelViewSet
from django.contrib.auth.models import User
from .serializers import UserResponseSerializer
from rest_framework.permissions import IsAdminUser


class UserViewSet(BaseModelViewSet):
    queryset = User.objects.all().order_by("id")
    permission_classes = [IsAdminUser]
    serializer_class = None
    response_serializer_class = UserResponseSerializer
    http_method_names = ["get"]
