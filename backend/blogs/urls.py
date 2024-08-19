from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlogViewSet, AddNumbersView,TaskStatusView

router = DefaultRouter()
router.register(r"blog", BlogViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("add-numbers/", AddNumbersView.as_view(), name="add-numbers"),
    path("task-status/<str:task_id>/", TaskStatusView.as_view(), name="task-status"),
]
