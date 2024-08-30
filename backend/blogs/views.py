from backend.base.viewset import BaseModelViewSet
from .models import Blog
from .serializers import BlogSerializer, BlogResponseSerializer
from .tasks import add
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny


class BlogViewSet(BaseModelViewSet):
    queryset = Blog.objects.all().select_related("user")
    serializer_class = BlogSerializer
    response_serializer_class = BlogResponseSerializer
    http_method_names = ["get", "post", "put", "patch", "delete"]


class AddNumbersView(APIView):
    def post(self, request):
        x = request.data.get("x")
        y = request.data.get("y")
        if x is None or y is None:
            return Response(
                {"error": "Please provide both 'x' and 'y' values."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        result = add.delay(x, y)

        return Response({"task_id": result.id}, status=status.HTTP_202_ACCEPTED)


class TaskStatusView(APIView):
    def get(self, request, task_id):
        from celery.result import AsyncResult

        result = AsyncResult(task_id)

        if result.ready():
            return Response(
                {"task_id": task_id, "status": result.status, "result": result.result},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"task_id": task_id, "status": result.status},
                status=status.HTTP_202_ACCEPTED,
            )
