"""
Api tests for users.
"""

from backend.base.testcase import BaseTestCase
from django.contrib.auth import (
    get_user_model,
)
from rest_framework.exceptions import ErrorDetail


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
                    "user": {"username": "testuser", "id": self.user.id},
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
