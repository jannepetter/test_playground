"""
Api tests for blogs.
"""

from blogs.models import Blog
from backend.base.testcase import BaseTestCase
from django.contrib.auth import (
    get_user_model,
)
from django.test import tag


@tag("api", "integration")
class TestBlogApi(BaseTestCase):
    """
    Api filter tests for blogs.
    """

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.user = get_user_model().objects.create(username="testuser")
        cls.blog1 = Blog.objects.create(
            title="test blog1", content="test content1", user=cls.user
        )
        cls.blog2 = Blog.objects.create(
            title="test blog2", content="test content2", user=cls.user
        )

        cls.user2 = get_user_model().objects.create(username="anotheruser")
        cls.blog3 = Blog.objects.create(
            title="test blog3", content="test content3", user=cls.user2
        )
        cls.blog4 = Blog.objects.create(
            title="test blog4", content="test content4", user=cls.user2
        )

    def test_get_list(self):
        """
        Test getting a list of blogs for anotheruser.
        """

        with self.assertNumQueries(3):
            response = self.client.get("/api/blog/?username=anotheruser")
            self.assertEqual(response.status_code, 200)

            data = response.data
            self.assertDictEqual(
                {
                    "count": 2,
                    "next": None,
                    "previous": None,
                    "results":
                    [
                        {
                            "id": data["results"][0]["id"],
                            "title": "test blog3",
                            "content": "test content3",
                            "created_at": "2023-08-12T10:30:00.120000Z",
                            "updated_at": "2023-08-12T10:30:00.120000Z",
                            "user": {"id": self.user2.id, "username": "anotheruser"},
                        },
                        {
                            "id": data["results"][1]["id"],
                            "title": "test blog4",
                            "content": "test content4",
                            "created_at": "2023-08-12T10:30:00.120000Z",
                            "updated_at": "2023-08-12T10:30:00.120000Z",
                            "user": {"id": self.user2.id, "username": "anotheruser"},
                        },
                    ]
                },
                data,
            )

    def test_incorrect_filter(self):
        """
        Test getting a list for nonexistent user.
        """

        with self.assertNumQueries(2):
            response = self.client.get("/api/blog/?username=doesnotexist")
            self.assertEqual(response.status_code, 200)

            data = response.data
            self.assertDictEqual(
                {
                    "count": 0,
                    "next": None,
                    "previous": None,
                    "results": []
                },
                data,
            )
