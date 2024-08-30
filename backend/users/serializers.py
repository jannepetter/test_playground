from rest_framework import serializers
from django.contrib.auth.models import User  # If using the default User model


class UserRelatedSerializer(  # pylint: disable=too-few-public-methods
    serializers.ModelSerializer
):
    class Meta:
        model = User
        fields = ["id", "username"]
