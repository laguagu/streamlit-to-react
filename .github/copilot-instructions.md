IMPORTANT: Keep this updated with any architecture changes, treating this as the source of truth for developers.

Stack

- Python 3.12+, FastAPI, Pydantic v2, asyncpg
- uv for .venv (`uv sync`, `uv run`), Alembic for migrations

FastAPI

- Use async def for I/O, def for pure funcs
- Routers/, schemas/, models/, utils/, middlewares/
- Validate with Pydantic models; type hints everywhere
- Middleware for logging, caching, rate limiting
- Raise HTTPException for expected errors; guard clauses early

AI Agents

- Default model: GPT-5
- Use structured outputs (Pydantic/Zod schemas or OpenAI native `client.responses.parse` endpoint)
- Prefer structured outputs over free-form strings when the schema is known

