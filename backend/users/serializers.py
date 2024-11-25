from django.contrib.auth.models import User  # If using the default User model
from rest_framework import serializers


class UserRelatedSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]
