from rest_framework import viewsets
from backend.base.viewset import BaseModelViewSet
from .models import Blog
from .serializers import BlogSerializer
from .tasks import add
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class BlogViewSet(BaseModelViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer

    def perform_create(self, serializer):
        """
        Override this method to handle user-related logic during creation.
        """
        user = self.get_user()
        serializer.save(user=user)


class AddNumbersView(APIView):
    def post(self, request):
        x = request.data.get('x')
        y = request.data.get('y')
        if x is None or y is None:
            return Response({"error": "Please provide both 'x' and 'y' values."}, status=status.HTTP_400_BAD_REQUEST)

        result = add.delay(x, y)
        print("result---",result)
        
        return Response({"task_id": result.id}, status=status.HTTP_202_ACCEPTED)

class TaskStatusView(APIView):
    def get(self, request, task_id):
        from celery.result import AsyncResult
        result = AsyncResult(task_id)
        print("getting---",result)

        if result.ready():
            # If the task is done, provide the result
            return Response({"task_id": task_id, "status": result.status, "result": result.result}, status=status.HTTP_200_OK)
            # return Response({"joo": task_id}, status=status.HTTP_200_OK)

        else:
            # If the task is not done, provide the status
            return Response({"task_id": task_id, "status": result.status}, status=status.HTTP_202_ACCEPTED)