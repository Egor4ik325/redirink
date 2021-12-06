#!/usr/bin/env python
import os
import sys
from pathlib import Path

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.local")

    try:
        from django.core.management import execute_from_command_line
    except ImportError:
        # The above import may fail for some other reason. Ensure that the
        # issue is really that Django is missing to avoid masking other
        # exceptions on Python 2.
        try:
            import django  # noqa
        except ImportError:
            raise ImportError(
                "Couldn't import Django. Are you sure it's installed and "
                "available on your PYTHONPATH environment variable? Did you "
                "forget to activate a virtual environment?"
            )

        raise

    # This allows easy placement of apps within the interior
    # redirink directory.
    current_path = Path(__file__).parent.resolve()
    sys.path.append(str(current_path / "redirink"))

    from django.conf import settings

    # Start debug server for VS Code when any of the management commands is being executed (e.g. runserver_plus)
    if settings.DEBUG:
        if os.environ.get("RUN_MAIN") or os.environ.get("WERKZEUG_RUN_MAIN"):
            import logging

            import debugpy

            # Run debug server, server for any client
            debugpy.listen(("0.0.0.0", 5000))
            # debugpy.wait_for_client() # application won't start until client will be attached
            logging.debug("Client attached!")

    execute_from_command_line(sys.argv)
