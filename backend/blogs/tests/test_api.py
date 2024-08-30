"""
Api tests for blogs.
"""

from blogs.models import Blog
from backend.base.testcase import BaseTestCase
from django.contrib.auth import (
    get_user_model,
)


class TestBlogApi(BaseTestCase):
    """
    Api tests for blogs.
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

    def test_get_list(self):
        """
        Test getting a list of blogs.
        """

        with self.assertNumQueries(2):
            response = self.client.get("/api/blog/")
            self.assertEqual(response.status_code, 200)

            data = response.data
            self.assertListEqual(
                [
                    {
                        "id": data[0]["id"],
                        "title": "test blog1",
                        "content": "test content1",
                        "created_at": "2023-08-12T10:30:00.120000Z",
                        "updated_at": "2023-08-12T10:30:00.120000Z",
                        "user": {"id": self.user.id, "username": self.user.username},
                    },
                    {
                        "id": data[1]["id"],
                        "title": "test blog2",
                        "content": "test content2",
                        "created_at": "2023-08-12T10:30:00.120000Z",
                        "updated_at": "2023-08-12T10:30:00.120000Z",
                        "user": {"id": self.user.id, "username": self.user.username},
                    },
                ],
                data,
            )

    def test_create(self):
        """
        Test creating a blog.
        """

        data = {"title": "created blog", "content": "something"}
        with self.assertNumQueries(2):
            response = self.client.post("/api/blog/", data)
            self.assertEqual(response.status_code, 201)

            data = response.data
            self.assertDictEqual(
                {
                    "id": data["id"],
                    "title": "created blog",
                    "content": "something",
                    "created_at": "2023-08-12T10:30:00.120000Z",
                    "updated_at": "2023-08-12T10:30:00.120000Z",
                    "user": {"id": self.user.id, "username": self.user.username},
                },
                data,
            )

    def test_get_larger_list(self):
        """
        Fetching a larger list should not effect the querycount.
        """

        Blog.objects.create(
            title="additional blog1", content="additional content1", user=self.user
        )
        Blog.objects.create(
            title="additional blog2", content="additional content2", user=self.user
        )
        with self.assertNumQueries(2):
            response = self.client.get("/api/blog/")
            self.assertEqual(response.status_code, 200)

            data = response.data
            self.assertListEqual(
                [
                    {
                        "id": data[0]["id"],
                        "title": "test blog1",
                        "content": "test content1",
                        "created_at": "2023-08-12T10:30:00.120000Z",
                        "updated_at": "2023-08-12T10:30:00.120000Z",
                        "user": {"id": self.user.id, "username": "testuser"},
                    },
                    {
                        "id": data[1]["id"],
                        "title": "test blog2",
                        "content": "test content2",
                        "created_at": "2023-08-12T10:30:00.120000Z",
                        "updated_at": "2023-08-12T10:30:00.120000Z",
                        "user": {"id": self.user.id, "username": "testuser"},
                    },
                    {
                        "id": data[2]["id"],
                        "title": "additional blog1",
                        "content": "additional content1",
                        "created_at": "2023-08-12T10:30:00.120000Z",
                        "updated_at": "2023-08-12T10:30:00.120000Z",
                        "user": {"id": self.user.id, "username": "testuser"},
                    },
                    {
                        "id": data[3]["id"],
                        "title": "additional blog2",
                        "content": "additional content2",
                        "created_at": "2023-08-12T10:30:00.120000Z",
                        "updated_at": "2023-08-12T10:30:00.120000Z",
                        "user": {"id": self.user.id, "username": "testuser"},
                    },
                ],
                data,
            )

    def test_update(self):
        """
        Test updating blog.
        """

        data = {"title": "updated blog title", "content": "updated content"}
        with self.assertNumQueries(3):
            response = self.client.put(f"/api/blog/{self.blog1.id}/", data)
            self.assertEqual(response.status_code, 200)

            data = response.data
            self.assertDictEqual(
                {
                    "id": self.blog1.id,
                    "title": "updated blog title",
                    "content": "updated content",
                    "created_at": "2023-08-12T10:30:00.120000Z",
                    "updated_at": "2023-08-12T10:30:00.120000Z",
                    "user": {"id": self.user.id, "username": self.user.username},
                },
                data,
            )

    def test_update_another_user_blog(self):
        """
        Another user should not be able to update blog.
        """

        another_user = get_user_model().objects.create(
            username="another_user", password="another_password"
        )
        blog = Blog.objects.create(
            title="some title", content="something", user=another_user
        )

        data = {"title": "should not be updated", "content": "should not be updated"}
        with self.assertNumQueries(2):
            response = self.client.put(f"/api/blog/{blog.id}/", data)
            self.assertEqual(response.status_code, 403)

            data = response.data
            self.assertDictEqual(
                {
                    "error": "Altering objects is allowed only to object owners",
                },
                data,
            )

    def test_partial_update(self):

        data = {"title": "updated blog title"}
        with self.assertNumQueries(3):
            response = self.client.patch(f"/api/blog/{self.blog1.id}/", data)
            self.assertEqual(response.status_code, 200)

            data = response.data
            self.assertDictEqual(
                {
                    "id": self.blog1.id,
                    "title": "updated blog title",
                    "content": "test content1",
                    "created_at": "2023-08-12T10:30:00.120000Z",
                    "updated_at": "2023-08-12T10:30:00.120000Z",
                    "user": {"id": self.user.id, "username": self.user.username},
                },
                data,
            )

    def test_partial_update_another_user_blog(self):
        """
        Another user should not be able to update blog.
        """
        another_user = get_user_model().objects.create(
            username="another_user", password="another_password"
        )
        blog = Blog.objects.create(
            title="some title", content="something", user=another_user
        )

        data = {"title": "should not be updated"}
        with self.assertNumQueries(2):
            response = self.client.patch(f"/api/blog/{blog.id}/", data)
            self.assertEqual(response.status_code, 403)

            data = response.data
            self.assertDictEqual(
                {
                    "error": "Altering objects is allowed only to object owners",
                },
                data,
            )

    def test_delete(self):
        with self.assertNumQueries(3):
            response = self.client.delete(f"/api/blog/{self.blog1.id}/")
            self.assertEqual(response.status_code, 204)

    def test_delete_another_user_blog(self):
        """
        Another user should not be able to delete blogs.
        """
        another_user = get_user_model().objects.create(username="another_user")
        # blog = Blog.objects.create(
        #     title="some title", content="something", user=another_user
        # )
        self.switch_user(another_user)

        with self.assertNumQueries(2):
            response = self.client.delete(f"/api/blog/{self.blog1.id}/")
            self.assertEqual(response.status_code, 403)

            data = response.data
            self.assertDictEqual(
                {
                    "error": "Altering objects is allowed only to object owners",
                },
                data,
            )
