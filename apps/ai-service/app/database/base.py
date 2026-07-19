"""Database base model module for the LUCID AI Backend.

Configures a modern declarative mapping base with strict metadata constraint naming
conventions to assist clean Alembic migrations. Includes standard temporal tracking mixins.
"""

from datetime import datetime
from sqlalchemy import MetaData, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

# Strict metadata naming convention to avoid migration failures on constraints
NAMING_CONVENTION = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}

metadata = MetaData(naming_convention=NAMING_CONVENTION)


class Base(DeclarativeBase):
    """Abstract base class for all SQLAlchemy ORM database models."""

    metadata = metadata


class TimestampMixin:
    """Standard database schema audit mixin to support automatic record logging.

    Enables creation and modification timestamp records tracking.
    """

    created_at: Mapped[datetime] = mapped_column(
        default=func.now(),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        default=func.now(),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )