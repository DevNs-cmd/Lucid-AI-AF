"""Production logging system for the LUCID AI Backend.

Provides trace and span injection functionality if OpenTelemetry is active,
while configuring structured JSON outputs for production systems and formatted
readable outputs for development environments.
"""

import json
import logging
import logging.config
import sys
from typing import Any
from app.config.settings import settings

try:
    from opentelemetry import trace
except ImportError:
    trace = None


class StructuredJSONFormatter(logging.Formatter):
    """Formats log records as structured, machine-readable JSON strings."""

    def format(self, record: logging.LogRecord) -> str:
        """Converts a LogRecord instance into structured JSON representation.

        Injects tracing telemetry context dynamically if OpenTelemetry is set up.
        """
        log_payload: dict[str, Any] = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "message": record.getMessage(),
            "logger": record.name,
            "file": record.filename,
            "line": record.lineno,
            "function": record.funcName,
            "process": record.process,
            "thread": record.threadName,
        }

        # Inject OpenTelemetry tracing telemetry attributes
        if trace:
            current_span = trace.get_current_span()
            if current_span and current_span.get_span_context().is_valid:
                context = current_span.get_span_context()
                log_payload["trace_id"] = f"{context.trace_id:032x}"
                log_payload["span_id"] = f"{context.span_id:016x}"

        if record.exc_info:
            log_payload["exception"] = self.formatException(record.exc_info)

        return json.dumps(log_payload)


def configure_logging() -> None:
    """Configures system-wide standard logging configurations.

    Utilizes Structured JSON Formatter inside Docker environments (production/staging)
    to facilitate pipeline log collectors (such as Datadog, Grafana Loki, or Elasticsearch).
    """
    is_production = settings.ENVIRONMENT in ("production", "staging")

    log_format = (
        "[%(asctime)s] %(levelname)-8s %(name)s:%(funcName)s:%(lineno)d - %(message)s"
    )

    logging_config: dict[str, Any] = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "console_dev": {
                "format": log_format,
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
            "console_prod": {
                "()": StructuredJSONFormatter,
                "datefmt": "%Y-%m-%dT%H:%M:%SZ",
            },
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "stream": sys.stdout,
                "formatter": "console_prod" if is_production else "console_dev",
            }
        },
        "loggers": {
            "": {
                "handlers": ["console"],
                "level": settings.LOG_LEVEL,
                "propagate": True,
            },
            "uvicorn": {
                "handlers": ["console"],
                "level": "INFO",
                "propagate": False,
            },
            "uvicorn.access": {
                "handlers": ["console"],
                "level": "INFO",
                "propagate": False,
            },
            "uvicorn.error": {
                "handlers": ["console"],
                "level": "INFO",
                "propagate": False,
            },
            "sqlalchemy.engine": {
                "handlers": ["console"],
                "level": "WARNING" if is_production else "INFO",
                "propagate": False,
            },
            "celery": {
                "handlers": ["console"],
                "level": settings.LOG_LEVEL,
                "propagate": False,
            },
            "qdrant_client": {
                "handlers": ["console"],
                "level": "WARNING",
                "propagate": False,
            },
        },
    }

    logging.config.dictConfig(logging_config)