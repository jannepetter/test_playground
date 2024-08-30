"""
Testing tools.
"""

from django.test import TestCase, override_settings
from django.contrib.auth import (
    get_user_model,
)
from freezegun import freeze_time
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.test import APIClient
from django_celery_results.models import TaskResult


@override_settings(
    PASSWORD_HASHERS=["django.contrib.auth.hashers.MD5PasswordHasher"],
    CELERY_TASK_ALWAYS_EAGER=True,
    # CELERY_TASK_STORE_EAGER_RESULT=True,
    # CELERY_RESULT_EXTENDED=True,
    # CELERY_BROKER_URL="memory://",
    # CELERY_RESULT_BACKEND="cache+memory://",
)
class BaseTestCase(TestCase):
    """
    Basetestcase.
    """

    maxDiff = None
    freeze_time_str = "2023-08-12 10:30:00.12"
    tz_offset = 0
    client_class = APIClient
    user = None

    @classmethod
    def setup_freeze(cls):
        cls.freezer = freeze_time(cls.freeze_time_str, cls.tz_offset)
        cls.frozen_time = cls.freezer.start()

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.client_user = get_user_model().objects.create_user(username="clientuser")
        if not cls.user:
            cls.user = cls.client_user
        refresh = RefreshToken.for_user(cls.user)
        cls.refresh = refresh
        cls.access_token = str(cls.refresh.access_token)

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.setup_freeze()

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        cls.freezer.stop()

    def setUp(self):
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + self.access_token)

    def switch_user(self, user):
        """
        Temporary switches the client user. The setUp will restore the original client user for the next test.
        """
        refresh = RefreshToken.for_user(user)
        self.client.credentials(
            HTTP_AUTHORIZATION="Bearer " + str(refresh.access_token)
        )

    def move_time(self, time_str: str) -> None:
        """
        Move the frozen time to a new specified datetime.

        Args:
            time_str (str): The new time to set, in the format 'YYYY-MM-DD HH:MM:SS'.

        Example:
            self.move_time("2024-08-12 18:00:00")
        """
        self.frozen_time.move_to(time_str)

    def extract_task_results(self):
        queryset = TaskResult.objects.all()
        return [
            {
                "task_name": i.task_name,
                "task_args": i.task_args,
                "task_kwargs": i.task_kwargs,
                "status": i.status,
                "date_done": i.date_done.isoformat(),
                "result": i.result,
            }
            for i in queryset
        ]
