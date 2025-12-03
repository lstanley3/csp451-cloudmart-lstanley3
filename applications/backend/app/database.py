"""
Database connection handling
"""

import asyncpg
import os
import logging
from typing import Optional, List, Dict, Any

logger = logging.getLogger(__name__)


class Database:
    def __init__(self) -> None:
        self.pool: Optional[asyncpg.Pool] = None
        # Default DSN points to the "postgres" container from docker-compose
        self.dsn = os.environ.get(
            "DATABASE_URL",
            "postgresql://cloudmart:password@postgres:5432/cloudmart",
        )

    async def connect(self) -> None:
        """Create connection pool"""
        self.pool = await asyncpg.create_pool(
            self.dsn,
            min_size=1,
            max_size=10,
        )
        logger.info("Database connection pool created")

    async def disconnect(self) -> None:
        """Close connection pool"""
        if self.pool is not None:
            await self.pool.close()
            logger.info("Database connection pool closed")

    async def fetch_all(self, query: str, *args) -> List[Dict[str, Any]]:
        """Fetch all rows from a query"""
        if self.pool is None:
            raise RuntimeError("Database pool is not initialized")
        async with self.pool.acquire() as conn:
            rows = await conn.fetch(query, *args)
            return [dict(row) for row in rows]

    async def fetch_one(self, query: str, *args) -> Optional[Dict[str, Any]]:
        """Fetch a single row from a query"""
        if self.pool is None:
            raise RuntimeError("Database pool is not initialized")
        async with self.pool.acquire() as conn:
            row = await conn.fetchrow(query, *args)
            return dict(row) if row is not None else None
