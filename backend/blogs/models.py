"""
Model def.
"""

from django.db import models
from django.contrib.auth.models import User


class Blog(models.Model):
    """
    Blog model.
    """

    title = models.CharField(max_length=50)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="blogs")

    def __str__(self):
        return str(self.title)
