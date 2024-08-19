"""
Testing tools.
"""

from django.test import TestCase
from django.contrib.auth import (
    get_user_model,
)
from freezegun import freeze_time
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.test import APIClient


class BaseTestCase(TestCase):
    """
    Basetestcase.
    """

    freeze_time_str = "2023-08-12 10:30:00.12"
    tz_offset = 0

    # @classmethod
    # def setUpClass(cls):
    #     # super().setUpClass()
    #     cls.user = get_user_model().objects.create_user(
    #         username='testuser',
    #         password='testpassword'
    #     )
    #     refresh = RefreshToken.for_user(cls.user)
    #     cls.access_token = str(refresh.access_token)
    #     print("setuppi-----------",cls.access_token)
    #     cls.api_client = APIClient()
    #     cls.api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + cls.access_token)

    def setUp(self):
        self.freezer = freeze_time(self.freeze_time_str, self.tz_offset)
        self.frozen_time = self.freezer.start()
        self.user = get_user_model().objects.create_user(
            username="testuser", password="testpassword"
        )

        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        print("setuppi-----------", self.access_token)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + self.access_token)

    def tearDown(self):
        self.freezer.stop()

    def move_time(self, time_str: str) -> None:
        """
        Move the frozen time to a new specified datetime.

        Args:
            time_str (str): The new time to set, in the format 'YYYY-MM-DD HH:MM:SS'.

        Example:
            self.move_time("2024-08-12 18:00:00")
        """
        self.frozen_time.move_to(time_str)
