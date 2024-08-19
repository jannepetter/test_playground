"""
Custom viewsets.
"""

from rest_framework import viewsets
from django.contrib.auth.models import User


class BaseModelViewSet(viewsets.ModelViewSet):
    """
    Basemodel viewset.
    """

    def get_user(self):
        """
        Returns the currently authenticated user.
        """
        # TODO: token and get user from token
        # user = User.objects.get(id=1)
        print("jooo user-----------", self.request.user)
        # return user
        return self.request.user

    def perform_create(self, serializer):
        """
        Override this method to handle user-related logic during creation.
        """
        if "user" in serializer.fields:
            user = self.get_user()
            serializer.save(user=user)
        else:
            serializer.save()
