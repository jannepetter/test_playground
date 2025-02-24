"""
Api tests for users.
"""

from backend.base.testcase import BaseTestCase
from django.contrib.auth import (
    get_user_model,
)
from rest_framework.exceptions import ErrorDetail
from django.test import tag


@tag("api", "integration")
class TestUserApi(BaseTestCase):
    """
    Api tests for users.
    """

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.user = get_user_model().objects.create(username="testuser")
        cls.user.set_password("test_password")
        cls.user.save()

    def test_get_token_pair(self):
        """
        Test getting token pair and user data.
        """
        with self.assertNumQueries(1):
            data = {"username": "testuser", "password": "test_password"}
            response = self.client.post("/api/token/", data)
            self.assertEqual(response.status_code, 200)

            data = response.data
            self.assertDictEqual(
                {
                    "refresh": data["refresh"],
                    "access": data["access"],
                    "user": {
                        "username": "testuser",
                        "id": self.user.id,
                        "admin": False,
                    },
                },
                data,
            )

    def test_get_admin_token_pair(self):
        """
        Test getting token pair and user data for admin user.
        """
        admin_user = get_user_model().objects.create(
            username="admin_user", is_staff=True
        )
        admin_user.set_password("test_password")
        admin_user.save()

        with self.assertNumQueries(1):
            data = {"username": "admin_user", "password": "test_password"}
            response = self.client.post("/api/token/", data)
            self.assertEqual(response.status_code, 200)

            data = response.data
            self.assertDictEqual(
                {
                    "refresh": data["refresh"],
                    "access": data["access"],
                    "user": {
                        "username": "admin_user",
                        "id": admin_user.id,
                        "admin": True,
                    },
                },
                data,
            )

    def test_get_token_false_credentials(self):
        """
        Test getting token pair with false data.
        """
        with self.assertNumQueries(1):
            data = {"username": "testuser", "password": "test"}
            response = self.client.post("/api/token/", data)
            self.assertEqual(response.status_code, 401)

            data = response.data
            self.assertDictEqual(
                {
                    "detail": ErrorDetail(
                        string="No active account found with the given credentials",
                        code="no_active_account",
                    )
                },
                data,
            )

    def test_get_list(self):
        """
        Test getting user list as a basic user.
        """
        # default is the client user
        self.switch_user(self.user)
        with self.assertNumQueries(1):
            response = self.client.get("/api/user/")
            self.assertEqual(response.status_code, 403)

            data = response.data
            self.assertDictEqual(
                {
                    "detail": ErrorDetail(
                        string="You do not have permission to perform this action.",
                        code="permission_denied",
                    )
                },
                data,
            )

    def test_get_list_as_admin(self):
        """
        Test getting user list as a admin user.
        """
        admin_user = get_user_model().objects.create(
            username="admin_user", is_staff=True
        )
        self.switch_user(admin_user)
        with self.assertNumQueries(3):
            response = self.client.get("/api/user/")
            self.assertEqual(response.status_code, 200)

            data = response.data
            self.assertDictEqual(
                {
                    "count": 3,
                    "next": None,
                    "previous": None,
                    "results": [
                        {
                            "id": data["results"][0]["id"],
                            "username": "testuser",
                            "email": "",
                        },
                        {
                            "id": data["results"][1]["id"],
                            "username": "clientuser",
                            "email": "",
                        },
                        {
                            "id": data["results"][2]["id"],
                            "username": "admin_user",
                            "email": "",
                        },
                    ],
                },
                data,
            )
