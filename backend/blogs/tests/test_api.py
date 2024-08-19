"""
Api tests for blogs.
"""

from datetime import datetime
from rest_framework_simplejwt.tokens import RefreshToken
from blogs.models import Blog
from backend.base.testcase import BaseTestCase


class TestBlogApi(BaseTestCase):
    """
    Api tests for blogs.
    """

    # def test_get(self):
    #     response = self.client.get("http://localhost:8000/api/blog/")
    #     self.assertListEqual([],response.data)

    def test_create(self):
        """
        Test creating a blog.
        """

        data = {"title": "joo", "content": "jee"}
        with self.assertNumQueries(2):
            response = self.client.post("/api/blog/", data)
            self.assertDictEqual(
                {
                    "id": 1,
                    "title": "joo",
                    "content": "jee",
                    "created_at": "2023-08-12T10:30:00.120000Z",
                    "updated_at": "2023-08-12T10:30:00.120000Z",
                },
                response.data,
            )

    # def test_juuei(self):
    #     Blog.objects.create(
    #         title="juuei",
    #         content="ei"
    #     )
    #     resp = self.client.get("http://localhost:8000/api/blog/")
    #     print("len--",len(resp.json()))
    #     print("resp3--",resp.json())
    #     self.assertEqual(resp.json()[0]["id"], 1)

    # def test_upper(self):
    #     Blog.objects.create(
    #         title="jeps",
    #         content="joo"
    #     )
    #     resp = self.client.get("http://localhost:8000/api/blog/")
    #     data = resp.json()
    #     assert data[0]["id"]== 2
    #     print("len--",len(resp.json()))
    #     print("resp--", data)

    #     self.assertEqual('foo'.upper(), 'FOO')

    # def test_juu(self):
    #     resp = self.client.get("http://localhost:8000/api/blog/")
    #     print("len--",len(resp.json()))
    #     print("res2p--",resp.json())

    #     self.assertEqual('foo'.upper(), 'FOO')
