#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

import coverage


class CoverageThresholdError(Exception):
    """Exception raised when coverage falls below the acceptable threshold."""

    def __init__(self, coverage_percentage, threshold):
        self.coverage_percentage = coverage_percentage
        self.threshold = threshold
        super().__init__(
            f"Coverage {coverage_percentage:.2f}% is below the required of {threshold}%"
        )


def main():
    """Run administrative tasks."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
    try:
        from django.core.management import (
            execute_from_command_line,
        )
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc

    test_env = sys.argv[1] == "test"

    cov_report = test_env and len(sys.argv) == 2  # user is running all the tests

    if cov_report:
        min_threshold = 80
        cov = coverage.Coverage()
        cov.start()
        try:
            execute_from_command_line(sys.argv)
        finally:
            cov.stop()
            cov.save()
            total_coverage = cov.report(show_missing=True)
            if total_coverage < min_threshold:
                raise CoverageThresholdError(total_coverage, min_threshold)
    else:
        execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
