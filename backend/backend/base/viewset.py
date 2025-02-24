"""
Custom viewsets.
"""

from rest_framework import status
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework.request import Request
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView


class BaseModelViewSet(viewsets.ModelViewSet):
    """
    Basemodel viewset.
    """

    serializer_class = None
    response_serializer_class = None

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = self.perform_create(serializer, request.user)
        headers = self.get_success_headers(serializer.data)
        response_serializer = self.get_response_serializer(instance)

        return Response(
            response_serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def perform_create(self, serializer, user):
        return serializer.save(user=user)

    def is_instance_owner(self, instance):

        if instance.user.id == self.request.user.id:
            return True

        return False

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        if not self.is_instance_owner(instance):
            return Response(
                {"error": "Altering objects is allowed only to object owners"},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        updated_obj = self.perform_update(serializer)
        response_serializer = self.get_response_serializer(updated_obj)

        return Response(response_serializer.data)

    def perform_update(self, serializer):
        return serializer.save()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if not self.is_instance_owner(instance):
            return Response(
                {"error": "Altering objects is allowed only to object owners"},
                status=status.HTTP_403_FORBIDDEN,
            )

        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def get_serializer(self, *args, **kwargs):

        if self.request.method == "GET":
            return self.get_response_serializer(*args, **kwargs)

        serializer_class = self.get_serializer_class()
        kwargs.setdefault("context", self.get_serializer_context())
        return serializer_class(*args, **kwargs)

    def get_response_serializer(self, *args, **kwargs):

        kwargs.setdefault("context", self.get_serializer_context())
        if self.response_serializer_class:
            return self.response_serializer_class(*args, **kwargs)

        serializer_class = self.get_serializer_class()
        return serializer_class(*args, **kwargs)


class CustomTokenObtainPairView(TokenObtainPairView):

    def post(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        user = {
            "username": serializer.user.username,
            "id": serializer.user.id,
            "admin": serializer.user.is_staff,
        }
        data = serializer.validated_data
        data["user"] = user

        return Response(data, status=status.HTTP_200_OK)


class HealthCheckView(APIView):

    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"status": "ok"})
