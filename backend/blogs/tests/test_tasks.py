from backend.base.testcase import BaseTestCase
from blogs.tasks import create_tasks, subtask_a, subtask_b
from unittest.mock import patch, call
from celery.result import AsyncResult
from django.test.utils import override_settings
import time
from celery.contrib.testing.worker import start_worker
from backend.celery import app
from django_celery_results.models import TaskResult


class TestBlogTask(BaseTestCase):
    """
    Tests for blog tasks.
    """

    @patch("blogs.tasks.subtask_b")
    @patch("blogs.tasks.subtask_a")
    def test_create_tasks_subtask_calls(self, subtask_a, subtask_b):
        """
        Test create_tasks calls the right subtasks with the right args.
        """
        create_tasks.apply_async(args=["hello"])

        # subtask_a calls:
        self.assertListEqual(
            [
                call.apply_async(
                    args=[
                        "hello",
                    ],
                    eta="2025",
                ),
                call.apply_async(
                    args=[
                        "hello",
                    ],
                    eta="2027",
                ),
            ],
            subtask_a.method_calls,
        )

        # subtask_b calls:
        self.assertListEqual(
            [
                call.apply_async(
                    args=[
                        "hello",
                    ],
                    eta="2026",
                ),
            ],
            subtask_b.method_calls,
        )

    def test_create_tasks(self):
        """
        Test create_tasks.
        """
        with self.assertNumQueries(0):
            task = create_tasks.apply_async(args=["hello"])
            self.assertEqual("SUCCESS", task.status)
            self.assertEqual(3, len(task.result["task_ids"]))
            # TaskResults or other side-effects?

    def test_subtask_a(self):
        task = subtask_a.apply_async(args=["subtask_a"], eta="2025")
        self.assertEqual("SUCCESS", task.status)
        self.assertEqual("Task A processed subtask_a", task.result)

    def test_subtask_b(self):
        task = subtask_b.apply_async(args=["subtask_b"], eta="2050-01-01T00:00:00Z")
        self.assertEqual("SUCCESS", task.status)
        self.assertEqual("Task B processed subtask_b", task.result)
